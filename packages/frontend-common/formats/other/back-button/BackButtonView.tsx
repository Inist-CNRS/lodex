import ArrowBack from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { withRouter } from 'react-router';
import { useTranslate } from '../../../i18n/I18NContext';

export default withRouter(function BackButtonView({
    history,
}: BackButtonViewProps) {
    const { translate } = useTranslate();

    const handleClick = () => {
        history.goBack();
    };

    return (
        <Button
            variant="outlined"
            color="primary"
            onClick={handleClick}
            startIcon={<ArrowBack />}
        >
            {translate('back_to_resource')}
        </Button>
    );
});

type BackButtonViewProps = {
    history: {
        goBack(): void;
    };
};
