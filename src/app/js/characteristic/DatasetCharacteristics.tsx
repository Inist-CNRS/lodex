import compose from 'recompose/compose';
import { connect } from 'react-redux';

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

interface DatasetCharacteristicsViewProps {
    characteristics: {
        language?: string;
        name: string;
    }[];
    isMultilingual: boolean;
    locale: string;
}

const DatasetCharacteristicsView = ({
    characteristics,

    isMultilingual,

    locale,
}: DatasetCharacteristicsViewProps) => {
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
