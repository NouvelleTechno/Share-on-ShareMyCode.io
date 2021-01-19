import * as vscode from 'vscode';
import axios, { AxiosPromise } from 'axios';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('share-on-sharemycode-io.share', () => {
		const url = "https://sharemycode.io/code/api/add";
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}

		let selection = editor.selection;
		let text = editor.document.getText(selection);
		if (!text) {
			text = editor.document.getText();
		}

		let data = {
			code: text,
			lang: editor.document.languageId,
			source: "vscode"
		};

		axios.post(url, JSON.stringify(data), {
			headers: {
				"Content-Type": "application/json",
				"Accept": 'application/json',
			},
		}).then(response => {
			let copyLink = "Copy link";
			let openLink = "Open link";
			switch (vscode.workspace.getConfiguration("share-on-sharemycode-io").get("defaultAction")) {
				case "ask":
					vscode.window.showInformationMessage(`Successfully shared`, copyLink, openLink)
						.then(selection => {
							if (selection === openLink) {
								vscode.env.openExternal(vscode.Uri.parse(response.data.url));
							} else if (selection === copyLink) {
								vscode.env.clipboard.writeText(response.data.url)
									.then(response => {
										vscode.window.showInformationMessage(`Link copied (This can be changed in settings)`);
									});
							}
						});
					break;
				case "open":
					vscode.env.openExternal(vscode.Uri.parse(response.data.url));
					break;
				case "copy":
					vscode.env.clipboard.writeText(response.data.url)
						.then(response => {
							vscode.window.showInformationMessage(`Link copied (This can be changed in settings)`);
						});
					break;
			}
		});

	});

	context.subscriptions.push(disposable);
}
export function deactivate() { }
