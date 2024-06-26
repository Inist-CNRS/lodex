import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { TextField, MenuItem } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../utils/updateAdminArgs';
import { resolvers } from './index';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

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
        this.handleColors = this.handleColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    handleTypid = (typid) => {
        const newArgs = { ...this.props.args, typid };
        this.props.onChange(newArgs);
    };

    handleColors(colors) {
        updateAdminArgs('colors', colors.split(' ')[0], this.props);
    }

    render() {
        const {
            p: polyglot,
            args: { typid },
        } = this.props;
        const items = Object.keys(resolvers).map((resolverID) => (
            <MenuItem key={`resolver_${resolverID}`} value={resolverID}>
                {polyglot.t(resolverID)}
            </MenuItem>
        ));
        return (
            <FormatGroupedFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('list_format_select_identifier')}
                        value={typid}
                        onChange={(e) => this.handleTypid(e.target.value)}
                    >
                        {items}
                    </TextField>
                    <ColorPickerParamsAdmin
                        colors={this.state.colors || defaultArgs.colors}
                        onChange={this.handleColors}
                        polyglot={polyglot}
                        monochromatic={true}
                    />
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(IdentifierBadgeAdmin);
