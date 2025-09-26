import React, { lazy, Suspense, useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../../propTypes';
import injectData from '../../injectData';
import Loading from '../../../lib/components/Loading';
import { useTranslate } from '../../../i18n/I18NContext';

const ReactJson = lazy(() => import('react-json-view'));

const JsonDebugView = (props) => {

    const { debugMode } = props;

    const { translate } = useTranslate();

    const json = useMemo(() => {
        if (!debugMode) {
            return props.data ?? [];
        }
        return props;
    }, [props]);

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

JsonDebugView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    params: PropTypes.any.isRequired,
    debugMode: PropTypes.bool.isRequired,
};

export default compose(injectData(), connect(mapStateToProps))(JsonDebugView);
