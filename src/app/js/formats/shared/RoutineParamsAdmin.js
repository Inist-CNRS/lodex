import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    input: {
        width: '100%',
    },
};

class RoutineParamsAdmin extends Component {
    static propTypes = {
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        polyglot: polyglotPropTypes.isRequired,
        fieldsToShow: PropTypes.array.isRequired,
    };

    setMaxSize = (_, maxSize) => {
        this.props.onChange({
            ...this.props.params,
            maxSize: parseInt(maxSize, 10),
        });
    };

    setMaxValue = (_, maxValue) => {
        this.props.onChange({
            ...this.props.params,
            maxValue: parseInt(maxValue, 10),
        });
    };

    setMinValue = (_, minValue) => {
        this.props.onChange({
            ...this.props.params,
            minValue: parseInt(minValue, 10),
        });
    };

    setOrderBy = (_, __, orderBy) => {
        this.props.onChange({
            ...this.props.params,
            orderBy,
        });
    };

    render() {
        const { params, polyglot, fieldsToShow } = this.props;

        const { maxSize, maxValue, minValue, orderBy } = params;

        var maxSizeField;
        if (fieldsToShow.includes('maxSize')) {
            maxSizeField = (
                <TextField
                    floatingLabelText={polyglot.t('max_fields')}
                    onChange={this.setMaxSize}
                    style={styles.input}
                    value={maxSize}
                />
            );
        } else {
            maxSizeField = '';
        }

        var minValueField;
        if (fieldsToShow.includes('minValue')) {
            minValueField = (
                <TextField
                    floatingLabelText={polyglot.t('min_value')}
                    onChange={this.setMinValue}
                    style={styles.input}
                    value={minValue}
                />
            );
        } else {
            minValueField = '';
        }

        var maxValueField;
        if (fieldsToShow.includes('maxValue')) {
            maxValueField = (
                <TextField
                    floatingLabelText={polyglot.t('max_value')}
                    onChange={this.setMaxValue}
                    style={styles.input}
                    value={maxValue}
                />
            );
        } else {
            maxValueField = '';
        }

        var orderByField;
        if (fieldsToShow.includes('orderBy')) {
            orderByField = (
                <SelectField
                    floatingLabelText={polyglot.t('order_by')}
                    onChange={this.setOrderBy}
                    style={styles.input}
                    value={orderBy}
                >
                    <MenuItem
                        value="_id/asc"
                        primaryText={polyglot.t('label_asc')}
                    />
                    <MenuItem
                        value="_id/desc"
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
            );
        } else {
            orderByField = '';
        }

        return (
            <Fragment>
                {maxSizeField}
                {minValueField}
                {maxValueField}
                {orderByField}
            </Fragment>
        );
    }
}

export default RoutineParamsAdmin;
