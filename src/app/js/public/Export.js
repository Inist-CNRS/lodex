import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import { fromExport } from './selectors';
import {
    loadExporters as loadExportersAction,
    exportPublishedDataset as exportPublishedDatasetAction,
} from '../public/export';
import ExportItem from './ExportItem';
import { polyglot as polyglotPropTypes } from '../propTypes';

export class ExportComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { exportedFields: [] };
    }

    componentDidMount() {
        this.props.loadExporters();
    }

    handleSelectedFieldsChange = (exportedFields) => {
        this.setState({ exportedFields });
    }

    render() {
        const { exporters, handleExportClick, uri, p: polyglot } = this.props;

        if (!exporters || !exporters.length) {
            return null;
        }

        return (
            <div>
                <Subheader>{polyglot.t('export_data')}</Subheader>

                <List className="export">
                    {
                        exporters.map(({ name }) => (
                            <ExportItem
                                key={name}
                                type={name}
                                uri={uri}
                                onClick={handleExportClick}
                            />
                        ))
                    }
                </List>
            </div>
        );
    }
}

ExportComponent.propTypes = {
    exporters: PropTypes.arrayOf(PropTypes.object),
    handleExportClick: PropTypes.func.isRequired,
    loadExporters: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    uri: PropTypes.string,
};

ExportComponent.defaultProps = {
    exporters: [],
    uri: null,
};

const mapStateToProps = state => ({
    exporters: fromExport.getExporters(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    loadExporters: loadExportersAction,
    handleExportClick: exportPublishedDatasetAction,
}, dispatch);

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ExportComponent);
