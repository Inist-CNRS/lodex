import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import Card from '../../lib/Card';

import {
    property as propertyPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

import { isLoggedIn } from '../../user';
import {
    toggleCharacteristicsEdition as toggleCharacteristicsEditionAction,
} from './';

import {
    fromCharacteristic,
    fromPublication,
} from '../../selectors';

import DatasetCharacteristicItem from './DatasetCharacteristicItem';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
};

const DatasetCharacteristicsView = ({
    canEdit,
    characteristics,
    fields,
    p: polyglot,
    toggleCharacteristicsEdition,
}) => (
    <Card className="dataset-characteristics">
        <CardHeader
            title={polyglot.t('dataset_characteristics')}
        />
        <CardText style={styles.container}>
            {fields
                .map(({ name, scheme }) => ({
                    name,
                    scheme,
                    value: characteristics[name],
                }))
                .map(characteristicField => (
                    <DatasetCharacteristicItem key={characteristicField.name} characteristic={characteristicField} />
                ))
        }
        </CardText>
        {canEdit &&
            <CardActions>
                <FlatButton
                    className="btn-edit-characteristics"
                    label={polyglot.t('edit')}
                    onClick={toggleCharacteristicsEdition}
                />
            </CardActions>
        }
    </Card>
);

DatasetCharacteristicsView.propTypes = {
    canEdit: PropTypes.bool.isRequired,
    characteristics: PropTypes.shape({}).isRequired,
    fields: PropTypes.arrayOf(propertyPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
    toggleCharacteristicsEdition: PropTypes.func.isRequired,
};

DatasetCharacteristicsView.defaultProps = {
    characteristics: [],
    newCharacteristics: [],
};

const mapStateToProps = state => ({
    canEdit: isLoggedIn(state),
    characteristics: fromCharacteristic.getCharacteristics(state),
    fields: fromPublication.getDatasetFields(state),
});

const mapDispatchToProps = {
    toggleCharacteristicsEdition: toggleCharacteristicsEditionAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DatasetCharacteristicsView);
