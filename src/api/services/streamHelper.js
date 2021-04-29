export const streamEnd = fd =>
    new Promise((resolve, reject) => {
        fd.on('end', () => resolve());
        fd.on('finish', () => resolve());
        fd.on('error', reject);
    });
