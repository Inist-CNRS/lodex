import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { FIELD_FORM_NAME } from '../';

import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';

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

export const StepSemanticsCompositionComponent = ({
    columns,
    fields,
    handleAddColumn,
    handleSelectColumn,
    handleRemoveColumn,
    p: polyglot,
}) => (
    <div>
        <div style={styles.header}>{polyglot.t('wizard_composed_of')}</div>
        <div style={styles.inset}>
            {columns.map((col, index) => (
                <div
                    key={`composition_${index}`} // eslint-disable-line
                    style={styles.compositionContainer}
                >
                    <SelectField
                        className={`composite-field composite-field-${index}`}
                        onChange={handleSelectColumn(index)}
                        style={styles.select}
                        hintText={polyglot.t('select_a_column')}
                        value={col}
                    >
                        <MenuItem
                            className={'composite-field-none'}
                            value={null}
                            primaryText={polyglot.t('completes_field_none')}
                        />
                        {fields.map(f => (
                            <MenuItem
                                className={`composite-field-${index}-${f.name}`}
                                key={`composite-field-${index}-${f.name}`} // eslint-disable-line
                                value={f.name}
                                primaryText={f.label}
                            />
                        ))}
                    </SelectField>
                    {index > 1 &&
                        <IconButton
                            className={`btn-remove-composite-field btn-remove-composite-field-${index}`}
                            onClick={handleRemoveColumn(index)}
                            title={polyglot.t('remove_composition_column')}
                        >
                            <IconDelete />
                        </IconButton>
                    }
                </div>
            ))}
            <FlatButton
                className="btn-add-composition-column"
                label={polyglot.t('add_composition_column')}
                onClick={handleAddColumn}
            />
        </div>
    </div>
);

StepSemanticsCompositionComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    handleSelectColumn: PropTypes.func.isRequired,
    handleRemoveColumn: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

StepSemanticsCompositionComponent.defaultProps = {
    columns: ['', ''],
};

const mapStateToProps = (state) => {
    const composedOf = formValueSelector(FIELD_FORM_NAME)(state, 'composedOf');

    if (composedOf && composedOf.fields.length > 1) {
        return {
            selected: true,
            columns: composedOf.fields || ['', ''],
        };
    }

    return { selected: false, columns: ['', ''], separator: '' };
};

const mapDispatchToProps = dispatch => ({
    onChange: (composedOf) => {
        dispatch(change(FIELD_FORM_NAME, 'composedOf', composedOf));
    },
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleSelect: ({ onChange, columns }) => () => {
            onChange({
                fields: columns,
            });
        },
        handleSelectColumn: ({ columns, onChange }) => index => (event, key, column) => {
            onChange({
                fields: [
                    ...columns.slice(0, index),
                    column,
                    ...columns.slice(index + 1),
                ],
            });
        },
        handleAddColumn: ({ columns, onChange }) => () => {
            onChange({
                fields: [
                    ...columns,
                    '',
                ],
            });
        },
        handleRemoveColumn: ({ columns, onChange }) => index => () => {
            onChange({
                fields: [
                    ...columns.slice(0, index),
                    ...columns.slice(index + 1),
                ],
            });
        },
    }),
    translate,
)(StepSemanticsCompositionComponent);
