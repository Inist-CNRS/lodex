import ace from 'ace-builds';

// Extension modules
ace.config.setModuleUrl(
    'ace/ext/beautify',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-beautify.js'),
);
ace.config.setModuleUrl(
    'ace/ext/code_lens',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-code_lens.js'),
);
ace.config.setModuleUrl(
    'ace/ext/command_bar',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-command_bar.js'),
);
ace.config.setModuleUrl(
    'ace/ext/elastic_tabstops_lite',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-elastic_tabstops_lite.js'),
);
ace.config.setModuleUrl(
    'ace/ext/emmet',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-emmet.js'),
);
ace.config.setModuleUrl(
    'ace/ext/error_marker',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-error_marker.js'),
);
ace.config.setModuleUrl(
    'ace/ext/hardwrap',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-hardwrap.js'),
);
ace.config.setModuleUrl(
    'ace/ext/inline_autocomplete',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-inline_autocomplete.js'),
);
ace.config.setModuleUrl(
    'ace/ext/keyboard_menu',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-keybinding_menu.js'),
);
ace.config.setModuleUrl(
    'ace/ext/language_tools',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-language_tools.js'),
);
ace.config.setModuleUrl(
    'ace/ext/linking',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-linking.js'),
);
ace.config.setModuleUrl(
    'ace/ext/modelist',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-modelist.js'),
);
ace.config.setModuleUrl(
    'ace/ext/options',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-options.js'),
);
ace.config.setModuleUrl(
    'ace/ext/prompt',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-prompt.js'),
);
ace.config.setModuleUrl(
    'ace/ext/searchbox',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-searchbox.js'),
);
ace.config.setModuleUrl(
    'ace/ext/settings_menu',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-settings_menu.js'),
);
ace.config.setModuleUrl(
    'ace/ext/simple_tokenizer',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-simple_tokenizer.js'),
);
ace.config.setModuleUrl(
    'ace/ext/spellcheck',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-spellcheck.js'),
);
ace.config.setModuleUrl(
    'ace/ext/split',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-split.js'),
);
ace.config.setModuleUrl(
    'ace/ext/static_highlight',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-static_highlight.js'),
);
ace.config.setModuleUrl(
    'ace/ext/statusbar',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-statusbar.js'),
);
ace.config.setModuleUrl(
    'ace/ext/textarea',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-textarea.js'),
);
ace.config.setModuleUrl(
    'ace/ext/whitespace',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/ext-whitespace.js'),
);
ace.config.setModuleUrl(
    'ace/keyboard/vscode',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/keybinding-vscode.js'),
);

// Programing languages
ace.config.setModuleUrl(
    'ace/mode/html',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-html.js'),
);
ace.config.setModuleUrl(
    'ace/mode/ini',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-ini.js'),
);
ace.config.setModuleUrl(
    'ace/mode/json',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-json.js'),
);
ace.config.setModuleUrl(
    'ace/mode/json5',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-json5.js'),
);
ace.config.setModuleUrl(
    'ace/mode/markdown',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-markdown.js'),
);
ace.config.setModuleUrl(
    'ace/mode/text',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-text.js'),
);
ace.config.setModuleUrl(
    'ace/mode/xml',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/mode-xml.js'),
);

// Theme
ace.config.setModuleUrl(
    'ace/theme/monokai',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/theme-monokai.js'),
);

// Worker
ace.config.setModuleUrl(
    'ace/mode/html_worker',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/worker-html.js'),
);
ace.config.setModuleUrl(
    'ace/mode/json_worker',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/worker-json.js'),
);
ace.config.setModuleUrl(
    'ace/mode/xml_worker',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/worker-xml.js'),
);

// Snippets
ace.config.setModuleUrl(
    'ace/snippets/html',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/html.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/json',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/json.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/json5',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/json5.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/markdown',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/markdown.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/text',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/text.js'),
);
ace.config.setModuleUrl(
    'ace/snippets/xml',
    window.lazyLoader +
        require('file-loader?esModule=false!../../node_modules/ace-builds/src-noconflict/snippets/xml.js'),
);
