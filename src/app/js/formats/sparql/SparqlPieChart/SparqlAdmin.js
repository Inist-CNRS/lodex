import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { polyglot as polyglotPropTypes } from '../../../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '40%',
    },
    input2: {
        width: '100%',
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
    sparql: {
        endpoint: 'data.istex.fr/sparql/',
        maxValue: 5,
        orderBy: 'value/asc',
    },
    colors: '#1D1A31 #4D2D52 #9A4C95 #F08CAE #C1A5A9',
};

class SparqlPieChartFieldAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            sparql: PropTypes.shape({
                endpoint: PropTypes.string,
                maxValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            colors: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setEndpoint = (_, endpoint) => {
        const { sparql, ...args } = this.props.args;
        const newArgs = { ...args, sparql: { ...sparql, endpoint } };
        this.props.onChange(newArgs);
    };

    setMaxValue = (_, maxValue) => {
        const { sparql, ...state } = this.props.args;
        const newState = { ...state, sparql: { ...sparql, maxValue } };
        this.props.onChange(newState);
    };

    setOrderBy = (_, __, orderBy) => {
        const { sparql, ...state } = this.props.args;
        const newState = { ...state, sparql: { ...sparql, orderBy } };
        this.props.onChange(newState);
    };

    setColors = (_, colors) => {
        const newState = { ...this.props.args, colors };
        this.props.onChange(newState);
    };

    render() {
        const { p: polyglot, args: { sparql, colors } } = this.props;
        const { endpoint, maxValue, orderBy } = sparql || defaultArgs.sparql;

        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={polyglot.t('sparql_endpoint')}
                    onChange={this.setEndpoint}
                    style={styles.input2}
                    value={endpoint}
                />
                <TextField
                    floatingLabelText={polyglot.t('max_value')}
                    onChange={this.setMaxValue}
                    style={styles.input}
                    value={maxValue}
                />
                <SelectField
                    floatingLabelText={polyglot.t('order_by')}
                    onChange={this.setOrderBy}
                    style={styles.input}
                    value={orderBy}
                >
                    <MenuItem
                        value="_id/asc"
                        primaryText={polyglot.t('label_asc')}
                    />
                    <MenuItem
                        value="_id/desc"
                        primaryText={polyglot.t('label_desc')}
                    />
                    <MenuItem
                        value="value/asc"
                        primaryText={polyglot.t('value_asc')}
                    />
                    <MenuItem
                        value="value/desc"
                        primaryText={polyglot.t('value_desc')}
                    />
                </SelectField>
                <TextField
                    floatingLabelText={polyglot.t('colors_set')}
                    onChange={this.setColors}
                    style={styles.input2}
                    value={colors}
                />
            </div>
        );
    }
}

export default translate(SparqlPieChartFieldAdmin);
