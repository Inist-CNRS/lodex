import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Box, TextField } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    specTemplate:
        '{"width": 600, "autosize": {"type": "fit", "contains": "padding" }, "mark": "bar", "encoding": { "x": {"field": "_id", "type": "ordinal"}, "y": {"field": "value", "type": "quantitative"} }, "data": {"name": "values"} }',
    width: '',
    height: '',
};

const VegaLiteAdmin = ({
    args,
    onChange,
    p: polyglot,
    showMaxSize,
    showMaxValue,
    showMinValue,
    showOrderBy,
}) => {
    const { specTemplate, width, height, params } = args;

    const [displayedSpecTemplate, setDisplayedSpecTemplate] = React.useState(
        specTemplate,
    );

    React.useEffect(() => {
        // we parse and stringify to have a formatted JSON in the editor
        // https://github.com/securingsincity/react-ace/issues/180
        try {
            const formattedSpecTemplate = JSON.stringify(
                JSON.parse(specTemplate),
                null,
                2,
            );
            setDisplayedSpecTemplate(formattedSpecTemplate);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const setParams = params => {
        updateAdminArgs('params', params, { args, onChange });
    };

    const setSpecTemplate = value => {
        setDisplayedSpecTemplate(value);
        updateAdminArgs('specTemplate', value, { args, onChange });
    };

    const setWidth = e => {
        updateAdminArgs('width', e.target.value, { args, onChange });
    };

    const setHeight = e => {
        updateAdminArgs('height', e.target.value, { args, onChange });
    };

    const validator = () => {
        window.open('https://vega.github.io/editor/#/edited');
    };

    const sizeStep = () => {
        window.open(
            'https://vega.github.io/vega-lite/docs/size.html#specifying-width-and-height-per-discrete-step',
        );
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <RoutineParamsAdmin
                params={params || defaultArgs.params}
                polyglot={polyglot}
                onChange={setParams}
                showMaxSize={showMaxSize}
                showMaxValue={showMaxValue}
                showMinValue={showMinValue}
                showOrderBy={showOrderBy}
            />
            <Box width="100%">
                <a
                    onClick={() => {
                        validator();
                    }}
                >
                    {polyglot.t('vega_validator')}
                </a>
                <AceEditor
                    mode="json"
                    theme="monokai"
                    wrapEnabled={true}
                    fontSize={14}
                    value={displayedSpecTemplate}
                    onChange={setSpecTemplate}
                    style={{
                        width: '100%',
                        height: '400px',
                    }}
                />
                <a onClick={() => sizeStep()}>{polyglot.t('vega_size_step')}</a>
            </Box>
            <TextField
                type="number"
                min={10}
                max={200}
                step={10}
                label={polyglot.t('vegalite_width')}
                onChange={setWidth}
                value={width}
                fullWidth
                InputProps={{
                    endAdornment: '%',
                }}
            />
            <TextField
                type="number"
                min={10}
                max={800}
                step={10}
                label={polyglot.t('vegalite_height')}
                onChange={setHeight}
                value={height}
                fullWidth
                InputProps={{
                    endAdornment: '%',
                }}
            />
        </Box>
    );
};

VegaLiteAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

VegaLiteAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        specTemplate: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

export default translate(VegaLiteAdmin);
