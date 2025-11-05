import { useCallback, useMemo } from 'react';

export function useDownloader() {
    // @ts-expect-error TS7006
    const download = useCallback((filename, blob) => {
        const date = new Date()
            .toISOString()
            .replaceAll('T', '-')
            .replaceAll(':', '')
            .split('.')[0];

        const downloadedFilename = `${filename}_${date}.json`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadedFilename;
        document.body.appendChild(a);
        a.click();
        a.remove();

        return downloadedFilename;
    }, []);

    return useMemo(
        () => ({
            download,
        }),
        [download],
    );
}
