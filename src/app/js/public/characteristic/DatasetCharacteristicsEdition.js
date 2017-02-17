import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardActions, CardHeader, CardText } from 'material-ui/Card';

import Card from '../../lib/Card';

import {
    property as propertyPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

import {
    getNewCharacteristics,
    setCharacteristicValue as setCharacteristicValueAction,
    updateCharacteristics as updateCharacteristicsAction,
    isCharacteristicUpdating,
    getCharacteristicError,
} from './';

import PropertyEdition from '../PropertyEdition';
import ButtonWithStatus from '../../lib/ButtonWithStatus';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
};

const DatasetCharacteristics = ({
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
        <CardText style={styles.container}>
            {newCharacteristics.map(({ name, value, scheme }) => (
                <PropertyEdition
                    name={name}
                    onSetNewCharacteristicValue={setCharacteristicValue}
                    scheme={scheme}
                    value={value}
                />
            ))}
        </CardText>
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

DatasetCharacteristics.propTypes = {
    error: PropTypes.string.isRequired,
    newCharacteristics: PropTypes.arrayOf(propertyPropTypes),
    p: polyglotPropTypes.isRequired,
    setCharacteristicValue: PropTypes.func.isRequired,
    updateCharacteristics: PropTypes.func.isRequired,
    updating: PropTypes.bool.isRequired,
};

DatasetCharacteristics.defaultProps = {
    characteristics: [],
    newCharacteristics: [],
};

const mapStateToProps = state => ({
    error: getCharacteristicError(state),
    newCharacteristics: getNewCharacteristics(state),
    updating: isCharacteristicUpdating(state),
});

const mapDispatchToProps = {
    setCharacteristicValue: setCharacteristicValueAction,
    updateCharacteristics: updateCharacteristicsAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DatasetCharacteristics);
