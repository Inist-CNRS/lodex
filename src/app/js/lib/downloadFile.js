import FileSaver from 'file-saver';

export default (blob, name) => {
    FileSaver.saveAs(blob, name);
};
