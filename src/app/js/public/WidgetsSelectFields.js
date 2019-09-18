import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import SuperSelectField from 'material-ui-superselectfield';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';

import { polyglot as polyglotPropTypes } from '../propTypes';
import WidgetsSelectFieldItem from './WidgetsSelectFieldItem';
import getFieldClassName from '../lib/getFieldClassName';

const styles = {
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
    menuFooter: {
        display: 'flex',
        flexGrow: 2,
        justifyContent: 'flex-start',
    },
};

export class WidgetsSelectFieldsComponent extends Component {
    handleChange = values => {
        this.props.onChange(values);
    };

    handleRemove = value => {
        this.handleChange([
            ...this.props.value.slice(
                0,
                this.props.value.findIndex(f => f.value === value),
            ),
            ...this.props.value.slice(
                this.props.value.findIndex(f => f.value === value) + 1,
            ),
        ]);
    };

    renderSelected = values => {
        const { p: polyglot } = this.props;

        return values.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {values.map(({ label, value }) => (
                    <WidgetsSelectFieldItem
                        key={value}
                        value={value}
                        label={label}
                        onRemove={this.handleRemove}
                    />
                ))}
            </div>
        ) : (
            <div style={styles.empty}>
                {polyglot.t('select_exported_fields_all')}
            </div>
        );
    };

    render() {
        const { fields, value, p: polyglot } = this.props;

        return (
            <div className="widget-select-field">
                <SuperSelectField
                    checkPosition="left"
                    multiple
                    onChange={this.handleChange}
                    selectionsRenderer={this.renderSelected}
                    style={styles.select}
                    value={value}
                    floatingLabel={polyglot.t('select_exported_fields')}
                    hintTextAutocomplete={polyglot.t(
                        'filter_fields_for_widgets',
                    )}
                    menuCloseButton={
                        <Button
                            className="btn-apply-widget-select"
                            label={polyglot.t('apply')}
                        />
                    }
                    menuFooterStyle={styles.menuFooter}
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
                </SuperSelectField>
            </div>
        );
    }
}

WidgetsSelectFieldsComponent.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    value: PropTypes.arrayOf(PropTypes.object),
};

WidgetsSelectFieldsComponent.defaultProps = {
    value: [],
};

export default compose(translate)(WidgetsSelectFieldsComponent);
