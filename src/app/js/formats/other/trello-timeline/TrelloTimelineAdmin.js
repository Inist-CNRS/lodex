import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';
import { FormatDataParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

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

    handleToken = (trelloToken) => {
        const newArgs = { ...this.props.args, trelloToken };
        this.props.onChange(newArgs);
    };

    handleKey = (trelloKey) => {
        const newArgs = { ...this.props.args, trelloKey };
        this.props.onChange(newArgs);
    };

    render() {
        const { trelloToken, trelloKey } = this.props.args;
        return (
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet defaultExpanded>
                    <TextField
                        label="Trello key"
                        onChange={(e) => this.handleKey(e.target.value)}
                        value={trelloKey}
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        label="Trello Token"
                        onChange={(e) => this.handleToken(e.target.value)}
                        value={trelloToken}
                        sx={{ flexGrow: 1 }}
                    />
                </FormatDataParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(TrelloTimelineAdmin);
