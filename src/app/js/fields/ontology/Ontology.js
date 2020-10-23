import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Select,
    MenuItem,
    FormControl,
} from '@material-ui/core';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import { preLoadPublication } from '../';
import AddCharacteristic from '../addCharacteristic/AddCharacteristic';
import OntologyTable from './OntologyTable';
import { COVER_DATASET } from '../../../../common/cover';
import ExportFieldsButton from '../../public/export/ExportFieldsButton';
import ExportFieldsReadyButton from '../../public/export/ExportFieldsReadyButton';

import redirectToDashboardIfNoField from '../../admin/redirectToDashboardIfNoField';

const ALL = 'all';

export class OntologyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { filter: COVER_DATASET };
    }

    UNSAFE_componentWillMount() {
        this.props.preLoadPublication();
    }

    handleFilterChange = e => this.setState({ filter: e.target.value });

    render() {
        const { p: polyglot } = this.props;
        const { filter } = this.state;

        return (
            <Card>
                <CardHeader title={<h3>{polyglot.t('model')}</h3>} />
                <Divider />
                <CardContent>
                    <FormControl fullWidth>
                        <Select
                            autoWidth
                            value={filter}
                            onChange={this.handleFilterChange}
                            style={{ width: 400 }}
                            className="select-filter"
                        >
                            <MenuItem value={ALL}>
                                {polyglot.t('model_filter_all')}
                            </MenuItem>
                            <MenuItem value={'document'}>
                                {polyglot.t('model_filter_document')}
                            </MenuItem>
                            <MenuItem value={'dataset'}>
                                {polyglot.t('model_filter_dataset')}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    {(filter === ALL || filter === COVER_DATASET) && (
                        <OntologyTable title="dataset" />
                    )}
                    {(filter === ALL || filter != COVER_DATASET) && (
                        <OntologyTable title="document" />
                    )}
                </CardContent>
                <CardActions>
                    <ExportFieldsButton />
                    <ExportFieldsReadyButton />
                    <AddCharacteristic />
                </CardActions>
            </Card>
        );
    }
}

OntologyComponent.propTypes = {
    preLoadPublication: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

const mapDispatchToProps = {
    preLoadPublication,
};

export default compose(
    connect(null, mapDispatchToProps),
    redirectToDashboardIfNoField,
    translate,
)(OntologyComponent);
