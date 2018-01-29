export default (blob, name) => {
    const FileSaver = require('file-saver'); // just importing file-saver use document.createElementNS
    FileSaver.saveAs(blob, name);
};
