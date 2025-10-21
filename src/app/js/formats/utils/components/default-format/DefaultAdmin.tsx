import { Alert } from '@mui/material';
import { translate } from '../../../../i18n/I18NContext';

interface DefaultAdminProps {
    p: unknown;
}

const DefaultAdmin = ({ p }: DefaultAdminProps) => {
    // @ts-expect-error TS18046
    return <Alert severity="info">{p.t('format_without_params')}</Alert>;
};

export default translate(DefaultAdmin);
