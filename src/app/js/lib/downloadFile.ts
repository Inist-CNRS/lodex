export default async (blob, name) => {
    const FileSaver = await import('file-saver'); // just importing file-saver use document.createElementNS
    FileSaver.saveAs(blob, name);
};
