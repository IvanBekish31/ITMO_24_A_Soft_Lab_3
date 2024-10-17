"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_symbol_types = new Map();
const map_symbol_modifiers = new Map();
const mapper_symbol = (function () {
    const array_symbol_types = [
        'comment',
        'string',
        'keyword',
        'number',
        'regexp',
        'operator',
        'namespace',
        'type',
        'struct',
        'class',
        'interface',
        'enum',
        'typeParameter',
        'function',
        'method',
        'decorator',
        'macro',
        'variable',
        'parameter',
        'property',
        'label',
    ];
    array_symbol_types.forEach((symbol, index_symbol) => map_symbol_types.set(symbol, index_symbol));
    const array_symbol_modifiers = [
        'declaration',
        'documentation',
        'readonly',
        'static',
        'abstract',
        'deprecated',
        'modification',
        'async',
    ];
    array_symbol_modifiers.forEach((symbol, index_symbol) => map_symbol_modifiers.set(symbol, index_symbol));
    return new vscode.SemanticTokensLegend(array_symbol_types, array_symbol_modifiers);
})();
const disp_symbols = vscode.languages.registerDocumentSemanticTokensProvider({ language: 'semanticLanguage' }, new DocumentSemanticTokensProvider(), mapper_symbol);
const decoration_bold_blue = vscode.window.createTextEditorDecorationType({
    color: 'blue',
    fontWeight: 'bold',
});
const array_symbols_apply = [];
vscode.window.showInformationMessage(`Something big...${mapper_symbol.tokenModifiers}`);
//# sourceMappingURL=Store.js.map