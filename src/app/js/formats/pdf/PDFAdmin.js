import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from '@material-ui/core/SelectField';
import MenuItem from '@material-ui/core/MenuItem';
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
    PDFWidth: '100%',
};

class PDFAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            PDFWidth: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setWidth = PDFWidth => {
        const newArgs = {
            ...this.props.args,
            PDFWidth,
        };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { PDFWidth },
        } = this.props;

        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t(
                        'list_format_select_image_width',
                    )}
                    onChange={(event, index, newValue) =>
                        this.setWidth(newValue)
                    }
                    style={styles.input}
                    value={PDFWidth}
                >
                    <MenuItem
                        value="10%"
                        primaryText={polyglot.t('ten_percent')}
                    />
                    <MenuItem
                        value="20%"
                        primaryText={polyglot.t('twenty_percent')}
                    />
                    <MenuItem
                        value="30%"
                        primaryText={polyglot.t('thirty_percent')}
                    />
                    <MenuItem
                        value="50%"
                        primaryText={polyglot.t('fifty_percent')}
                    />
                    <MenuItem
                        value="80%"
                        primaryText={polyglot.t('eighty_percent')}
                    />
                    <MenuItem
                        value="100%"
                        primaryText={polyglot.t('hundred_percent')}
                    />
                </SelectField>
            </div>
        );
    }
}

export default translate(PDFAdmin);
