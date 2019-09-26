import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import ColorPickerParamsAdmin from '../shared/ColorPickerParamsAdmin';

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
    colors: colorUtils.MONOCHROMATIC_DEFAULT_COLORSET,
};

class TitleAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            level: PropTypes.number,
            colors: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    constructor(props) {
        super(props);
        this.setColors = this.setColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    setLevel = level => {
        this.props.onChange({ level });
    };

    setColors(colors) {
        updateAdminArgs('colors', colors.split(' ')[0], this.props);
    }

    render() {
        const {
            p: polyglot,
            args: { level },
        } = this.props;

        return (
            <div style={styles.container}>
                <FormControl>
                    <InputLabel>
                        {polyglot.t('list_format_select_level')}
                    </InputLabel>
                    <Select
                        onChange={(event, index, newValue) =>
                            this.setLevel(newValue)
                        }
                        style={styles.input}
                        value={level}
                    >
                        <MenuItem value={1}>{polyglot.t('level1')}</MenuItem>
                        <MenuItem value={2}>{polyglot.t('level2')}</MenuItem>
                        <MenuItem value={3}>{polyglot.t('level3')}</MenuItem>
                        <MenuItem value={4}>{polyglot.t('level4')}</MenuItem>
                    </Select>
                </FormControl>

                <ColorPickerParamsAdmin
                    colors={this.state.colors || defaultArgs.colors}
                    onChange={this.setColors}
                    polyglot={polyglot}
                    monochromatic={true}
                />
            </div>
        );
    }
}

export default translate(TitleAdmin);
