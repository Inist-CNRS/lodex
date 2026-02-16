import { lazy, Suspense, useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import injectData from '../../injectData';
import Loading from '../../../components/Loading';
import { useTranslate } from '../../../i18n/I18NContext';
import type { Field } from '../../../fields/types';

interface ObjectViewProps {
    field: Field;
    resource: object;
    data?: any;
    params: any;
    debugMode: boolean;
}

const ObjectView = (props: ObjectViewProps) => {
    const { debugMode } = props;

    const { translate } = useTranslate();

    const json = useMemo(() => {
        if (!debugMode) {
            return props.data ?? [];
        }
        return props;
    }, [props, debugMode]);

    return (
        <Suspense fallback={<Loading>{translate('loading')}</Loading>}>
            <object
                style={{ margin: '12px', padding: '8px', borderRadius: '4px' }}
                type="video/mp4"
                data={URL.createObjectURL(responseData)}
                width="250"
                height="200"></object>
        </Suspense>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {
            data: {
                values: [],
            },
        };
    }
    return {
        data: {
            values: formatData,
        },
    };
};

// @ts-expect-error TS2345
export default compose(injectData(null, null, true), connect(mapStateToProps))(ObjectView);
