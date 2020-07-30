import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
    input2: {
        width: '96%',
    },
    previewDefaultColor: color => ({
        display: 'inline-block',
        backgroundColor: color,
        height: '1em',
        width: '1em',
        marginLeft: 5,
        border: 'solid 1px black',
    }),
};

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

class VegaLiteAdmin extends Component {
    static propTypes = {
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

    static defaultProps = {
        args: defaultArgs,
    };

    setParams = params => {
        updateAdminArgs('params', params, this.props);
    };

    setSpecTemplate = (_, specTemplate) => {
        updateAdminArgs('specTemplate', specTemplate, this.props);
    };

    setWidth = (_, width) => {
        updateAdminArgs('width', width, this.props);
    };

    setHeight = (_, height) => {
        updateAdminArgs('height', height, this.props);
    };

    validator = () => {
        window.open('https://vega.github.io/editor/#/edited');
    };

    sizeStep = () => {
        window.open(
            'https://vega.github.io/vega-lite/docs/size.html#specifying-width-and-height-per-discrete-step',
        );
    };

    render() {
        const {
            p: polyglot,
            args: { params },
            showMaxSize = true,
            showMaxValue = true,
            showMinValue = true,
            showOrderBy = true,
        } = this.props;
        const { specTemplate, width, height } = this.props.args;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={this.setParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
                <a
                    onClick={() => {
                        this.validator();
                    }}
                    style={(styles.pointer, styles.link)}
                >
                    {polyglot.t('vega_validator')}
                </a>
                <TextField
                    onChange={this.setSpecTemplate}
                    style={styles.input}
                    value={specTemplate}
                />
                <a
                    onClick={() => {
                        this.sizeStep();
                    }}
                    style={(styles.pointer, styles.link)}
                >
                    {polyglot.t('vega_size_step')}
                </a>
                <TextField
                    type="number"
                    min={10}
                    max={200}
                    step={10}
                    floatingLabelText={polyglot.t('vegalite_width')}
                    onChange={this.setWidth}
                    style={styles.input2}
                    value={width}
                />
                <p>%</p>
                <TextField
                    type="number"
                    min={10}
                    max={800}
                    step={10}
                    floatingLabelText={polyglot.t('vegalite_height')}
                    onChange={this.setHeight}
                    style={styles.input2}
                    value={height}
                />
                <p>%</p>
            </div>
        );
    }
}

export default translate(VegaLiteAdmin);
