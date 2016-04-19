"use strict";
import * as cp from "child_process";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand("git-tools.blame", blame);
    context.subscriptions.push(disposable);
}

export function deactivate() {
}

function blame() {
    let selection = vscode.window.activeTextEditor.selection;
    let start = selection.start.line + 1;
    let end = selection.end.line + 1;
    let channel = vscode.window.createOutputChannel("git-tools");

    cp.execFile(
        "git",
        [
            "blame",
            "-f",
            "-L",
            start + "," + end,
            vscode.window.activeTextEditor.document.fileName
        ], {
            cwd: vscode.workspace.rootPath
        }, (error, stdout, stderr) => {
            channel.show();
            if (error) {
                channel.append(error.message);
            }
            channel.append(stdout.toString());
            channel.append(stderr.toString());
        }
    );
}