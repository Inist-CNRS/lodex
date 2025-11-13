import compose from 'recompose/compose';
import { Card, CardHeader, Divider } from '@mui/material';
import RemovedResourceList from './RemovedResourceList';
import withInitialData from '../withInitialData';
import redirectToDashboardIfNoField from '../redirectToDashboardIfNoField';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

export const RemovedResourcePageComponent = () => {
    const { translate } = useTranslate();
    return (
        <Card>
            <CardHeader
                title={<h3>{translate('hidden_resources')}</h3>}
                action={
                    <>
                        <ImportButton />
                        <ExportButton />
                    </>
                }
            />
            <Divider />
            <RemovedResourceList />
        </Card>
    );
};

export default compose(
    redirectToDashboardIfNoField,
    withInitialData,
)(RemovedResourcePageComponent);
