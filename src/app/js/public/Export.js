import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { List } from 'material-ui/List';

import { exportPublishedDataset as exportPublishedDatasetAction } from '../public/export';
import config from '../../../../config.json';
import ExportItem from './ExportItem';

export const ExportComponent = ({ handleExportClick, uri }) => (
    <List className="export">
        {
            config.exporters.map(type => (
                <ExportItem
                    key={type}
                    type={type}
                    uri={uri}
                    onClick={handleExportClick}
                />
            ))
        }
    </List>
);

ExportComponent.propTypes = {
    handleExportClick: PropTypes.func.isRequired,
    uri: PropTypes.string,
};

ExportComponent.defaultProps = {
    uri: null,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    handleExportClick: exportPublishedDatasetAction,
}, dispatch);

export default compose(
    connect(undefined, mapDispatchToProps),
)(ExportComponent);
