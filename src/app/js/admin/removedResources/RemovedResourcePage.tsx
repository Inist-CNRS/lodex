import compose from 'recompose/compose';
import { Card, CardHeader, Divider } from '@mui/material';
import RemovedResourceList from './RemovedResourceList';
import withInitialData from '../withInitialData';
import redirectToDashboardIfNoField from '../../admin/redirectToDashboardIfNoField';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';
import { translate } from '../../i18n/I18NContext';

interface RemovedResourcePageComponentProps {
    p: unknown;
}

export const RemovedResourcePageComponent = ({
    p: polyglot,
}: RemovedResourcePageComponentProps) => {
    return (
        <Card>
            <CardHeader
                // @ts-expect-error TS18046
                title={<h3>{polyglot.t('hidden_resources')}</h3>}
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
    translate,
    // @ts-expect-error TS2345
)(RemovedResourcePageComponent);
