import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { field as fieldPropTypes } from '../propTypes';

import { fromFields, fromCharacteristic } from '../sharedSelectors';

import DatasetCharacteristicItem from './DatasetCharacteristicItem';
import { fromDisplayConfig, fromI18n } from '../public/selectors';

const styles = {
    container: {
        display: 'flex',
        flexFlow: 'row wrap',
        paddingTop: '2rem',
        paddingBottom: '1rem',
        gap: '1vw',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
    },
};

const DatasetCharacteristicsView = ({
    characteristics,
    isMultilingual,
    locale,
}) => {
    const filteredCharacteristics = characteristics.filter(
        (characteristic) =>
            !isMultilingual ||
            !characteristic.language ||
            characteristic.language === locale,
    );
    return (
        <div className="dataset-characteristics">
            <div style={styles.container}>
                {filteredCharacteristics.map((characteristicField) => (
                    <DatasetCharacteristicItem
                        key={characteristicField.name}
                        characteristic={characteristicField}
                        style={styles.item}
                    />
                ))}
            </div>
        </div>
    );
};

DatasetCharacteristicsView.propTypes = {
    characteristics: PropTypes.arrayOf(fieldPropTypes).isRequired,
    isMultilingual: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
};

DatasetCharacteristicsView.defaultProps = {
    characteristics: [],
    newCharacteristics: [],
};

const mapStateToProps = (state) => {
    const fields = fromFields.getDatasetFields(state);

    return {
        characteristics: fromCharacteristic.getRootCharacteristics(
            state,
            fields,
        ),
        fields,
        isMultilingual: fromDisplayConfig.isMultilingual(state),
        locale: fromI18n.getLocale(state),
    };
};

export default compose(connect(mapStateToProps))(DatasetCharacteristicsView);
