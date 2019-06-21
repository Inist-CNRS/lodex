import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';

import * as colorUtils from '../colorUtils';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
};

export const defaultArgs = {
    level: 1,
    textColor: colorUtils.MONOCHROMATIC_DEFAULT_COLORSET,
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

    setTextColor = (_, color) => {
        updateAdminArgs('textColor', color, this.props);
    };

    render() {
        const {
            p: polyglot,
            args: { level },
        } = this.props;
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
                    floatingLabelText={polyglot.t('text_color')}
                    style={styles.input}
                    onChange={this.setTextColor}
                    value={textColor}
                />
            </div>
        );
    }
}

export default translate(TitleAdmin);
