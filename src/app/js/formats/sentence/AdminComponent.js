import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'inline-flex',
    },
    input: {
        marginLeft: '1rem',
    },
};

class SentenceEdition extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    static defaultProps = {
        prefix: '',
        suffix: '',
    }
    constructor(props) {
        super(props);

        const { prefix, suffix } = this.props;
        this.state = {
            prefix,
            suffix,
        };
    }

    setPrefix = (prefix) => {
        this.setState({ prefix });
        this.props.onChange({
            prefix,
            suffix: this.state.suffix,
        });
    }

    setSuffix = (suffix) => {
        this.setState({ suffix });
        this.props.onChange({
            suffix,
            prefix: this.state.prefix,
        });
    }

    render() {
        const { prefix, suffix } = this.state;
        const { p: polyglot } = this.props;
        return (
            <div style={styles.container}>
                <TextField
                    key="prefix"
                    floatingLabelText={polyglot.t('prefix')}
                    onChange={(event, newValue) => this.setPrefix(newValue)}
                    style={styles.input}
                    value={prefix}
                />
                <TextField
                    key="suffix"
                    floatingLabelText={polyglot.t('suffix')}
                    onChange={(event, newValue) => this.setSuffix(newValue)}
                    style={styles.input}
                    value={suffix}
                />
            </div>
        );
    }
}

export default translate(SentenceEdition);
