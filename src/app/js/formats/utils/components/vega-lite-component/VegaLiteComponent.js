import { Vega } from 'react-vega';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import deepClone from 'lodash/cloneDeep';
import {
    VEGA_LITE_DATA_INJECT_TYPE_A,
    VEGA_LITE_DATA_INJECT_TYPE_B,
    VEGA_LITE_DATA_INJECT_TYPE_C,
} from '../../chartsUtils';
import { ASPECT_RATIO_NONE, ASPECT_RATIOS } from '../../aspectRatio';
import FormatFullScreenMode from '../FormatFullScreenMode';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { compose } from 'recompose';
import { useVegaCsvExport } from '../useVegaCsvExport';
import { useVegaActions } from '../useVegaActions';

/**
 * small component use to handle vega lite display
 * @param props args taken by the component
 * @returns {*} React-Vega component
 */
function CustomActionVegaLite({
    aspectRatio,
    user,
    spec,
    data,
    injectType,
    disableZoom,
    p: polyglot,
}) {
    const actions = useVegaActions(user);
    const graphParentRef = useVegaCsvExport(polyglot, data);

    const specWithData = spec;

    switch (injectType) {
        case VEGA_LITE_DATA_INJECT_TYPE_A:
            specWithData.data = data;
            break;
        case VEGA_LITE_DATA_INJECT_TYPE_B:
            specWithData.transform.forEach((e) => {
                if (e.lookup === 'id') {
                    e.from.data.values = data.values;
                }
            });
            break;
        case VEGA_LITE_DATA_INJECT_TYPE_C:
            specWithData.transform.forEach((e) => {
                if (e.lookup === 'properties.HASC_2') {
                    e.from.data.values = data.values;
                }
            });
            break;
        default:
            throw new Error('Invalid data injection type');
    }

    return (
        <>
            <style>{'#vg-tooltip-element {z-index:99999}'}</style>
            {disableZoom ? (
                <div ref={graphParentRef}>
                    <Vega
                        style={
                            aspectRatio === ASPECT_RATIO_NONE
                                ? { width: '100%' }
                                : { width: '100%', aspectRatio }
                        }
                        spec={deepClone(specWithData)}
                        actions={actions}
                        mode="vega-lite"
                    />
                </div>
            ) : (
                <FormatFullScreenMode>
                    <div
                        ref={graphParentRef}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <Vega
                            style={
                                aspectRatio === ASPECT_RATIO_NONE
                                    ? { width: '100%' }
                                    : { width: '100%', aspectRatio }
                            }
                            spec={deepClone(specWithData)}
                            actions={actions}
                            mode="vega-lite"
                        />
                    </div>
                </FormatFullScreenMode>
            )}
        </>
    );
}

CustomActionVegaLite.defaultProps = {
    disableZoom: false,
    aspectRatio: ASPECT_RATIO_NONE,
};

/**
 * Element required in the props
 * @type {{data: Requireable<any>, user: Requireable<any>, spec: Validator<NonNullable<any>>}}
 */
CustomActionVegaLite.propTypes = {
    disableZoom: PropTypes.bool,
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

export default compose(
    connect(mapStateToProps),
    translate,
)(CustomActionVegaLite);
