import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardHeader, CardText } from 'material-ui/Card';
import memoize from 'lodash.memoize';

import Card from '../../lib/Card';

import {
    field as fieldProptypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

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
        paddingBottom: index < total - 1 ? '3rem' : 0,
        paddingTop: '2rem',
    })),
};

const DatasetCharacteristicsView = ({
    characteristics,
    p: polyglot,
}) => (
    <Card className="dataset-characteristics">
        <CardHeader
            title={polyglot.t('dataset_characteristics')}
        />
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
    p: polyglotPropTypes.isRequired,
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
    translate,
)(DatasetCharacteristicsView);
