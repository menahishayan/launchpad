import * as vscode from "vscode";
import jenkins from "./api";
import { GitExtension } from "./git";
import { TConfig } from "./utils";

type TSetup = Promise<{
  config?: TConfig;
  jenkinsKey?: string;
  username?: string;
}>;

const setup = async (context: vscode.ExtensionContext): TSetup => {
  const configFiles = await vscode.workspace.findFiles(".launchpadrc.json", "/node_modules/", 1);
  let jenkinsKey = await context.secrets.get("jenkinsKey");
  let username = await context.secrets.get("jenkinsUsername");

  if (!jenkinsKey) {
    jenkinsKey = await vscode.window.showInputBox({ password: true, title: "Jenkins API Key", ignoreFocusOut: true });
    if (jenkinsKey) {
      context.secrets.store("jenkinsKey", jenkinsKey);
    }
  }
  if (!username) {
    username = await vscode.window.showInputBox({ title: "Jenkins Username", ignoreFocusOut: true });
    if (username) {
      context.secrets.store("jenkinsUsername", username);
    }
  }
  if (configFiles[0]) {
    const configFile = await vscode.workspace.openTextDocument(vscode.Uri.file(configFiles[0].path));
    const text = configFile.getText();
    let json = null;
    if (text?.length > 0) {
      json = JSON.parse(text);
    }
    return { config: json, jenkinsKey };
  } else {
    vscode.window.showInformationMessage("Launchpad: Config file not found");
  }
  return { config: undefined, jenkinsKey, username };
};

const parseJobParams = (param: any, branchName: string | undefined) => {
  switch (param.type) {
    case "select":
      return param.values[0];
    case "text":
      return param.default.replace("${branch_name}", branchName);
    case "checkbox":
      return param.default;
    default:
      return "";
  }
};

const getJobProgress = async ({ jenkinsInstance, job, queueId }: { jenkinsInstance: ReturnType<typeof jenkins>; job: string; queueId: number }) => {
  const jobInfo = await jenkinsInstance.getJobInfo(job);
  if (jobInfo) {
    const build = jobInfo.builds.find((build) => build.queueId === queueId);
    if (build?.inProgress) {
      const statusBarItem = vscode.window.createStatusBarItem(1, 4);
      statusBarItem.text = "$(loading~spin) Building";
      statusBarItem.show();
    }
  }
};

export async function activate(context: vscode.ExtensionContext) {
  const { config, jenkinsKey, username } = await setup(context);
  let jenkinsInstance: ReturnType<typeof jenkins>;

  if (config && jenkinsKey !== null && typeof jenkinsKey === "string" && username) {
    jenkinsInstance = jenkins(username, jenkinsKey, config.jenkins.url);
  }

  const gitExtension = vscode.extensions.getExtension<GitExtension>("vscode.git")?.exports;

  let branchName: string | undefined;
  if (gitExtension) {
    const api = gitExtension.getAPI(1);

    const repo = api.repositories[0];
    const head = repo.state.HEAD;

    branchName = head?.name;
  }

  const jobParams = config?.jenkins.jobs[0].params || {};
  const jobParamObj: any = Object.keys(jobParams).reduce((acc, key) => ({ ...acc, [key]: parseJobParams(jobParams[key], branchName) }), {});

  const buildCommand = vscode.commands.registerCommand("launchpad.build", async () => {
    if (!jenkinsInstance) {
      await vscode.window.showErrorMessage("Unable to connect to the Jenkins Server");
    } else {
      const parameterInput1 = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        title: "Enter Build Parameters",
        placeHolder: "server:alpha;test:true",
        value: jobParamObj["Branches"],
      });
      if (parameterInput1 && config?.jenkins.jobs[0].name) {
        jenkinsInstance
          .createBuildWithParams(config?.jenkins.jobs[0].name, jobParamObj)
          .then(({ queueId }) => getJobProgress({ jenkinsInstance, job: config?.jenkins.jobs[0].name, queueId }))
          .catch(() => vscode.window.showErrorMessage("Failed to build"));
      }
    }
  });

  context.subscriptions.push(buildCommand);
}

// When is this called?
export function deactivate() {}
