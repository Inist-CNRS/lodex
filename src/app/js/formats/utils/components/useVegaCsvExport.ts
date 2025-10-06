import * as Papa from 'papaparse';
import { useCallback, useEffect, useRef } from 'react';

function download(name, data) {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = data;
    link.setAttribute('download', name);
    link.click();
    setTimeout(() => {
        document.body.removeChild(link);
    }, 0);
}

export function getExportDateFormat() {
    const now = new Date();
    const today = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
    const time = `${now.getUTCHours()}${now.getUTCMinutes()}`;
    return `${today}-${time}`;
}

function isGraphExportableInCSV(data) {
    if (!data || !Array.isArray(data.values) || !data.values.length) {
        return false;
    }

    const firstElement = data.values[0];

    return (
        ('_id' in firstElement && 'value' in firstElement) ||
        ('source' in firstElement &&
            'target' in firstElement &&
            'weight' in firstElement)
    );
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
        download(`export_${getExportDateFormat()}.csv`, dataUrl);
    }, [data]);

    useEffect(() => {
        if (!graphParentRef.current) {
            return;
        }

        if (!isGraphExportableInCSV(data)) {
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
            exportCsvAction.innerText = polyglot.t('vega_export_csv');
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
    }, [graphParentRef.current, polyglot, data, exportData]);

    return graphParentRef;
}
