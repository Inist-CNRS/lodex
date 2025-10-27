import { CardContent, Card } from '@mui/material';
import { useTranslate } from '../i18n/I18NContext';

const NoDatasetComponent = () => {
    const { translate } = useTranslate();
    return (
        <Card sx={{ marginTop: '0.5rem' }}>
            <CardContent>{translate('no_dataset')}</CardContent>
        </Card>
    );
};

export default NoDatasetComponent;
