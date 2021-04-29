import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import ColorPickerParamsAdmin from '../shared/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../colorUtils';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        marginLeft: '1rem',
        width: '40%',
    },
};

export const defaultArgs = {
    size: 4,
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

class EmphasedNumberAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            size: PropTypes.number,
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

    setSize = size => {
        const newArgs = {
            ...this.props.args,
            size,
        };
        this.props.onChange(newArgs);
    };

    setColors(colors) {
        updateAdminArgs('colors', colors.split(' ')[0], this.props);
    }

    render() {
        const {
            p: polyglot,
            args: { size },
        } = this.props;

        return (
            <div style={styles.container}>
                <FormControl fullWidth>
                    <InputLabel id="emphased-number-admin-input-label">
                        {polyglot.t('list_format_select_size')}
                    </InputLabel>
                    <Select
                        labelId="emphased-number-admin-input-label"
                        onChange={e => this.setSize(e.target.value)}
                        style={styles.input}
                        value={size}
                    >
                        <MenuItem value={1}>{polyglot.t('size1')}</MenuItem>
                        <MenuItem value={2}>{polyglot.t('size2')}</MenuItem>
                        <MenuItem value={3}>{polyglot.t('size3')}</MenuItem>
                        <MenuItem value={4}>{polyglot.t('size4')}</MenuItem>
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

export default translate(EmphasedNumberAdmin);
