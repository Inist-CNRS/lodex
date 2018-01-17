import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import SelectFormat from '../SelectFormat';
import { getAdminComponent, FORMATS, getFormatInitialArgs } from '../';

const styles = {
    container: {
        display: 'inline-flex',
    },
    input: {
        marginLeft: '1rem',
    },
};

export const defaultArgs = {
    type: 'unordered',
    subFormat: 'none',
    subFormatOptions: {},
};

class ListAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            type: PropTypes.string,
            subFormat: PropTypes.string,
            subFormatOptions: PropTypes.any,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setType = type => {
        const newArgs = { ...this.props.args, type };
        this.props.onChange(newArgs);
    };

    setSubFormat = subFormat => {
        const newArgs = {
            ...this.props.args,
            subFormat,
            args: getFormatInitialArgs(subFormat),
        };
        this.props.onChange(newArgs);
    };

    setSubFormatOptions = subFormatOptions => {
        const newArgs = {
            ...this.props.args,
            subFormatOptions,
        };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { type, subFormat, subFormatOptions },
        } = this.props;

        const SubAdminComponent = getAdminComponent(subFormat);

        return (
            <div style={styles.container}>
                <SelectFormat
                    formats={FORMATS}
                    value={subFormat}
                    onChange={this.setSubFormat}
                />
                <SubAdminComponent
                    onChange={this.setSubFormatOptions}
                    args={subFormatOptions}
                />
                <SelectField
                    floatingLabelText={polyglot.t('list_format_select_type')}
                    onChange={(event, index, newValue) =>
                        this.setType(newValue)
                    }
                    style={styles.input}
                    value={type}
                >
                    <MenuItem
                        value="unordered"
                        primaryText={polyglot.t('list_format_unordered')}
                    />
                    <MenuItem
                        value="ordered"
                        primaryText={polyglot.t('list_format_ordered')}
                    />
                </SelectField>
            </div>
        );
    }
}

export default translate(ListAdmin);
