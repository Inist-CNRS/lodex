import { Alert } from '@mui/material';
import { useTranslate } from '../../../../i18n/I18NContext';

const DefaultAdmin = () => {
    const { translate } = useTranslate();
    return <Alert severity="info">{translate('format_without_params')}</Alert>;
};

export default DefaultAdmin;
