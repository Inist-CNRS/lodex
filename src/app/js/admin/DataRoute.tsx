import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import ParsingResult from './parsing/ParsingResult';
import { fromParsing, fromPublication } from './selectors';
import Upload from './upload/Upload';
import { preLoadLoaders } from './loader';
import withInitialData from './withInitialData';

interface DataRouteComponentProps {
    canUploadFile: boolean;
    hasPublishedDataset: boolean;
}

export const DataRouteComponent = ({
    canUploadFile,
}: DataRouteComponentProps) => {
    if (canUploadFile) {
        // @ts-expect-error TS2322
        return <Upload className="admin" isFirstFile={canUploadFile} />;
    }

    return (
        <div>
            <ParsingResult />
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    canUploadFile: fromParsing.canUpload(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

const mapDispatchToProps = {
    preLoadLoaders,
};

export const DataRoute = compose(
    withInitialData,
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
        componentWillMount() {
            // @ts-expect-error TS2571
            this.props.preLoadLoaders();
        },
    }),
    // @ts-expect-error TS2345
)(DataRouteComponent);
