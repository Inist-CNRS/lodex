// @ts-expect-error TS6133
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
        paddingBottom: '0rem',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
    },
};

const DatasetCharacteristicsView = ({
    // @ts-expect-error TS7031
    characteristics,
    // @ts-expect-error TS7031
    isMultilingual,
    // @ts-expect-error TS7031
    locale,
}) => {
    const filteredCharacteristics = characteristics.filter(
        // @ts-expect-error TS7006
        (characteristic) =>
            !isMultilingual ||
            !characteristic.language ||
            characteristic.language === locale,
    );
    return (
        <div className="dataset-characteristics">
            <div style={styles.container}>
                {/*
                 // @ts-expect-error TS7006 */}
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

// @ts-expect-error TS7006
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

// @ts-expect-error TS2345
export default compose(connect(mapStateToProps))(DatasetCharacteristicsView);
