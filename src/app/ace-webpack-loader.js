import ace from 'ace-builds';

// Extension modules
ace.config.setModuleUrl(
    'ace/ext/beautify',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-beautify.js'),
);
ace.config.setModuleUrl(
    'ace/ext/code_lens',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-code_lens.js'),
);
ace.config.setModuleUrl(
    'ace/ext/command_bar',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-command_bar.js'),
);
ace.config.setModuleUrl(
    'ace/ext/elastic_tabstops_lite',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-elastic_tabstops_lite.js'),
);
ace.config.setModuleUrl(
    'ace/ext/emmet',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-emmet.js'),
);
ace.config.setModuleUrl(
    'ace/ext/error_marker',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-error_marker.js'),
);
ace.config.setModuleUrl(
    'ace/ext/hardwrap',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-hardwrap.js'),
);
ace.config.setModuleUrl(
    'ace/ext/inline_autocomplete',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-inline_autocomplete.js'),
);
ace.config.setModuleUrl(
    'ace/ext/keyboard_menu',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-keybinding_menu.js'),
);
ace.config.setModuleUrl(
    'ace/ext/language_tools',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-language_tools.js'),
);
ace.config.setModuleUrl(
    'ace/ext/linking',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-linking.js'),
);
ace.config.setModuleUrl(
    'ace/ext/modelist',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-modelist.js'),
);
ace.config.setModuleUrl(
    'ace/ext/options',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-options.js'),
);
ace.config.setModuleUrl(
    'ace/ext/prompt',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-prompt.js'),
);
ace.config.setModuleUrl(
    'ace/ext/searchbox',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-searchbox.js'),
);
ace.config.setModuleUrl(
    'ace/ext/settings_menu',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-settings_menu.js'),
);
ace.config.setModuleUrl(
    'ace/ext/simple_tokenizer',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-simple_tokenizer.js'),
);
ace.config.setModuleUrl(
    'ace/ext/spellcheck',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-spellcheck.js'),
);
ace.config.setModuleUrl(
    'ace/ext/split',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-split.js'),
);
ace.config.setModuleUrl(
    'ace/ext/static_highlight',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-static_highlight.js'),
);
ace.config.setModuleUrl(
    'ace/ext/statusbar',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-statusbar.js'),
);
ace.config.setModuleUrl(
    'ace/ext/textarea',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-textarea.js'),
);
ace.config.setModuleUrl(
    'ace/ext/whitespace',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-whitespace.js'),
);
ace.config.setModuleUrl(
    'ace/keyboard/vscode',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/keybinding-vscode.js'),
);

// Programing languages
ace.config.setModuleUrl(
    'ace/mode/html',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-html.js'),
);
ace.config.setModuleUrl(
    'ace/mode/ini',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-ini.js'),
);
ace.config.setModuleUrl(
    'ace/mode/json',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-json.js'),
);
ace.config.setModuleUrl(
    'ace/mode/json5',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-json5.js'),
);
ace.config.setModuleUrl(
    'ace/mode/markdown',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-markdown.js'),
);
ace.config.setModuleUrl(
    'ace/mode/text',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-text.js'),
);
ace.config.setModuleUrl(
    'ace/mode/xml',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-xml.js'),
);

// Theme
ace.config.setModuleUrl(
    'ace/theme/monokai',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/theme-monokai.js'),
);

// Worker
ace.config.setModuleUrl(
    'ace/mode/html_worker',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/worker-html.js'),
);
ace.config.setModuleUrl(
    'ace/mode/json_worker',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/worker-json.js'),
);
ace.config.setModuleUrl(
    'ace/mode/xml_worker',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/worker-xml.js'),
);

// Snippets
ace.config.setModuleUrl(
    'ace/snippets/html',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/html.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/json',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/json.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/json5',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/json5.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/markdown',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/markdown.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/text',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/text.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/xml',
    window.__JS_HOST__ +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/xml.js'),
);
