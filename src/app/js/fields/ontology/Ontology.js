import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { preLoadPublication } from '../';
import AddCharacteristic from '../addCharacteristic/AddCharacteristic';
import OntologyTable from './OntologyTable';
import { COVER_DATASET } from '../../../../common/cover';
import ExportFieldsButton from '../../public/export/ExportFieldsButton';
import ExportFieldsReadyButton from '../../public/export/ExportFieldsReadyButton';

const ALL = 'all';

export class OntologyComponent extends Component {
    componentWillMount() {
        this.props.preLoadPublication();
    }

    constructor(props) {
        super(props);
        this.state = { filter: COVER_DATASET };
    }

    handleFilterChange = (_, __, filter) => this.setState({ filter });

    render() {
        const { p: polyglot } = this.props;
        const { filter } = this.state;

        return (
            <Card>
                <CardHeader title={<h3>{polyglot.t('model')}</h3>} />
                <Divider />
                <CardText>
                    <SelectField
                        autoWidth
                        value={filter}
                        onChange={this.handleFilterChange}
                        style={{ width: 400 }}
                    >
                        <MenuItem
                            value={ALL}
                            primaryText={polyglot.t('model_filter_all')}
                        />
                        <MenuItem
                            value={'document'}
                            primaryText={polyglot.t('model_filter_document')}
                        />
                        <MenuItem
                            value={'dataset'}
                            primaryText={polyglot.t('model_filter_dataset')}
                        />
                    </SelectField>
                    {(filter === ALL || filter === COVER_DATASET) && (
                        <OntologyTable title="dataset" />
                    )}
                    {(filter === ALL || filter != COVER_DATASET) && (
                        <OntologyTable title="document" />
                    )}
                </CardText>
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
};

const mapDispatchToProps = {
    preLoadPublication,
};

export default compose(connect(null, mapDispatchToProps), translate)(
    OntologyComponent,
);
