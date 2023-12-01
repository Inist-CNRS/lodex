import { Vega } from 'react-vega';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import deepClone from 'lodash.clonedeep';
import { isAdmin } from '../../../../user';
import {
    VEGA_LITE_DATA_INJECT_TYPE_A,
    VEGA_LITE_DATA_INJECT_TYPE_B,
    VEGA_LITE_DATA_INJECT_TYPE_C,
} from '../../../chartsUtils';
import {
    ASPECT_RATIO_16_6,
    ASPECT_RATIO_16_9,
    ASPECT_RATIO_1_1,
    ASPECT_RATIO_3_1,
    ASPECT_RATIO_3_2,
    ASPECT_RATIO_4_3,
    ASPECT_RATIO_8_5,
} from '../../../aspectRatio';

/**
 * small component use to handle vega lite display
 * @param props args taken by the component
 * @returns {*} React-Vega component
 */
function CustomActionVegaLite({ aspectRatio, user, spec, data, injectType }) {
    let actions;
    if (isAdmin(user)) {
        actions = {
            export: {
                svg: true,
                png: true,
            },
            source: true,
            compiled: true,
            editor: true,
        };
    } else {
        actions = {
            export: {
                svg: true,
                png: true,
            },
            source: false,
            compiled: false,
            editor: false,
        };
    }

    const specWithData = spec;

    switch (injectType) {
        case VEGA_LITE_DATA_INJECT_TYPE_A:
            specWithData.data = data;
            break;
        case VEGA_LITE_DATA_INJECT_TYPE_B:
            specWithData.transform.forEach(e => {
                if (e.lookup === 'id') {
                    e.from.data.values = data.values;
                }
            });
            break;
        case VEGA_LITE_DATA_INJECT_TYPE_C:
            specWithData.transform.forEach(e => {
                if (e.lookup === 'properties.HASC_2') {
                    e.from.data.values = data.values;
                }
            });
            break;
        default:
            throw new Error('Invalid data injection type');
    }

    return (
        <Vega
            style={{ width: '100%', aspectRatio }}
            spec={deepClone(specWithData)}
            actions={actions}
            mode="vega-lite"
        />
    );
}

CustomActionVegaLite.defaultProps = {
    aspectRatio: ASPECT_RATIO_16_9,
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
    aspectRatio: PropTypes.oneOf([
        ASPECT_RATIO_1_1,
        ASPECT_RATIO_3_2,
        ASPECT_RATIO_4_3,
        ASPECT_RATIO_8_5,
        ASPECT_RATIO_16_6,
        ASPECT_RATIO_16_9,
    ]),
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
