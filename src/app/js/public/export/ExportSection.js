import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { List } from '@material-ui/core/List';
import Subheader from '@material-ui/core/Subheader';

import { fromExport } from '../selectors';
import {
    preLoadExporters,
    exportPublishedDataset as exportPublishedDatasetAction,
} from './';
import ExportItem from './ExportItem';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export class PureExportSection extends Component {
    constructor(props) {
        super(props);
        this.state = { exportedFields: [] };
    }

    UNSAFE_componentWillMount() {
        this.props.preLoadExporters();
    }

    handleSelectedFieldsChange = exportedFields => {
        this.setState({ exportedFields });
    };

    render() {
        const { exporters, handleExportClick, uri, p: polyglot } = this.props;

        if (!exporters || !exporters.length) {
            return null;
        }

        return (
            <div>
                <Subheader>{polyglot.t('export_data')}</Subheader>

                <List className="export">
                    {exporters.map(({ name }) => (
                        <ExportItem
                            key={name}
                            type={name}
                            uri={uri}
                            onClick={handleExportClick}
                        />
                    ))}
                </List>
            </div>
        );
    }
}

PureExportSection.propTypes = {
    exporters: PropTypes.arrayOf(PropTypes.object),
    handleExportClick: PropTypes.func.isRequired,
    preLoadExporters: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    uri: PropTypes.string,
};

PureExportSection.defaultProps = {
    exporters: [],
    uri: null,
};

const mapStateToProps = state => ({
    exporters: fromExport.getExporters(state),
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            preLoadExporters,
            handleExportClick: exportPublishedDatasetAction,
        },
        dispatch,
    );

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
)(PureExportSection);
