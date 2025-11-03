import { useSelector } from 'react-redux';

import {
    fromFields,
    fromCharacteristic,
} from '@lodex/frontend-common/sharedSelectors';

import DatasetCharacteristicItem from './DatasetCharacteristicItem';
import { fromDisplayConfig } from '../selectors';
import { useEffect, type CSSProperties } from 'react';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { State } from '../reducers';

const styles: Record<string, CSSProperties> = {
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

const DatasetCharacteristicsView = () => {
    console.log('DatasetCharacteristicsView render');
    useEffect(() => {
        console.log('DatasetCharacteristicsView mount useEffect');
    }, []);
    const fields = useSelector(fromFields.getDatasetFields);
    const characteristics =
        useSelector((state: State) =>
            fromCharacteristic.getRootCharacteristics(state, fields),
        ) || [];
    const isMultilingual = useSelector(fromDisplayConfig.isMultilingual);
    const { locale } = useTranslate();
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

export default DatasetCharacteristicsView;
