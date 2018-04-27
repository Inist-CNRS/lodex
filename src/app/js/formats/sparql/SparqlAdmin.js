import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';

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
    params: {
        hostnameSparql: 'https://data.istex.fr/sparql/?query=',
    },
};

class SparqlTextAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                hostnameSparql: PropTypes.string,
            }),
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setMaxSize = (_, hostnameSparql) => {
        const { params, ...args } = this.props.args;
        const newArgs = { ...args, params: { ...params, hostnameSparql } };
        this.props.onChange(newArgs);
    };

    render() {
        const { p: polyglot, args: { params } } = this.props;
        const { hostnameSparql } = params || defaultArgs.params;

        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={
                        polyglot.t('hostname') /*TODO translate*/
                    }
                    onChange={this.setMaxSize}
                    style={styles.input}
                    value={hostnameSparql}
                />
            </div>
        );
    }
}

export default translate(SparqlTextAdmin);
