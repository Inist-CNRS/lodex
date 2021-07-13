import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { TextField } from '@material-ui/core';
import TableColumnParameter from './TableColumnParameter';
import _ from 'lodash';

const styles = {
    input: {
        width: '100%',
    },
};

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
                        name: 'None',
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

    onParameterChange(parameter) {
        let parameters = this.state.parameters;
        const index = _.findIndex(parameters, { id: parameter.id });
        parameters[index] = parameter;
        const args = {
            parameterCount: this.state.parameterCount,
            parameters: parameters,
        };
        this.setState(args);
        this.props.onChange(args);
    }

    onParameterCountChange(e) {
        const parameterCount = parseInt(e.target.value, 10);
        const parameters = this.reformatParameters(
            parameterCount,
            this.state.parameters,
        );
        const args = {
            parameterCount: parameterCount,
            parameters: parameters,
        };
        this.setState(args);
        this.props.onChange(args);
    }

    render() {
        const { polyglot } = this.props;
        const { parameters, parameterCount } = this.state;
        return (
            <div>
                <TextField
                    style={styles.input}
                    type="number"
                    label={polyglot.t('number_of_column')}
                    onChange={this.onParameterCountChange}
                    value={parameterCount}
                />
                {parameters.map((parameter, index) => (
                    <TableColumnParameter
                        key={`${index}-column-parameter`}
                        polyglot={polyglot}
                        parameter={parameter}
                        onParameterChange={this.onParameterChange}
                    />
                ))}
            </div>
        );
    }
}

export default TableColumnsParameters;
