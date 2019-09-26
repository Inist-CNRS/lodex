import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
} from '@material-ui/core';
import classnames from 'classnames';
import stylesToClassname from '../lib/stylesToClassName';

import { polyglot as polyglotPropTypes } from '../propTypes';
import WidgetsSelectFieldItem from './WidgetsSelectFieldItem';
import getFieldClassName from '../lib/getFieldClassName';

const styles = stylesToClassname(
    {
        chip: {
            width: '100%',
            height: '100%',
            margin: 0,
            borderRadius: '50%',
            backgroundSize: 'cover',
        },
        select: {
            margin: '0px 0px 0px 18px',
        },
        empty: {
            minHeight: 42,
            lineHeight: '42px',
        },
        noEmpty: {
            display: 'flex',
            flexWrap: 'wrap',
        },
    },
    'widget-select-fields',
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export const WidgetsSelectFieldsComponent = ({
    p: polyglot,
    fields,
    value,
    onChange,
}) => {
    const handleChange = values => {
        onChange(values);
    };

    const handleRemove = removedValue => {
        handleChange([
            ...value.slice(0, value.findIndex(f => f.value === removedValue)),
            ...value.slice(value.findIndex(f => f.value === removedValue) + 1),
        ]);
    };

    const renderSelected = values =>
        values.length ? (
            <div className={styles.noEmpty}>
                {values.map(({ label, value }) => (
                    <WidgetsSelectFieldItem
                        key={value}
                        value={value}
                        label={label}
                        onRemove={handleRemove}
                    />
                ))}
            </div>
        ) : (
            <div className={styles.empty}>
                {polyglot.t('select_exported_fields_all')}
            </div>
        );

    return (
        <div className="widget-select-field">
            <FormControl>
                <InputLabel>{polyglot.t('select_exported_fields')}</InputLabel>
                <Select
                    multiple
                    value={value}
                    onChange={handleChange}
                    renderValue={renderSelected}
                    MenuProps={MenuProps}
                    className={styles.select}
                >
                    {fields.map(field => (
                        <div
                            key={field.name}
                            className={classnames(
                                'widget-select-field-item',
                                getFieldClassName(field),
                            )}
                            value={field.name}
                            label={field.label}
                        >
                            {field.label}
                        </div>
                    ))}
                </Select>
                <FormHelperText>
                    {polyglot.t('filter_fields_for_widgets')}
                </FormHelperText>
            </FormControl>
        </div>
    );
};

WidgetsSelectFieldsComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    value: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func.isRequired,
};

WidgetsSelectFieldsComponent.defaultProps = {
    value: [],
};

export default compose(translate)(WidgetsSelectFieldsComponent);
