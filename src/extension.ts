import * as vscode from "vscode";
import jenkins from "./api";

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

export async function activate(context: vscode.ExtensionContext) {
  const { config, jenkinsKey } = await setup();
  let jenkinsInstance: ReturnType<typeof jenkins>;

  if (config && jenkinsKey !== null && typeof jenkinsKey === "string") {
    jenkinsInstance = jenkins(config.jenkins.username, jenkinsKey, config.jenkins.url);
  }

  const buildCommand = vscode.commands.registerCommand("launchpad.build", () => {
    vscode.window.showInputBox({ ignoreFocusOut: true, title: "Enter Build Parameters", placeHolder: "server:alpha, test:true" });
    jenkinsInstance
      .getLastBuildInfo(config.jenkins.jobs[0].name)
      .then((data) => console.log(data))
      .catch((e) => console.error(e));
  });

  context.subscriptions.push(buildCommand);
}

// When is this called?
export function deactivate() {}
