import { Vega } from 'react-vega';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isAdmin } from '../../../../user';
import deepClone from 'lodash.clonedeep';
import {
    VEGA_LITE_DATA_INJECT_TYPE_A,
    VEGA_LITE_DATA_INJECT_TYPE_B,
    VEGA_LITE_DATA_INJECT_TYPE_C,
} from '../../../chartsUtils';
import set from 'lodash.set';

export const VEGA_ACTIONS_WIDTH = 40;

/**
 * small component use to handle vega lite display
 * @param user
 * @param injectType
 * @param data
 * @param spec
 * @returns {*} React-Vega component
 */
const CustomActionVegaLite = ({ user, injectType, data, spec }) => {
    const actions = useMemo(() => {
        const defaultActions = {
            export: {
                svg: true,
                png: true,
            },
            source: false,
            compiled: false,
            editor: false,
        };
        if (isAdmin(user)) {
            return {
                ...defaultActions,
                source: true,
                compiled: true,
                editor: true,
            };
        }
        return defaultActions;
    }, [user]);

    const specWithData = useMemo(() => {
        const tmpSpec = deepClone(spec);

        if (injectType === VEGA_LITE_DATA_INJECT_TYPE_A) {
            set(tmpSpec, 'data', data);
            return tmpSpec;
        }

        if (injectType === VEGA_LITE_DATA_INJECT_TYPE_B) {
            tmpSpec.transform.forEach(entry => {
                if (entry.lookup === 'id') {
                    set(entry, 'from.data.values', data.values);
                }
            });
            return tmpSpec;
        }

        if (injectType === VEGA_LITE_DATA_INJECT_TYPE_C) {
            tmpSpec.transform.forEach(entry => {
                if (entry.lookup === 'properties.HASC_2') {
                    set(entry, 'from.data.values', data.values);
                }
            });
            return tmpSpec;
        }

        return tmpSpec;
    }, [injectType, spec, data]);

    return <Vega spec={specWithData} actions={actions} mode="vega-lite" />;
};

/**
 * Element required in the props
 * @type {{data: Requireable<any>, user: Requireable<any>, spec: Validator<NonNullable<any>>}}
 */
CustomActionVegaLite.propTypes = {
    user: PropTypes.any,
    spec: PropTypes.any.isRequired,
    data: PropTypes.any,
    injectType: PropTypes.number.isRequired,
};

/**
 * Function use to get the user state
 * @param state application state
 * @returns {{user: *}} user state
 */
const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(CustomActionVegaLite);
