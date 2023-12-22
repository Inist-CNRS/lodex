import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';

export const defaultArgs = {
    paragraphWidth: '100%',
};

class ParagraphAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            paragraphWidth: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setWidth = paragraphWidth => {
        this.props.onChange({ paragraphWidth });
    };

    render() {
        const {
            p: polyglot,
            args: { paragraphWidth },
        } = this.props;

        return (
            <FormatDefaultParamsFieldSet>
                <TextField
                    fullWidth
                    select
                    label={polyglot.t('list_format_select_image_width')}
                    onChange={e => this.setWidth(e.target.value)}
                    value={paragraphWidth}
                >
                    <MenuItem value="10%">{polyglot.t('ten_percent')}</MenuItem>
                    <MenuItem value="20%">
                        {polyglot.t('twenty_percent')}
                    </MenuItem>
                    <MenuItem value="30%">
                        {polyglot.t('thirty_percent')}
                    </MenuItem>
                    <MenuItem value="50%">
                        {polyglot.t('fifty_percent')}
                    </MenuItem>
                    <MenuItem value="80%">
                        {polyglot.t('eighty_percent')}
                    </MenuItem>
                    <MenuItem value="100%">
                        {polyglot.t('hundred_percent')}
                    </MenuItem>
                </TextField>
            </FormatDefaultParamsFieldSet>
        );
    }
}

export default translate(ParagraphAdmin);
