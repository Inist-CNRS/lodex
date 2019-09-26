import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
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
            <div style={styles.container}>
                <FormControl>
                    <InputLabel>
                        {polyglot.t('list_format_select_image_width')}
                    </InputLabel>
                    <Select
                        onChange={(event, index, newValue) =>
                            this.setWidth(newValue)
                        }
                        style={styles.input}
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
                    </Select>
                </FormControl>
            </div>
        );
    }
}

export default translate(ImageAdmin);
