import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { field as fieldProptypes } from '../../propTypes';

import { fromCharacteristic } from '../selectors';
import { fromFields } from '../../sharedSelectors';

import DatasetCharacteristicItem from './DatasetCharacteristicItem';

const styles = {
    container: {
        display: 'flex',
        flexFlow: 'row wrap',
        paddingTop: '2rem',
        paddingBottom: '1rem',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
    },
};

const DatasetCharacteristicsView = ({ characteristics }) => (
    <div className="dataset-characteristics">
        <div style={styles.container}>
            {characteristics.map(characteristicField => (
                <DatasetCharacteristicItem
                    key={characteristicField.name}
                    characteristic={characteristicField}
                    style={styles.item}
                />
            ))}
        </div>
    </div>
);

DatasetCharacteristicsView.propTypes = {
    characteristics: PropTypes.arrayOf(fieldProptypes).isRequired,
};

DatasetCharacteristicsView.defaultProps = {
    characteristics: [],
    newCharacteristics: [],
};

const mapStateToProps = state => {
    const fields = fromFields.getCharacteristicFields(state);

    return {
        characteristics: fromCharacteristic.getRootCharacteristics(
            state,
            fields,
        ),
        fields,
    };
};

export default compose(connect(mapStateToProps))(DatasetCharacteristicsView);
