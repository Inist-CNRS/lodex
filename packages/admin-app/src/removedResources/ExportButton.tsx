import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { exportHiddenResources } from '../api/hiddenResource';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const ExportButton = () => {
    const { translate } = useTranslate();
    const handleExport = async () => {
        const res = await exportHiddenResources();
        const file = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = file;
        link.download = 'hiddenResources.json';
        document.body.appendChild(link);
        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            }),
        );
        link.remove();
    };

    return (
        <Button
            variant="text"
            onClick={handleExport}
            className="export"
            startIcon={<DownloadIcon />}
        >
            {translate('export')}
        </Button>
    );
};

export default ExportButton;
