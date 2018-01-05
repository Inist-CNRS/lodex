import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';

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
    input2: {
        width: '100%',
    },
};

class RessourcesGridAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            maxSize: PropTypes.string,
            spaceWidth: PropTypes.string,
            orderBy: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: {
            maxSize: '5',
            spaceWidth: '30%',
            orderBy: 'value/asc',
        },
    };

    setMaxSize = maxSize => {
        const newArgs = { ...this.props.args, maxSize };
        this.props.onChange(newArgs);
    };

    setOrderBy = orderBy => {
        const newArgs = { ...this.props.args, orderBy };
        this.props.onChange(newArgs);
    };

    setWidth = spaceWidth => {
        const newArgs = { ...this.props.args, spaceWidth };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { maxSize, orderBy, spaceWidth },
        } = this.props;

        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={polyglot.t('max_fields')}
                    type="number"
                    onChange={(event, newValue) => this.setMaxSize(newValue)}
                    style={styles.input}
                    value={maxSize}
                />
                <SelectField
                    floatingLabelText={polyglot.t('order_by')}
                    onChange={(event, index, newValue) =>
                        this.setOrderBy(newValue)
                    }
                    style={styles.input}
                    value={orderBy}
                >
                    <MenuItem
                        value="label/asc"
                        primaryText={polyglot.t('label_asc')}
                    />
                    <MenuItem
                        value="label/desc"
                        primaryText={polyglot.t('label_desc')}
                    />
                    <MenuItem
                        value="value/asc"
                        primaryText={polyglot.t('value_asc')}
                    />
                    <MenuItem
                        value="value/desc"
                        primaryText={polyglot.t('value_desc')}
                    />
                </SelectField>
                <SelectField
                    floatingLabelText={polyglot.t(
                        'list_format_select_image_width',
                    )}
                    onChange={(event, index, newValue) =>
                        this.setWidth(newValue)
                    }
                    style={styles.input}
                    value={spaceWidth}
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

export default translate(RessourcesGridAdmin);
