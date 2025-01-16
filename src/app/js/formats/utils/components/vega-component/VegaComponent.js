import { Vega } from 'react-vega';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import deepClone from 'lodash/cloneDeep';
import {
    VEGA_DATA_INJECT_TYPE_A,
    VEGA_DATA_INJECT_TYPE_B,
    VEGA_DATA_INJECT_TYPE_C,
} from '../../chartsUtils';
import { ASPECT_RATIO_NONE, ASPECT_RATIOS } from '../../aspectRatio';
import FormatFullScreenMode from '../FormatFullScreenMode';
import { useVegaActions } from '../useVegaActions';
import { useVegaCsvExport } from '../useVegaCsvExport';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { compose } from 'recompose';

/**
 * small component use to handle vega lite display
 * @param props args taken by the component
 * @returns {*} React-Vega component
 */
function CustomActionVega(props) {
    const actions = useVegaActions(props.user);
    const graphParentRef = useVegaCsvExport(props.p, props.data);

    const spec = props.spec;

    switch (props.injectType) {
        case VEGA_DATA_INJECT_TYPE_A:
            spec.data.forEach((e) => {
                if (e.name === 'table') {
                    e.values = props.data.values;
                }
            });
            break;
        case VEGA_DATA_INJECT_TYPE_B:
            {
                let data = {
                    values: [],
                };
                props.data.values.forEach((e) => {
                    data.values.push({
                        origin: e.source,
                        destination: e.target,
                        count: e.weight,
                    });
                });
                spec.data.forEach((e) => {
                    if (e.name === 'routes' || e.name === 'link_data') {
                        e.values = data.values;
                    }
                });
            }
            break;
        case VEGA_DATA_INJECT_TYPE_C:
            spec.data.forEach((e) => {
                if (e.name === 'tree') {
                    e.values = props.data.values;
                }
            });
            break;
        default:
            throw new Error('Invalid data injection type');
    }

    return (
        <FormatFullScreenMode>
            <style>{'#vg-tooltip-element {z-index:99999}'}</style>
            <div ref={graphParentRef} style={{ width: '100%', height: '100%' }}>
                <Vega
                    style={
                        props.aspectRatio === ASPECT_RATIO_NONE
                            ? { width: '100%' }
                            : { width: '100%', aspectRatio: props.aspectRatio }
                    }
                    spec={deepClone(props.spec)}
                    actions={actions}
                    mode="vega"
                />
            </div>
        </FormatFullScreenMode>
    );
}

CustomActionVega.defaultProps = {
    aspectRatio: ASPECT_RATIO_NONE,
};

/**
 * Element required in the props
 * @type {{data: Requireable<any>, user: Requireable<any>, spec: Validator<NonNullable<any>>}}
 */
CustomActionVega.propTypes = {
    user: PropTypes.any,
    spec: PropTypes.any.isRequired,
    data: PropTypes.any,
    injectType: PropTypes.number.isRequired,
    aspectRatio: PropTypes.oneOf(ASPECT_RATIOS),
    p: polyglotPropTypes.isRequired,
};

/**
 * Function use to get the user state
 * @param state application state
 * @returns {{user: *}} user state
 */
const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default compose(connect(mapStateToProps), translate)(CustomActionVega);
