import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import SelectFormat from '../SelectFormat';
import { getAdminComponent, FORMATS } from '../';

const styles = {
    container: {
        display: 'inline-flex',
    },
    input: {
        marginLeft: '1rem',
    },
};

class ListEdition extends Component {
    static propTypes = {
        type: PropTypes.string,
        subFormat: PropTypes.string,
        subFormatOptions: PropTypes.any,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        type: 'unordered',
        subFormat: 'none',
        subFormatOptions: {},
    };
    constructor(props) {
        super(props);

        this.state = {
            type: this.props.type,
            subFormat: this.props.subFormat,
        };
    }

    setType = type => {
        this.setState({
            ...this.state,
            type,
        });
        this.props.onChange({
            ...this.state,
            type,
        });
    };

    setSubFormat = subFormat => {
        this.setState({
            ...this.state,
            subFormat,
        });
        this.props.onChange({
            ...this.state,
            subFormat,
        });
    };

    setSubFormatOptions = subFormatOptions => {
        this.setState({
            ...this.state,
            subFormatOptions,
        });
        this.props.onChange({
            subFormatOptions,
            ...this.state,
        });
    };

    render() {
        const { type, subFormat } = this.state;
        const { p: polyglot } = this.props;

        const SubAdminComponent = getAdminComponent(subFormat);

        return (
            <div style={styles.container}>
                <SelectFormat
                    formats={FORMATS}
                    value={subFormat}
                    onChange={this.setSubFormat}
                />
                <SubAdminComponent onChange={this.setSubFormatOptions} />
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

export default translate(ListEdition);
