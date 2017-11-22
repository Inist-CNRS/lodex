import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { CardText } from 'material-ui/Card';
import memoize from 'lodash.memoize';

import Card from '../../lib/components/Card';

import { field as fieldProptypes } from '../../propTypes';

import { fromCharacteristic } from '../selectors';
import { fromFields } from '../../sharedSelectors';

import DatasetCharacteristicItem from './DatasetCharacteristicItem';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    item: memoize((index, total) => ({
        display: 'flex',
        flexDirection: 'column',
        paddingTop: index > 0 ? '2rem' : 0,
        paddingBottom: index < total - 1 ? '1rem' : 0,
    })),
};

const DatasetCharacteristicsView = ({ characteristics }) => (
    <div className="dataset-characteristics">
        <div style={styles.container}>
            {characteristics.map((characteristicField, index) => (
                <div
                    key={characteristicField.name}
                    style={styles.item(index, characteristics.length)}
                >
                    <DatasetCharacteristicItem
                        characteristic={characteristicField}
                    />
                </div>
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
    const fields = fromFields.getDatasetFields(state);

    return {
        characteristics: fromCharacteristic.getRootCharacteristics(
            state,
            fields,
        ),
        fields,
    };
};

export default compose(connect(mapStateToProps))(DatasetCharacteristicsView);
