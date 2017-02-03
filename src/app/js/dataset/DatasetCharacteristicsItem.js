import React from 'react';
import { datasetCharacteristic as datasetCharacteristicPropTypes } from '../lib/propTypes';

const styles = {
    container: {
        display: 'flex',
        marginRight: '1rem',
    },
    name: {
        fontWeight: 'bold',
    },
};

const DatasetCharacteristicsItem = ({ characteristic: { name, value } }) => (
    <dl className="dataset-characteristic" style={styles.container}>
        <dt style={styles.name}>{name}</dt>
        <dd>{value}</dd>
    </dl>
);

DatasetCharacteristicsItem.propTypes = {
    characteristic: datasetCharacteristicPropTypes.isRequired,
};

export default DatasetCharacteristicsItem;
