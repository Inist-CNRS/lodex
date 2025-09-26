import { formatBytes } from '@draconides/format';

const numberFormatter = new Intl.NumberFormat('fr-FR');

export const sizeConverter = (value) => {
    if (value == null) {
        return '-';
    }

    return formatBytes(Number(value), {
        style: 'octet',
        formatter: numberFormatter.format,
    });
};
