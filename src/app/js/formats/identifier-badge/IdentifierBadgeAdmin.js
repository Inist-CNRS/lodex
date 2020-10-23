import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import { resolvers } from '.';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../colorUtils';
import ColorPickerParamsAdmin from '../shared/ColorPickerParamsAdmin';

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
    typid: 1,
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

class IdentifierBadgeAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            typid: PropTypes.string,
            colors: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
        colors: MONOCHROMATIC_DEFAULT_COLORSET,
    };

    constructor(props) {
        super(props);
        this.setColors = this.setColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    setTypid = typid => {
        const newArgs = { ...this.props.args, typid };
        this.props.onChange(newArgs);
    };

    setColors(colors) {
        updateAdminArgs('colors', colors.split(' ')[0], this.props);
    }

    render() {
        const {
            p: polyglot,
            args: { typid },
        } = this.props;
        const items = Object.keys(resolvers).map(resolverID => (
            <MenuItem key={`resolver_${resolverID}`} value={resolverID}>
                {polyglot.t(resolverID)}
            </MenuItem>
        ));
        return (
            <div style={styles.container}>
                <FormControl>
                    <InputLabel id="identifier-badge-admin-input-label">
                        {polyglot.t('list_format_select_identifier')}
                    </InputLabel>
                    <Select
                        labelId="identifier-badge-admin-input-label"
                        onChange={e => this.setTypid(e.target.value)}
                        style={styles.input}
                        value={typid}
                    >
                        {items}
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

export default translate(IdentifierBadgeAdmin);
