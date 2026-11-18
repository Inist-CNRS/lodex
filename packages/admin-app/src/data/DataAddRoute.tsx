import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { UploadPage } from '../upload/UploadPage';
import { fromParsing } from '../selectors';
import { preLoadLoaders } from '../loader';
import withInitialData from '../withInitialData';

interface DataAddRouteComponentProps {
    canUploadFile: boolean;
}

export const DataAddRouteComponent = ({
    canUploadFile,
}: DataAddRouteComponentProps) => {
    return <UploadPage isFirstFile={canUploadFile} />;
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
