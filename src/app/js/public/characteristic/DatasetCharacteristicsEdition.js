import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardActions, CardHeader, CardText } from 'material-ui/Card';

import Card from '../../lib/Card';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

import {
    setCharacteristicValue as setCharacteristicValueAction,
    updateCharacteristics as updateCharacteristicsAction,
} from './';

import { fromCharacteristic, fromPublication } from '../selectors';

import PropertyEdition from '../PropertyEdition';
import ButtonWithStatus from '../../lib/ButtonWithStatus';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
};

const DatasetCharacteristicsEdition = ({
    error,
    newCharacteristics,
    p: polyglot,
    setCharacteristicValue,
    updateCharacteristics,
    updating,
}) => (
    <Card className="dataset-characteristics-edition">
        <CardHeader
            title={polyglot.t('dataset_characteristics')}
        />
        {newCharacteristics.map(({ label, name, value, scheme }) => (
            <CardText key={name} style={styles.container}>
                <PropertyEdition
                    name={name}
                    label={label}
                    onSetNewCharacteristicValue={setCharacteristicValue}
                    scheme={scheme}
                    value={value}
                />
            </CardText>
        ))}
        <CardActions>
            <ButtonWithStatus
                className="btn-update-characteristics"
                loading={updating}
                error={error}
                label={polyglot.t('save')}
                onClick={updateCharacteristics}
                primary
            />
        </CardActions>
    </Card>
);

DatasetCharacteristicsEdition.propTypes = {
    error: PropTypes.string,
    newCharacteristics: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
    setCharacteristicValue: PropTypes.func.isRequired,
    updateCharacteristics: PropTypes.func.isRequired,
    updating: PropTypes.bool.isRequired,
};

DatasetCharacteristicsEdition.defaultProps = {
    characteristics: [],
    newCharacteristics: [],
    error: null,
};

const mapStateToProps = (state) => {
    const fields = fromPublication.getDatasetFields(state);

    return {
        error: fromCharacteristic.getCharacteristicError(state),
        newCharacteristics: fromCharacteristic.getNewCharacteristics(state, fields),
        fields,
        updating: fromCharacteristic.isCharacteristicUpdating(state),
    };
};

const mapDispatchToProps = {
    setCharacteristicValue: setCharacteristicValueAction,
    updateCharacteristics: updateCharacteristicsAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DatasetCharacteristicsEdition);
