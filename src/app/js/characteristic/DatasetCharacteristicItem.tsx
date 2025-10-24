import camelCase from 'lodash/camelCase';
import { useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';

import Property from '../public/Property';
import { fromFields, fromCharacteristic } from '../sharedSelectors';
import type { CSSProperties } from 'react';
import type { State } from '../admin/reducers';

const LOADING_BOX_HEIGHT = 250;

const styles = {
    loading: {
        height: `${LOADING_BOX_HEIGHT}px`,
        width: '100%',
    },
    loaded: {
        height: '0px',
        width: '0px',
    },
};

interface DatasetCharacteristicItemComponentProps {
    characteristic: {
        name: string;
    };
    style: CSSProperties;
}

export const DatasetCharacteristicItemComponent = ({
    characteristic: { name },
    style,
}: DatasetCharacteristicItemComponentProps) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        rootMargin: `${LOADING_BOX_HEIGHT * 2}px 0px`,
    });

    const field = useSelector((state: State) =>
        fromFields.getFieldByName(state, name),
    );

    const getCharacteristicsAsResource = useSelector(
        fromCharacteristic.getCharacteristicsAsResource,
    );
    const resource = {
        name,
        ...getCharacteristicsAsResource,
    };

    return (
        <>
            <div ref={ref} style={inView ? styles.loaded : styles.loading} />
            {inView && (
                // @ts-expect-error TS2322
                <Property
                    resource={resource}
                    field={field}
                    style={style}
                    className={camelCase(field.internalName || '')}
                />
            )}
        </>
    );
};

export default DatasetCharacteristicItemComponent;
