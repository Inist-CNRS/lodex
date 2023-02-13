import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';

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
            <Box display="flex" gap={1}>
                <TextField
                    label="Trello key"
                    onChange={e => this.setKey(e.target.value)}
                    value={trelloKey}
                    sx={{ flexGrow: 1 }}
                />
                <TextField
                    label="Trello Token"
                    onChange={e => this.setToken(e.target.value)}
                    value={trelloToken}
                    sx={{ flexGrow: 1 }}
                />
            </Box>
        );
    }
}

export default translate(TrelloTimelineAdmin);
