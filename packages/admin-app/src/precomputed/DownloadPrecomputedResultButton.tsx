import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { Button, type ButtonProps } from '@mui/material';
import { exportPrecomputedData } from '../api/precomputed';

export const DownloadPrecomputedResultButton = ({
    precomputedId,
}: {
    precomputedId: string;
}) => {
    const { translate } = useTranslate();

    const handleDownloadData = () => {
        exportPrecomputedData(precomputedId).then((response: any) => {
            const file = new Blob([response], { type: 'text/plain' });
            const element = document.createElement('a');
            element.href = URL.createObjectURL(file);
            element.download = 'precomputed-data-' + Date.now() + '.json';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        });
    };
    return (
        <Button
            onClick={handleDownloadData}
            variant={'link' as ButtonProps['variant']}
            sx={{
                paddingRight: 0,
                paddingLeft: 0,
                textDecoration: 'underline',
            }}
        >
            {translate('download_data')}
        </Button>
    );
};
