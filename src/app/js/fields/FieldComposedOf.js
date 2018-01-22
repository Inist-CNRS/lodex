import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';

import { FIELD_FORM_NAME } from './';
import ComposedOfColumn from './ComposedOfColumn';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';

const styles = {
    inset: {
        paddingLeft: 40,
    },
    compositionContainer: {
        display: 'flex',
    },
    select: {
        flexGrow: 2,
    },
    header: {
        paddingLeft: 0,
    },
};

class FieldComposedOf extends Component {
    handleToggle = () => {
        const { onChange, isComposedOf } = this.props;
        onChange({
            isComposedOf: !isComposedOf,
            fields: !isComposedOf ? ['', ''] : [],
        });
    };

    handleSelectColumn = index => (event, key, column) => {
        const { columns, isComposedOf, onChange } = this.props;
        onChange({
            isComposedOf,
            fields: [
                ...columns.slice(0, index),
                column,
                ...columns.slice(index + 1),
            ],
        });
    };

    handleAddColumn = () => {
        const { isComposedOf, columns, onChange } = this.props;
        onChange({
            isComposedOf,
            fields: [...columns, ''],
        });
    };

    handleRemoveColumn = index => () => {
        const { isComposedOf, columns, onChange } = this.props;
        onChange({
            isComposedOf,
            fields: [...columns.slice(0, index), ...columns.slice(index + 1)],
        });
    };

    render() {
        const { isComposedOf, columns, fields, p: polyglot } = this.props;

        return (
            <div>
                <div style={styles.header}>
                    {polyglot.t('wizard_composed_of')}
                </div>
                <div style={styles.inset}>
                    <Toggle
                        label="is_composite_field"
                        toggled={isComposedOf}
                        onToggle={this.handleToggle}
                    />
                    {isComposedOf &&
                        columns.map((col, index) => (
                            <ComposedOfColumn
                                key={`composition_${index}`}
                                index={index}
                                column={col}
                                fields={fields}
                                handleSelectColumn={this.handleSelectColumn(
                                    index,
                                )}
                                handleRemoveColumn={this.handleRemoveColumn(
                                    index,
                                )}
                            />
                        ))}
                    {isComposedOf && (
                        <FlatButton
                            className="btn-add-composition-column"
                            label={polyglot.t('add_composition_column')}
                            onClick={this.handleAddColumn}
                        />
                    )}
                </div>
            </div>
        );
    }
}

FieldComposedOf.propTypes = {
    isComposedOf: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

FieldComposedOf.defaultProps = {
    isComposedOf: false,
    columns: [],
};

const mapStateToProps = (state, { FORM_NAME }) => {
    const composedOf = formValueSelector(FORM_NAME || FIELD_FORM_NAME)(
        state,
        'composedOf',
    );

    if (composedOf && composedOf.fields && composedOf.fields.length > 1) {
        return {
            isComposedOf: composedOf.isComposedOf,
            columns: composedOf.fields,
        };
    }

    return { isComposedOf: false, columns: [] };
};

const mapDispatchToProps = (dispatch, { FORM_NAME = FIELD_FORM_NAME }) => ({
    onChange: composedOf => {
        dispatch(change(FORM_NAME, 'composedOf', composedOf));
    },
});

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    FieldComposedOf,
);
