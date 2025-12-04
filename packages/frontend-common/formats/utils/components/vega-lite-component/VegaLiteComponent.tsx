import { Vega } from 'react-vega';

import { useCallback } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { translate } from '../../../../i18n/I18NContext';
import { ASPECT_RATIO_NONE, type AspectRatio } from '../../aspectRatio';
import {
    VEGA_LITE_DATA_INJECT_TYPE_A,
    VEGA_LITE_DATA_INJECT_TYPE_B,
    VEGA_LITE_DATA_INJECT_TYPE_C,
} from '../../chartsUtils';
import FormatFullScreenMode from '../FormatFullScreenMode';
import { useVegaActions } from '../useVegaActions';
import { useVegaCsvExport } from '../useVegaCsvExport';

interface CustomActionVegaLiteProps {
    disableZoom?: boolean;
    user?: any;
    spec: any;
    data?: any;
    injectType: number;
    aspectRatio?: AspectRatio;
    p: unknown;
    onClick?: (event: any) => void;
}

/**
 * small component use to handle vega lite display
 * @param props args taken by the component
 * @returns {*} React-Vega component
 */
function CustomActionVegaLite({
    aspectRatio = ASPECT_RATIO_NONE,
    user,
    spec,
    data,
    injectType,
    disableZoom = false,
    p: polyglot,
    onClick,
}: CustomActionVegaLiteProps) {
    const actions = useVegaActions(user);
    const graphParentRef = useVegaCsvExport(data);

    const specWithData = spec;
    const { height: specHeight } = specWithData;

    switch (injectType) {
        case VEGA_LITE_DATA_INJECT_TYPE_A:
            specWithData.data = data;
            break;
        case VEGA_LITE_DATA_INJECT_TYPE_B:
            // @ts-expect-error TS7006
            specWithData.transform.forEach((e) => {
                if (e.lookup === 'id') {
                    e.from.data.values = data.values;
                }
            });
            break;
        case VEGA_LITE_DATA_INJECT_TYPE_C:
            // @ts-expect-error TS7006
            specWithData.transform.forEach((e) => {
                if (e.lookup === 'properties.HASC_2') {
                    e.from.data.values = data.values;
                }
            });
            break;
        default:
            throw new Error('Invalid data injection type');
    }

    const handleNewView = useCallback(
        (view: any) => {
            if (!onClick) return;

            // @ts-expect-error TS7006 Vega event types
            view.addEventListener('click', (_event, item) => {
                onClick(item?.datum ?? null);
            });
        },
        [onClick],
    );

    const vegaGraphElement = (
        // @ts-expect-error TS2786
        <Vega
            style={
                aspectRatio === ASPECT_RATIO_NONE
                    ? {
                          width: '100%',
                          aspectRatio:
                              // If no height is provided when the spec height is set to container,
                              // the graph height is very small. As a workaround we set a default aspect ratio of 2/1.
                              specHeight === 'container' ? '2 / 1' : undefined,
                      }
                    : { width: '100%', aspectRatio }
            }
            spec={specWithData}
            actions={actions}
            mode="vega-lite"
            onNewView={handleNewView}
            i18n={{
                // @ts-expect-error TS18046
                SVG_ACTION: polyglot.t('vega_export_svg'),
                // @ts-expect-error TS18046
                PNG_ACTION: polyglot.t('vega_export_png'),
                // @ts-expect-error TS18046
                CLICK_TO_VIEW_ACTIONS: polyglot.t('vega_click_to_view_actions'),
                // @ts-expect-error TS18046
                COMPILED_ACTION: polyglot.t('vega_compiled_action'),
                // @ts-expect-error TS18046
                EDITOR_ACTION: polyglot.t('vega_editor_action'),
                // @ts-expect-error TS18046
                SOURCE_ACTION: polyglot.t('vega_source_action'),
            }}
        />
    );

    return (
        <>
            <style>{'#vg-tooltip-element {z-index:99999}'}</style>
            {disableZoom ? (
                <div ref={graphParentRef}>{vegaGraphElement}</div>
            ) : (
                <FormatFullScreenMode forceRerenderOnToggle>
                    <div
                        ref={graphParentRef}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {vegaGraphElement}
                    </div>
                </FormatFullScreenMode>
            )}
        </>
    );
}

/**
 * Function use to get the user state
 * @param state application state
 * @returns {{user: *}} user state
 */
// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default compose(
    connect(mapStateToProps),
    translate,
    // @ts-expect-error TS2345
)(CustomActionVegaLite);
