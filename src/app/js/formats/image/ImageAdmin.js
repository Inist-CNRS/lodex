import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { TextField, MenuItem } from '@mui/material';

export const defaultArgs = {
    imageWidth: '100%',
};

class ImageAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            imageWidth: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setWidth = imageWidth => {
        const newArgs = {
            ...this.props.args,
            imageWidth,
        };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { imageWidth },
        } = this.props;

        return (
            <TextField
                select
                label={polyglot.t('list_format_select_image_width')}
                onChange={e => this.setWidth(e.target.value)}
                value={imageWidth}
                sx={{
                    width: '50%',
                }}
            >
                <MenuItem value="10%">{polyglot.t('ten_percent')}</MenuItem>
                <MenuItem value="20%">{polyglot.t('twenty_percent')}</MenuItem>
                <MenuItem value="30%">{polyglot.t('thirty_percent')}</MenuItem>
                <MenuItem value="50%">{polyglot.t('fifty_percent')}</MenuItem>
                <MenuItem value="80%">{polyglot.t('eighty_percent')}</MenuItem>
                <MenuItem value="100%">
                    {polyglot.t('hundred_percent')}
                </MenuItem>
            </TextField>
        );
    }
}

export default translate(ImageAdmin);
