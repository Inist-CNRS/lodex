import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { CardText } from 'material-ui/Card';
import memoize from 'lodash.memoize';

import Card from '../../lib/components/Card';

import { field as fieldProptypes } from '../../propTypes';

import {
    fromCharacteristic,
    fromPublication,
} from '../selectors';

import DatasetCharacteristicItem from './DatasetCharacteristicItem';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    item: memoize((index, total) => ({
        display: 'flex',
        flexDirection: 'column',
        borderBottom: index < total - 1 ? '1px solid rgb(224, 224, 224)' : 'none',
        paddingTop: index > 0 ? '0.5rem' : 0,
        paddingBottom: index < total - 1 ? '0.5rem' : 0,
    })),
};

const DatasetCharacteristicsView = ({ characteristics }) => (
    <Card className="dataset-characteristics">
        <CardText style={styles.container}>
            {characteristics
                .map((characteristicField, index) => (
                    <div key={characteristicField.name} style={styles.item(index, characteristics.length)}>
                        <DatasetCharacteristicItem characteristic={characteristicField} />
                    </div>
                ))
        }
        </CardText>
    </Card>
);

DatasetCharacteristicsView.propTypes = {
    characteristics: PropTypes.arrayOf(fieldProptypes).isRequired,
};

DatasetCharacteristicsView.defaultProps = {
    characteristics: [],
    newCharacteristics: [],
};

const mapStateToProps = (state) => {
    const fields = fromPublication.getDatasetFields(state);

    return {
        characteristics: fromCharacteristic.getRootCharacteristics(state, fields),
        fields,
    };
};

export default compose(
    connect(mapStateToProps),
)(DatasetCharacteristicsView);
