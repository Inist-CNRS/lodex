import { Vega } from 'react-vega';
import { connect } from 'react-redux';
import deepClone from 'lodash/cloneDeep';
import {
    VEGA_DATA_INJECT_TYPE_A,
    VEGA_DATA_INJECT_TYPE_B,
    VEGA_DATA_INJECT_TYPE_C,
} from '../../chartsUtils';
import { ASPECT_RATIO_NONE, type AspectRatio } from '../../aspectRatio';
import FormatFullScreenMode from '../FormatFullScreenMode';
import { useVegaActions } from '../useVegaActions';
import { useVegaCsvExport } from '../useVegaCsvExport';
import { compose } from 'recompose';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { State } from '../../../../../admin-app/src/reducers';

export type VegaData = {
    values: { source: string; target: string; weight: number }[];
};

type CustomActionVegaProps = {
    user: unknown;
    spec: {
        data: { name: string; values?: unknown[] }[];
    };
    data: VegaData;
    injectType: number;
    aspectRatio?: AspectRatio;
};

function CustomActionVega(props: CustomActionVegaProps) {
    const { translate } = useTranslate();
    const actions = useVegaActions(props.user);
    const graphParentRef = useVegaCsvExport(props.data);

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
                const data: {
                    values: {
                        origin: string;
                        destination: string;
                        count: number;
                    }[];
                } = {
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
                {/*
                 // @ts-expect-error TS2786 */}
                <Vega
                    style={
                        props.aspectRatio === ASPECT_RATIO_NONE
                            ? { width: '100%' }
                            : {
                                  width: '100%',
                                  aspectRatio:
                                      props.aspectRatio ?? ASPECT_RATIO_NONE,
                              }
                    }
                    spec={deepClone(props.spec)}
                    actions={actions}
                    mode="vega"
                    i18n={{
                        SVG_ACTION: translate('vega_export_svg'),
                        PNG_ACTION: translate('vega_export_png'),
                        CLICK_TO_VIEW_ACTIONS: translate(
                            'vega_click_to_view_actions',
                        ),
                        COMPILED_ACTION: translate('vega_compiled_action'),
                        EDITOR_ACTION: translate('vega_editor_action'),
                        SOURCE_ACTION: translate('vega_source_action'),
                    }}
                />
            </div>
        </FormatFullScreenMode>
    );
}

const mapStateToProps = (state: State) => {
    return {
        user: state.user,
    };
};

export default compose<
    CustomActionVegaProps,
    Omit<CustomActionVegaProps, 'user'>
>(connect(mapStateToProps))(CustomActionVega);
