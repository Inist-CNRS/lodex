import translate from 'redux-polyglot/translate';
import { MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH } from '../../../utils/colorUtils';
import { ASPECT_RATIO_8_5 } from '../../../utils/aspectRatio';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import TreeMap, { TREE_MAP_LAYOUT } from '../../models/TreeMap';
import React, { useEffect, useMemo } from 'react';
import updateAdminArgs from '../../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import {
    Box,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Slider,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import VegaAdvancedMode from '../../../utils/components/admin/VegaAdvancedMode';
import ColorPickerParamsAdmin from '../../../utils/components/admin/ColorPickerParamsAdmin';
import AspectRatioSelector from '../../../utils/components/admin/AspectRatioSelector';
import { StandardIdValue } from '../../../utils/dataSet';
import VegaFieldPreview from '../../../utils/components/admin/VegaFieldPreview';
import VegaToolTips from '../../../utils/components/admin/VegaToolTips';

export const defaultArgs = {
    params: {
        maxSize: 5,
        orderBy: 'value/asc',
    },
    advancedMode: false,
    advancedModeSpec: null,
    tooltip: false,
    tooltipSource: 'Source',
    tooltipTarget: 'Target',
    tooltipWeight: 'Weight',
    colors: MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH,
    layout: 'squarify',
    ratio: 2.0,
    aspectRatio: ASPECT_RATIO_8_5,
};

const TreeMapAdmin = (props) => {
    const {
        args,
        p: polyglot,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
    } = props;

    const {
        advancedMode,
        advancedModeSpec,
        tooltip,
        tooltipSource,
        tooltipTarget,
        tooltipWeight,
        params,
        layout,
        ratio,
        aspectRatio,
    } = args;

    const colors = useMemo(() => {
        return args.colors || defaultArgs.colors;
    }, [args.colors]);

    const spec = useMemo(() => {
        if (!advancedMode) {
            return null;
        }

        if (advancedModeSpec !== null) {
            return advancedModeSpec;
        }

        const specBuilder = new TreeMap();

        specBuilder.setColors(colors.split(' '));
        specBuilder.setLayout(layout);
        specBuilder.setRatio(ratio);

        specBuilder.setEditMode(true);
        return JSON.stringify(specBuilder.buildSpec(), null, 2);
    }, [advancedMode, advancedModeSpec]);

    // Save the new spec when we first use the advanced mode or when we reset the generated spec
    // details: Update advancedModeSpec props arguments when spec is generated or regenerated
    useEffect(() => {
        if (!advancedMode) {
            return;
        }
        updateAdminArgs('advancedModeSpec', spec, props);
    }, [advancedMode, advancedModeSpec]);

    const handleParams = (params) => {
        updateAdminArgs('params', params, props);
    };

    const toggleAdvancedMode = () => {
        updateAdminArgs('advancedMode', !args.advancedMode, props);
    };

    const clearAdvancedModeSpec = () => {
        updateAdminArgs('advancedModeSpec', null, props);
    };

    const handleAdvancedModeSpec = (newSpec) => {
        updateAdminArgs('advancedModeSpec', newSpec, props);
    };

    const toggleTooltip = () => {
        updateAdminArgs('tooltip', !tooltip, props);
    };

    const handleTooltipSource = (tooltipSource) => {
        updateAdminArgs('tooltipSource', tooltipSource, props);
    };

    const handleTooltipTarget = (tooltipTarget) => {
        updateAdminArgs('tooltipTarget', tooltipTarget, props);
    };

    const handleTooltipWeight = (tooltipWeight) => {
        updateAdminArgs('tooltipWeight', tooltipWeight, props);
    };

    const handleColors = (colors) => {
        updateAdminArgs(
            'colors',
            colors.split(' ') || defaultArgs.colors,
            props,
        );
    };

    const handleLayout = (e) => {
        updateAdminArgs('layout', e.target.value, props);
    };

    const handleRatio = (_, value) => {
        updateAdminArgs('ratio', value, props);
    };

    const handleAspectRatio = (value) => {
        updateAdminArgs('aspectRatio', value, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={handleParams}
                    polyglot={polyglot}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={advancedMode}
                                onChange={toggleAdvancedMode}
                            />
                        }
                        label={polyglot.t('advancedMode')}
                    />
                </FormGroup>
                {advancedMode ? (
                    <VegaAdvancedMode
                        value={spec}
                        onClear={clearAdvancedModeSpec}
                        onChange={handleAdvancedModeSpec}
                    />
                ) : (
                    <>
                        <VegaToolTips
                            checked={tooltip}
                            onChange={toggleTooltip}
                            onCategoryTitleChange={handleTooltipSource}
                            categoryTitle={tooltipSource}
                            onValueTitleChange={handleTooltipTarget}
                            valueTitle={tooltipTarget}
                            polyglot={polyglot}
                            thirdValue={true}
                            onThirdValueChange={handleTooltipWeight}
                            thirdValueTitle={tooltipWeight}
                        />
                        <ColorPickerParamsAdmin
                            colors={colors}
                            onChange={handleColors}
                            polyglot={polyglot}
                            monochromatic={false}
                        />
                        <TextField
                            fullWidth
                            select
                            label={polyglot.t('layout')}
                            onChange={handleLayout}
                            value={layout}
                        >
                            <MenuItem value="squarify">
                                {polyglot.t('squarify')}
                            </MenuItem>
                            <MenuItem value="binary">
                                {polyglot.t('binary')}
                            </MenuItem>
                            <MenuItem value="slicedice">
                                {polyglot.t('slicedice')}
                            </MenuItem>
                        </TextField>
                        <div
                            style={{
                                marginLeft: '4px',
                                marginRight: '4px',
                                width: 'calc(100% - 8px)',
                            }}
                        >
                            <Typography
                                gutterBottom
                                sx={{ marginBottom: '-2px' }}
                            >
                                {polyglot.t('treemap_ratio')}
                            </Typography>
                            <Slider
                                aria-label="Ratio"
                                defaultValue={ratio}
                                value={ratio}
                                onChange={handleRatio}
                                valueLabelDisplay="auto"
                                step={0.1}
                                marks
                                min={1}
                                max={5}
                            />
                        </div>
                    </>
                )}
                <AspectRatioSelector
                    value={aspectRatio}
                    onChange={handleAspectRatio}
                />
            </FormatChartParamsFieldSet>
            <VegaFieldPreview
                args={args}
                PreviewComponent={() => null}
                datasets={[StandardIdValue]}
                showDatasetsSelector={false}
            />
        </Box>
    );
};

TreeMapAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        advancedMode: PropTypes.bool,
        advancedModeSpec: PropTypes.string,
        tooltip: PropTypes.bool,
        tooltipSource: PropTypes.string,
        tooltipTarget: PropTypes.string,
        tooltipWeight: PropTypes.string,
        colors: PropTypes.string,
        layout: PropTypes.oneOf(TREE_MAP_LAYOUT),
        ratio: PropTypes.number,
        aspectRatio: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

TreeMapAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

export default translate(TreeMapAdmin);
