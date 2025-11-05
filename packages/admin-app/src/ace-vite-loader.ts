import ace from 'ace-builds';

// Helper to resolve asset URLs with Vite
// @ts-expect-error TS7006
function assetUrl(relPath) {
    return new URL(
        `../../../node_modules/ace-builds/src-noconflict/${relPath}`,
        import.meta.url,
    ).href;
}

// Extension modules
ace.config.setModuleUrl('ace/ext/beautify', assetUrl('ext-beautify.js'));
ace.config.setModuleUrl('ace/ext/code_lens', assetUrl('ext-code_lens.js'));
ace.config.setModuleUrl('ace/ext/command_bar', assetUrl('ext-command_bar.js'));
ace.config.setModuleUrl(
    'ace/ext/elastic_tabstops_lite',
    assetUrl('ext-elastic_tabstops_lite.js'),
);
ace.config.setModuleUrl('ace/ext/emmet', assetUrl('ext-emmet.js'));
ace.config.setModuleUrl(
    'ace/ext/error_marker',
    assetUrl('ext-error_marker.js'),
);
ace.config.setModuleUrl('ace/ext/hardwrap', assetUrl('ext-hardwrap.js'));
ace.config.setModuleUrl(
    'ace/ext/inline_autocomplete',
    assetUrl('ext-inline_autocomplete.js'),
);
ace.config.setModuleUrl(
    'ace/ext/keyboard_menu',
    assetUrl('ext-keybinding_menu.js'),
);
ace.config.setModuleUrl(
    'ace/ext/language_tools',
    assetUrl('ext-language_tools.js'),
);
ace.config.setModuleUrl('ace/ext/linking', assetUrl('ext-linking.js'));
ace.config.setModuleUrl('ace/ext/modelist', assetUrl('ext-modelist.js'));
ace.config.setModuleUrl('ace/ext/options', assetUrl('ext-options.js'));
ace.config.setModuleUrl('ace/ext/prompt', assetUrl('ext-prompt.js'));
ace.config.setModuleUrl('ace/ext/searchbox', assetUrl('ext-searchbox.js'));
ace.config.setModuleUrl(
    'ace/ext/settings_menu',
    assetUrl('ext-settings_menu.js'),
);
ace.config.setModuleUrl(
    'ace/ext/simple_tokenizer',
    assetUrl('ext-simple_tokenizer.js'),
);
ace.config.setModuleUrl('ace/ext/spellcheck', assetUrl('ext-spellcheck.js'));
ace.config.setModuleUrl('ace/ext/split', assetUrl('ext-split.js'));
ace.config.setModuleUrl(
    'ace/ext/static_highlight',
    assetUrl('ext-static_highlight.js'),
);
ace.config.setModuleUrl('ace/ext/statusbar', assetUrl('ext-statusbar.js'));
ace.config.setModuleUrl('ace/ext/textarea', assetUrl('ext-textarea.js'));
ace.config.setModuleUrl('ace/ext/whitespace', assetUrl('ext-whitespace.js'));
ace.config.setModuleUrl(
    'ace/keyboard/vscode',
    assetUrl('keybinding-vscode.js'),
);

// Programing languages
ace.config.setModuleUrl('ace/mode/html', assetUrl('mode-html.js'));
ace.config.setModuleUrl('ace/mode/ini', assetUrl('mode-ini.js'));
ace.config.setModuleUrl('ace/mode/json', assetUrl('mode-json.js'));
ace.config.setModuleUrl('ace/mode/json5', assetUrl('mode-json5.js'));
ace.config.setModuleUrl('ace/mode/markdown', assetUrl('mode-markdown.js'));
ace.config.setModuleUrl('ace/mode/text', assetUrl('mode-text.js'));
ace.config.setModuleUrl('ace/mode/xml', assetUrl('mode-xml.js'));

// Theme
ace.config.setModuleUrl('ace/theme/monokai', assetUrl('theme-monokai.js'));

// Worker
ace.config.setModuleUrl('ace/mode/html_worker', assetUrl('worker-html.js'));
ace.config.setModuleUrl('ace/mode/json_worker', assetUrl('worker-json.js'));
ace.config.setModuleUrl('ace/mode/xml_worker', assetUrl('worker-xml.js'));

// Snippets
ace.config.setModuleUrl('ace/snippets/html', assetUrl('snippets/html.js'));
ace.config.setModuleUrl('ace/snippets/json', assetUrl('snippets/json.js'));
ace.config.setModuleUrl('ace/snippets/json5', assetUrl('snippets/json5.js'));
ace.config.setModuleUrl(
    'ace/snippets/markdown',
    assetUrl('snippets/markdown.js'),
);
ace.config.setModuleUrl('ace/snippets/text', assetUrl('snippets/text.js'));
ace.config.setModuleUrl('ace/snippets/xml', assetUrl('snippets/xml.js'));
