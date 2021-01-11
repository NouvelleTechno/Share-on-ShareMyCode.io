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
			lang: editor.document.languageId
		};

		axios.post(url, JSON.stringify(data), {
			headers: {
			  	"Content-Type": "application/json",
			  	"Accept": 'application/json',
			},
		}).then(response => {
			let responseData = "Open link";
			vscode.window.showInformationMessage(`Successfully shared`, responseData)
			.then(selection => {
				if (selection === responseData) {
					vscode.env.openExternal(vscode.Uri.parse(response.data.url));
				}
			});
		});

	});

	context.subscriptions.push(disposable);
}
export function deactivate() { }