import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import translate from 'redux-polyglot/translate';

const styles = {
    container: {
        display: 'inline-flex',
    },
    input: {
        marginLeft: '1rem',
    },
};

export const defaultArgs = {
    trelloKey: '',
    trelloToken: '',
};

class TrelloTimelineAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            trelloKey: PropTypes.string,
            trelloToken: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setToken = trelloToken => {
        const newArgs = { ...this.props.args, trelloToken };
        this.props.onChange(newArgs);
    };

    setKey = trelloKey => {
        const newArgs = { ...this.props.args, trelloKey };
        this.props.onChange(newArgs);
    };

    render() {
        const { trelloToken, trelloKey } = this.props.args;
        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText="Trello key"
                    onChange={(event, newValue) => this.setKey(newValue)}
                    style={styles.input}
                    value={trelloKey}
                />
                <TextField
                    floatingLabelText="Trello Token"
                    onChange={(event, newValue) => this.setToken(newValue)}
                    style={styles.input}
                    value={trelloToken}
                />
            </div>
        );
    }
}

export default translate(TrelloTimelineAdmin);
