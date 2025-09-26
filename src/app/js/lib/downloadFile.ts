// @ts-expect-error TS7006
export default async (blob, name) => {
    // @ts-expect-error TS7016
    const FileSaver = await import('file-saver'); // just importing file-saver use document.createElementNS
    FileSaver.saveAs(blob, name);
};
