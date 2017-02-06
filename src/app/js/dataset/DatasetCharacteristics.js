import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardHeader, CardText } from 'material-ui/Card';
import Card from '../lib/Card';

import {
    datasetCharacteristic as datasetCharacteristicPropTypes,
    polyglot as polyglotPropTypes,
} from '../lib/propTypes';

import DatasetCharacteristicsItem from './DatasetCharacteristicsItem';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
};

const DatasetCharacteristics = ({ characteristics, p: polyglot }) => (
    <Card className="dataset-characteristics">
        <CardHeader title={polyglot.t('dataset_characteristics')} />
        <CardText style={styles.container}>
            {characteristics.map(characteristic => <DatasetCharacteristicsItem characteristic={characteristic} />)}
        </CardText>
    </Card>
);

DatasetCharacteristics.propTypes = {
    characteristics: PropTypes.arrayOf(datasetCharacteristicPropTypes),
    p: polyglotPropTypes.isRequired,
};

DatasetCharacteristics.defaultProps = {
    characteristics: [],
};

const mapStateToProps = ({ publication: { characteristics } }) => ({
    characteristics,
});

export default compose(
    connect(mapStateToProps),
    translate,
)(DatasetCharacteristics);
