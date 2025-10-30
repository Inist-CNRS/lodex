import { lazy, Suspense, useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { type Field } from '../../../propTypes';
import injectData from '../../injectData';
import Loading from '@lodex/frontend-common/components/Loading';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const ReactJson = lazy(() => import('react-json-view'));

interface JsonDebugViewProps {
    field: Field;
    resource: object;
    data?: any;
    params: any;
    debugMode: boolean;
}

const JsonDebugView = (props: JsonDebugViewProps) => {
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
            <ReactJson
                style={{ margin: '12px', padding: '8px', borderRadius: '4px' }}
                src={json}
                theme="monokai"
                collapsed={1}
            />
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
export default compose(injectData(), connect(mapStateToProps))(JsonDebugView);
