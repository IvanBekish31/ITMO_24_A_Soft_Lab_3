import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "Labwork" is activated');
    context.subscriptions.push(
        vscode.commands.registerCommand('labwork.nop', async () => {
            vscode.window.showInformationMessage(`Extension is working`);
            draw_highlight();
        }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('labwork.inputTrack', async () => {
            const item_track = await vscode.window.showInputBox({
                placeHolder: 'Enter sequence to highligh',
                // Checks that it is a valid color code
                validateInput: (input) => {
                    if (input.length < 1) {
                        return `At least 1 character`;
                    }
                    return null;
                },
            });

            // Check for successful input
            if (!item_track) {
                // vscode.window.showInformationMessage('Cancelled');
                return;
            }
            text_track = item_track;

            const item_pick_type = await vscode.window.showQuickPick(
                ['Any subsequence', 'Matching lexem'],
                {
                    placeHolder: 'Track mode',
                    /*
                    onDidSelectItem: (item) => {
                        window.showInformationMessage(`Just selected: ${item}`);
                    },
                    */
                },
            );

            if (item_pick_type === 'Any subsequence') {
                flag_any = true;
            }
            if (item_pick_type === 'Matching lexem') {
                flag_any = false;
            }
            vscode.window.showInformationMessage(
                `Just selected: "${item_track}" for mode ${item_pick_type}`,
            );
            draw_highlight();
        }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('labwork.inputDecor', async () => {
            var char_inspect;
            var text_msg = 'Enter a valid HEX Code';
            var color_set_i = await vscode.window.showInputBox({
                // value: 'PreFill',
                // valueSelection: [3, 7], // "Fill" is pre-selected
                placeHolder: 'HEX Color code',
                // Checks that it is a valid color code
                validateInput: (input) => {
                    if (input.length !== 6) {
                        return text_msg;
                    }
                    input = input.toUpperCase();
                    var index_char: number = 0;
                    for (; index_char < 6; ++index_char) {
                        char_inspect = input[index_char];
                        if (
                            !(
                                (char_inspect >= 'A' && char_inspect <= 'F') ||
                                (char_inspect >= '0' && char_inspect <= '9')
                            )
                        ) {
                            return text_msg;
                        }
                    }
                    return null;
                },
            });

            // Check for successful input
            if (color_set_i === undefined) {
                // vscode.window.showInformationMessage('Cancelled');
                return;
            }
            if (vs_editor) {
                vs_editor.setDecorations(decor_comb, []);
            }
            text_color = '#' + color_set_i.toUpperCase();
            vscode.window.showInformationMessage(`Set color >${text_color}<`);
            draw_highlight();
        }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('labwork.switchBorder', async () => {
            flag_border = !flag_border;
            draw_highlight();
        }),
    );

    let timeout: NodeJS.Timeout | undefined = undefined;

    var vs_editor = vscode.window.activeTextEditor;

    var flag_work: Boolean = false;

    var flag_border = true;
    var text_color = '#DDDD00';
    var decor_comb: vscode.TextEditorDecorationType =
        vscode.window.createTextEditorDecorationType({
            color: '#DDDD00',
            borderWidth: '1px',
            borderStyle: 'solid',
        });

    var text_track: string = '';
    var flag_any: Boolean = false;

    function check_is_letter(char: string): Boolean {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    }

    function draw_highlight() {
        if (!vs_editor) {
            return;
        }

        var text_doc = vs_editor.document.getText();
        var array_ranges: vscode.DecorationOptions[] = [];

        var index_start = -1;
        var size_pick = text_track.length;
        if (size_pick < 1) {
            return;
        }
        var pos_start: vscode.Position;
        var pos_end: vscode.Position;

        while (true) {
            index_start = text_doc.indexOf(text_track, index_start + 1);
            if (index_start < 0) {
                break;
            }

            if (!flag_any) {
                if (
                    check_is_letter(text_doc[index_start - 1]) ||
                    check_is_letter(text_doc[index_start + size_pick])
                ) {
                    continue;
                }
            }

            pos_start = vs_editor.document.positionAt(index_start);
            pos_end = vs_editor.document.positionAt(index_start + size_pick);

            array_ranges.push({
                range: new vscode.Range(pos_start, pos_end),
            });
        }
        vs_editor.setDecorations(decor_comb, []);
        decor_comb = vscode.window.createTextEditorDecorationType({
            color: text_color,
            borderWidth: (flag_border ? '1px' : '0px'),
            borderStyle: 'solid',
        });
        vs_editor.setDecorations(decor_comb, array_ranges);
    }

    function draw_call(flag_sleep: Boolean) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        if (flag_sleep) {
            timeout = setTimeout(draw_highlight, 17);
        } else {
            draw_highlight();
        }
    }

    if (vs_editor) {
        draw_call(false);
    }

    vscode.window.onDidChangeActiveTextEditor(
        (vs_editor_new) => {
            vs_editor = vs_editor_new;
            draw_call(false);
        },
        null,
        context.subscriptions,
    );

    vscode.workspace.onDidChangeTextDocument(
        (event) => {
            if (vs_editor && event.document === vs_editor.document) {
                draw_call(true);
            }
        },
        null,
        context.subscriptions,
    );
}

export function deactivate() {}
