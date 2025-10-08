export const streamEnd = (fd: any) =>
    new Promise((resolve: any, reject: any) => {
        fd.on('end', () => resolve());
        fd.on('finish', () => resolve());
        fd.on('error', reject);
    });
