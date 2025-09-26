import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { Box, TextField } from '@mui/material';
import TableColumnParameter from './TableColumnParameter';
// @ts-expect-error TS7016
import _ from 'lodash';

class TableColumnsParameters extends Component {
    /**
     * Default args taken by the component
     */
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        polyglot: polyglotPropTypes.isRequired,
        parameterCount: PropTypes.number.isRequired,
        parameters: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                title: PropTypes.string.isRequired,
                field: PropTypes.string.isRequired,
                format: PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    option: PropTypes.any.isRequired,
                }).isRequired,
            }),
        ).isRequired,
    };

    /**
     * Default constructor
     * @param props Args taken by the component
     */
    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        this.onParameterChange = this.onParameterChange.bind(this);
        this.onParameterCountChange = this.onParameterCountChange.bind(this);
        this.reformatParameters = this.reformatParameters.bind(this);
        let parameters = this.reformatParameters(
            props.parameterCount,
            props.parameters,
        );
        this.state = {
            parameterCount: props.parameterCount,
            parameters: parameters,
        };
    }

    // @ts-expect-error TS7006
    reformatParameters(parameterCount, parameters) {
        let reformattedParameters = parameters;
        if (parameterCount > parameters.length) {
            const diff = parameterCount - parameters.length;
            for (let i = 0; i < diff; i++) {
                reformattedParameters.push({
                    id: parameters.length,
                    field: 'a_routine_field',
                    title: 'Column ' + (parameters.length + 1),
                    format: {
                        name: '',
                        option: undefined,
                    },
                });
            }
            return reformattedParameters;
        } else if (parameterCount < parameters.length) {
            return reformattedParameters.slice(0, parameterCount);
        }
        return reformattedParameters;
    }

    // @ts-expect-error TS7006
    onParameterChange(parameter) {
        // @ts-expect-error TS2339
        let parameters = this.state.parameters;
        const index = _.findIndex(parameters, { id: parameter.id });
        parameters[index] = parameter;
        const args = {
            // @ts-expect-error TS2339
            parameterCount: this.state.parameterCount,
            parameters: parameters,
        };
        this.setState(args);
        // @ts-expect-error TS2339
        this.props.onChange(args);
    }

    // @ts-expect-error TS7006
    onParameterCountChange(e) {
        const parameterCount = parseInt(e.target.value, 10);
        const parameters = this.reformatParameters(
            parameterCount,
            // @ts-expect-error TS2339
            this.state.parameters,
        );
        const args = {
            parameterCount: parameterCount,
            parameters: parameters,
        };
        this.setState(args);
        // @ts-expect-error TS2339
        this.props.onChange(args);
    }

    render() {
        // @ts-expect-error TS2339
        const { polyglot } = this.props;
        // @ts-expect-error TS2339
        const { parameters, parameterCount } = this.state;
        return (
            <Box width="100%">
                <TextField
                    fullWidth
                    type="number"
                    label={polyglot.t('number_of_column')}
                    onChange={this.onParameterCountChange}
                    value={parameterCount}
                />
                {/*
                 // @ts-expect-error TS7006 */}
                {parameters.map((parameter, index) => (
                    <TableColumnParameter
                        key={`${index}-column-parameter`}
                        polyglot={polyglot}
                        parameter={parameter}
                        onParameterChange={this.onParameterChange}
                    />
                ))}
            </Box>
        );
    }
}

export default TableColumnsParameters;
