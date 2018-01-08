import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { preLoadPublication } from '../';
import AddCharacteristic from '../addCharacteristic/AddCharacteristic';
import OntologyTable from './OntologyTable';
import { COVER_DATASET } from '../../../../common/cover';

const ALL = 'all';

export class OntologyComponent extends Component {
    componentWillMount() {
        this.props.preLoadPublication();
    }

    constructor(props) {
        super(props);
        this.state = { filter: ALL };
    }

    handleFilterChange = (_, __, filter) =>
        this.setState(state => ({
            ...state,
            filter,
        }));

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
                    >
                        <MenuItem value={ALL} primaryText={polyglot.t('all')} />
                        <MenuItem
                            value={'document'}
                            primaryText={polyglot.t('document')}
                        />
                        <MenuItem
                            value={'dataset'}
                            primaryText={polyglot.t('dataset')}
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
                    <AddCharacteristic />
                </CardActions>
            </Card>
        );
    }
}

OntologyComponent.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    preLoadPublication: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = {
    preLoadPublication,
};

export default compose(connect(null, mapDispatchToProps), translate)(
    OntologyComponent,
);
