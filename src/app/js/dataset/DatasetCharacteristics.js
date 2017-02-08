import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardHeader, CardText } from 'material-ui/Card';
import Card from '../lib/Card';

import {
    property as propertyPropTypes,
    polyglot as polyglotPropTypes,
} from '../lib/propTypes';

import Property from '../lib/Property';

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
            {characteristics.map(({ name, value, scheme }) => <Property name={name} value={value} scheme={scheme} />)}
        </CardText>
    </Card>
);

DatasetCharacteristics.propTypes = {
    characteristics: PropTypes.arrayOf(propertyPropTypes),
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
