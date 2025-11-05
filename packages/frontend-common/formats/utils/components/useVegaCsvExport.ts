// @ts-expect-error TS7016
import * as Papa from 'papaparse';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslate } from '../../../i18n/I18NContext';

// @ts-expect-error TS7006
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

// @ts-expect-error TS7006
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

export function useVegaCsvExport(data: { values: unknown }) {
    const { translate } = useTranslate();

    // Callback ref that triggers when the element changes
    const graphParentRef = useRef<HTMLDivElement | null>(null);

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
        let timer: ReturnType<typeof setTimeout>;
        // We need to rerun this function until the graphParentRef is set
        const initialize = () => {
            if (!graphParentRef.current) {
                timer = setTimeout(initialize, 100);
                return;
            }

            if (!isGraphExportableInCSV(data)) {
                return;
            }

            const vegaActionsList =
                graphParentRef.current.querySelector('.vega-actions');
            if (!vegaActionsList) {
                timer = setTimeout(initialize, 100);
                return;
            }
            // Check if the action is already present
            if (vegaActionsList.querySelector('.vega-export-csv')) {
                return;
            }
            // Create a new action
            // @see https://github.com/vega/vega-embed/issues/156
            const exportCsvAction = document.createElement('a');
            exportCsvAction.className = 'vega-export-csv';
            exportCsvAction.innerText = translate('vega_export_csv');
            exportCsvAction.href = '#';
            exportCsvAction.addEventListener('click', (e) => {
                e.preventDefault();
                exportData();
            });

            vegaActionsList.appendChild(exportCsvAction);
        };

        timer = setTimeout(initialize, 100);

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [data, exportData, translate, graphParentRef]);

    return graphParentRef;
}
