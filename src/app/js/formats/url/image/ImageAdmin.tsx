import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from '../../../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { TextField, MenuItem } from '@mui/material';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

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

    // @ts-expect-error TS7006
    handleWidth = (imageWidth) => {
        const newArgs = {
            // @ts-expect-error TS2339
            ...this.props.args,
            imageWidth,
        };
        // @ts-expect-error TS2339
        this.props.onChange(newArgs);
    };

    render() {
        const {
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
            args: { imageWidth },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('list_format_select_image_width')}
                        onChange={(e) => this.handleWidth(e.target.value)}
                        value={imageWidth}
                    >
                        <MenuItem value="10%">
                            {polyglot.t('ten_percent')}
                        </MenuItem>
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
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(ImageAdmin);
