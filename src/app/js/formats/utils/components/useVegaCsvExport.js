import { useEffect, useRef, useCallback } from 'react';
import * as Papa from 'papaparse';

function download(data) {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = data;
    link.setAttribute('download', 'export.csv');
    link.click();
    setTimeout(() => {
        document.body.removeChild(link);
    }, 0);
}

export function useVegaCsvExport(polyglot, data) {
    const graphParentRef = useRef();

    const exportData = useCallback(() => {
        if (!Array.isArray(data.values) || !data.values.length) {
            return;
        }

        const csv = Papa.unparse(data.values, {
            delimiter: ';',
        });

        const dataUrl = `data:text/csv,${encodeURI(csv)}`;
        download(dataUrl);
    }, [data]);

    useEffect(() => {
        if (!graphParentRef.current) {
            return;
        }

        // This timeout is required for the vega actions to be rendered
        const timer = setTimeout(() => {
            const vegaActionsList =
                graphParentRef.current.querySelector('.vega-actions');

            // Create a new action
            // @see https://github.com/vega/vega-embed/issues/156
            const exportCsvAction = document.createElement('a');
            exportCsvAction.className = 'vega-export-csv';
            exportCsvAction.innerText = polyglot.t('export_csv');
            exportCsvAction.href = '#';
            exportCsvAction.addEventListener('click', (e) => {
                e.preventDefault();
                exportData();
            });

            vegaActionsList.appendChild(exportCsvAction);
        }, 0);

        return () => {
            clearTimeout(timer);

            if (!graphParentRef.current) {
                return;
            }

            const vegaExportCsvButton =
                graphParentRef.current.querySelector('.vega-export-csv');
            if (vegaExportCsvButton) {
                vegaExportCsvButton.remove();
            }
        };
    }, [graphParentRef.current, polyglot, exportData]);

    return graphParentRef;
}
