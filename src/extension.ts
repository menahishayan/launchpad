import * as vscode from "vscode";
import jenkins from "./api";
import { GitExtension } from "./git";

const setup = async () => {
  const configFiles = await vscode.workspace.findFiles(".launchpadrc.json", "/node_modules/", 1);
  const jenkinsKey = vscode.workspace.getConfiguration("launchpad").get("jenkinsKey");

  if (!jenkinsKey) {
    vscode.window.showInformationMessage("Launchpad: Jenkins API key not found");
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
  return { config: null, jenkinsKey };
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

export async function activate(context: vscode.ExtensionContext) {
  const { config, jenkinsKey } = await setup();
  let jenkinsInstance: ReturnType<typeof jenkins>;

  const username: string | undefined = vscode.workspace.getConfiguration("launchpad").get("jenkinsUsername");
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

  const jobParams = config.jenkins.jobs[0].params;
  const jobParamObj: any = Object.keys(jobParams).reduce((acc, key) => ({ ...acc, [key]: parseJobParams(jobParams[key], branchName) }), {});

  const buildCommand = vscode.commands.registerCommand("launchpad.build", () => {
    vscode.window
      .showInputBox({ ignoreFocusOut: true, title: "Enter Build Parameters", placeHolder: "server:alpha;test:true", value: jobParamObj["Branches"] })
      .then((data) => {
        if (data) {
          jenkinsInstance
            .createBuildWithParams(config.jenkins.jobs[0].name, jobParamObj)
            .then((data) => console.log(data))
            .catch((e) => console.error(e));
        }
      });
  });

  context.subscriptions.push(buildCommand);
}

// When is this called?
export function deactivate() {}
