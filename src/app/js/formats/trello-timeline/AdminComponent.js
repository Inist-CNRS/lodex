import React, { Component, PropTypes } from 'react';
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

class ListEdition extends Component {
    static propTypes = {
        trelloKey: PropTypes.string,
        trelloToken: PropTypes.string,
        onChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        trelloKey: '',
        trelloToken: '',
    }
    constructor(props) {
        super(props);

        this.state = {
            trelloKey: this.props.trelloKey,
            trelloToken: this.props.trelloToken,
        };
    }

    setToken = (trelloToken) => {
        this.setState({ trelloToken });
        this.props.onChange({
            trelloToken,
            trelloKey: this.state.trelloKey,
        });
    }

    setKey = (trelloKey) => {
        this.setState({ trelloKey });
        this.props.onChange({
            trelloKey,
            trelloToken: this.state.trelloToken,
        });
    }

    render() {
        const { trelloToken, trelloKey } = this.state;
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

export default translate(ListEdition);
