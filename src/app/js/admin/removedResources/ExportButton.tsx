import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { exportHiddenResources } from '../api/hiddenResource';
import { translate } from '../../i18n/I18NContext';

interface ExportButtonProps {
    p: unknown;
}

const ExportButton = ({ p: polyglot }: ExportButtonProps) => {
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

    // @ts-expect-error TS18046
    const buttonLabel = polyglot.t('export');
    return (
        <Button
            variant="text"
            onClick={handleExport}
            className="export"
            startIcon={<DownloadIcon />}
        >
            {buttonLabel}
        </Button>
    );
};

export default translate(ExportButton);
