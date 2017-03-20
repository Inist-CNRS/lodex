import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import memoize from 'lodash.memoize';

import Card from '../../lib/Card';

import {
    field as fieldProptypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

import { isLoggedIn } from '../../user';
import {
    toggleCharacteristicsEdition as toggleCharacteristicsEditionAction,
} from './';

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
            {characteristics
                .map((characteristicField, index) => (
                    <div key={characteristicField.name} style={styles.item(index, characteristics.length)}>
                        <DatasetCharacteristicItem characteristic={characteristicField} />
                    </div>
                ))
        }
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

DatasetCharacteristicsView.propTypes = {
    canEdit: PropTypes.bool.isRequired,
    characteristics: PropTypes.arrayOf(fieldProptypes).isRequired,
    p: polyglotPropTypes.isRequired,
    toggleCharacteristicsEdition: PropTypes.func.isRequired,
};

DatasetCharacteristicsView.defaultProps = {
    characteristics: [],
    newCharacteristics: [],
};

const mapStateToProps = (state) => {
    const fields = fromPublication.getDatasetFields(state);

    return {
        canEdit: isLoggedIn(state),
        characteristics: fromCharacteristic.getRootCharacteristics(state, fields),
        fields,
    };
};

const mapDispatchToProps = {
    toggleCharacteristicsEdition: toggleCharacteristicsEditionAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DatasetCharacteristicsView);
