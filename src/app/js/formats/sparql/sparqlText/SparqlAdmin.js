import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../../propTypes';

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
        hostname: 'https://data.istex.fr/sparql/',
    },
};

class SparqlTextAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            sparql: PropTypes.shape({
                hostname: PropTypes.string,
            }),
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setHostname = (_, hostname) => {
        const { sparql, ...args } = this.props.args;
        const newArgs = { ...args, sparql: { ...sparql, hostname } };
        this.props.onChange(newArgs);
    };

    render() {
        const { p: polyglot, args: { sparql } } = this.props;
        const { hostname } = sparql || defaultArgs.sparql;

        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={polyglot.t('sparql_hostname')}
                    onChange={this.setHostname}
                    style={styles.input}
                    value={hostname}
                />
            </div>
        );
    }
}

export default translate(SparqlTextAdmin);
