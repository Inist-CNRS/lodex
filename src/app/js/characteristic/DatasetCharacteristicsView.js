import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import Card from '../lib/Card';

import {
    property as propertyPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';

import { isLoggedIn } from '../user';
import {
    getCharacteristicsLastVersion,
    toggleCharacteristicsEdition as toggleCharacteristicsEditionAction,
} from './';

import Property from '../lib/Property';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
};

const DatasetCharacteristics = ({
    canEdit,
    characteristics,
    p: polyglot,
    toggleCharacteristicsEdition,
}) => (
    <Card className="dataset-characteristics">
        <CardHeader
            title={polyglot.t('dataset_characteristics')}
        />
        <CardText style={styles.container}>
            {characteristics.map(({ name, value, scheme }) => (
                <Property name={name} value={value} scheme={scheme} />
            ))}
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

DatasetCharacteristics.propTypes = {
    canEdit: PropTypes.bool.isRequired,
    characteristics: PropTypes.arrayOf(propertyPropTypes),
    p: polyglotPropTypes.isRequired,
    toggleCharacteristicsEdition: PropTypes.func.isRequired,
};

DatasetCharacteristics.defaultProps = {
    characteristics: [],
    newCharacteristics: [],
};

const mapStateToProps = state => ({
    canEdit: isLoggedIn(state),
    characteristics: getCharacteristicsLastVersion(state),
});

const mapDispatchToProps = {
    toggleCharacteristicsEdition: toggleCharacteristicsEditionAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DatasetCharacteristics);
