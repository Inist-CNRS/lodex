import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';

const styles = {
    container: {
        display: 'inline-flex',
    },
    input: {
        width: '100%',
    },
    previewDefaultColor: color => ({
        display: 'inline-block',
        backgroundColor: color,
        height: '1em',
        width: '1em',
        marginLeft: 5,
        border: 'solid 1px black',
    }),
};

export const defaultArgs = {
    level: 1,
    textColor: 'black',
};

class TitleAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            level: PropTypes.number,
            textColor: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setLevel = level => {
        this.props.onChange({ level });
    };

    setTextColor = (_, textColor) => {
        updateAdminArgs('textColor', textColor, this.props);
    };

    render() {
        const { p: polyglot, args: { level } } = this.props;
        const { textColor } = this.props.args;

        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('list_format_select_level')}
                    onChange={(event, index, newValue) =>
                        this.setLevel(newValue)
                    }
                    style={styles.input}
                    value={level}
                >
                    <MenuItem value={1} primaryText={polyglot.t('level1')} />
                    <MenuItem value={2} primaryText={polyglot.t('level2')} />
                    <MenuItem value={3} primaryText={polyglot.t('level3')} />
                    <MenuItem value={4} primaryText={polyglot.t('level4')} />
                </SelectField>
                <TextField
                    floatingLabelText={
                        <span>
                            {polyglot.t('text_color')}
                            <span
                                style={styles.previewDefaultColor(textColor)}
                            />
                        </span>
                    }
                    onChange={this.setTextColor}
                    style={styles.input}
                    underlineStyle={{ borderColor: textColor }}
                    underlineFocusStyle={{ borderColor: textColor }}
                    value={textColor}
                />
            </div>
        );
    }
}

export default translate(TitleAdmin);
