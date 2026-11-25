import { useContext } from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { UploadPage } from '../upload/UploadPage';
import { fromParsing } from '../selectors';
import { preLoadLoaders } from '../loader';
import withInitialData from '../withInitialData';
import { SiteWizardContext } from '../siteWizard/SiteWizardContext';

interface DataAddRouteComponentProps {
    canUploadFile: boolean;
}

export const DataAddRouteComponent = ({
    canUploadFile,
}: DataAddRouteComponentProps) => {
    const { openWizard } = useContext(SiteWizardContext);
    // the dataset may be cleared while this page is open: the wizard is
    // offered again, as on the data page
    return (
        <UploadPage
            isFirstFile={canUploadFile}
            onOpenWizard={canUploadFile ? openWizard : undefined}
        />
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    canUploadFile: fromParsing.canUpload(state),
});

const mapDispatchToProps = {
    preLoadLoaders,
};

export const DataAddRoute = compose(
    withInitialData,
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
        componentWillMount() {
            // @ts-expect-error TS2571
            this.props.preLoadLoaders();
        },
    }),
    // @ts-expect-error TS2345
)(DataAddRouteComponent);
