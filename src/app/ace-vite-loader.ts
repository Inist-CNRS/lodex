import ace from 'ace-builds';

// Helper to resolve asset URLs with Vite
// @ts-expect-error TS7006
function assetUrl(relPath) {
    return new URL(
        `../../node_modules/ace-builds/src-noconflict/${relPath}`,
        // @ts-expect-error TS1470
        import.meta.url,
    ).href;
}

// Extension modules
ace.config.setModuleUrl(
    'ace/ext/beautify',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-beautify.js'),
);
ace.config.setModuleUrl('ace/ext/code_lens', assetUrl('ext-code_lens.js'));
ace.config.setModuleUrl(
    'ace/ext/command_bar',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-command_bar.js'),
);
ace.config.setModuleUrl(
    'ace/ext/elastic_tabstops_lite',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-elastic_tabstops_lite.js'),
);
ace.config.setModuleUrl(
    'ace/ext/emmet',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-emmet.js'),
);
ace.config.setModuleUrl(
    'ace/ext/error_marker',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-error_marker.js'),
);
ace.config.setModuleUrl(
    'ace/ext/hardwrap',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-hardwrap.js'),
);
ace.config.setModuleUrl(
    'ace/ext/inline_autocomplete',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-inline_autocomplete.js'),
);
ace.config.setModuleUrl(
    'ace/ext/keyboard_menu',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-keybinding_menu.js'),
);
ace.config.setModuleUrl(
    'ace/ext/language_tools',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-language_tools.js'),
);
ace.config.setModuleUrl(
    'ace/ext/linking',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-linking.js'),
);
ace.config.setModuleUrl(
    'ace/ext/modelist',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-modelist.js'),
);
ace.config.setModuleUrl(
    'ace/ext/options',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-options.js'),
);
ace.config.setModuleUrl(
    'ace/ext/prompt',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-prompt.js'),
);
ace.config.setModuleUrl(
    'ace/ext/searchbox',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-searchbox.js'),
);
ace.config.setModuleUrl(
    'ace/ext/settings_menu',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-settings_menu.js'),
);
ace.config.setModuleUrl(
    'ace/ext/simple_tokenizer',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-simple_tokenizer.js'),
);
ace.config.setModuleUrl(
    'ace/ext/spellcheck',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-spellcheck.js'),
);
ace.config.setModuleUrl(
    'ace/ext/split',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-split.js'),
);
ace.config.setModuleUrl(
    'ace/ext/static_highlight',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-static_highlight.js'),
);
ace.config.setModuleUrl(
    'ace/ext/statusbar',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-statusbar.js'),
);
ace.config.setModuleUrl(
    'ace/ext/textarea',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-textarea.js'),
);
ace.config.setModuleUrl(
    'ace/ext/whitespace',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('ext-whitespace.js'),
);
ace.config.setModuleUrl(
    'ace/keyboard/vscode',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('keybinding-vscode.js'),
);

// Programing languages
ace.config.setModuleUrl(
    'ace/mode/html',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('mode-html.js'),
);
ace.config.setModuleUrl(
    'ace/mode/ini',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('mode-ini.js'),
);
ace.config.setModuleUrl(
    'ace/mode/json',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('mode-json.js'),
);
ace.config.setModuleUrl(
    'ace/mode/json5',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('mode-json5.js'),
);
ace.config.setModuleUrl(
    'ace/mode/markdown',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('mode-markdown.js'),
);
ace.config.setModuleUrl(
    'ace/mode/text',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('mode-text.js'),
);
ace.config.setModuleUrl(
    'ace/mode/xml',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('mode-xml.js'),
);

// Theme
ace.config.setModuleUrl(
    'ace/theme/monokai',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('theme-monokai.js'),
);

// Worker
ace.config.setModuleUrl(
    'ace/mode/html_worker',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('worker-html.js'),
);
ace.config.setModuleUrl(
    'ace/mode/json_worker',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('worker-json.js'),
);
ace.config.setModuleUrl(
    'ace/mode/xml_worker',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('worker-xml.js'),
);

// Snippets
ace.config.setModuleUrl(
    'ace/snippets/html',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('snippets/html.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/json',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('snippets/json.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/json5',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('snippets/json5.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/markdown',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('snippets/markdown.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/text',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('snippets/text.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/xml',
    // @ts-expect-error TS2339
    window.__JS_HOST__ + assetUrl('snippets/xml.js'),
);
