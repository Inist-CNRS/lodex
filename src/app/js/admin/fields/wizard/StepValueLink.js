import React, { PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { FIELD_FORM_NAME } from '../';

import { polyglot as polyglotPropTypes } from '../../../propTypes';

const styles = {
    inset: {
        paddingLeft: 40,
    },
    radio: {
        marginTop: 12,
    },
    select: {
        width: '100%',
    },
};

export const StepValueLinkComponent = ({
    datasetFields,
    handleChangeId,
    handleChangeRef,
    handleSelect,
    p: polyglot,
    selected,
    idColumn,
    refColumn,
}) => (
    <div>
        <RadioButton
            className="radio_link"
            label={polyglot.t('a_link_to_another_column')}
            value="link"
            onClick={handleSelect}
            checked={selected}
            style={styles.radio}
        />
        {selected &&
            <div style={styles.inset}>
                <SelectField
                    id="select_id_column"
                    onChange={handleChangeId}
                    style={styles.select}
                    floatingLabelText={polyglot.t('select_an_id_column')}
                    value={idColumn}
                >
                    {datasetFields.map(datasetField => (
                        <MenuItem
                            key={`id_${datasetField}`}
                            className={`id-column-${datasetField}`}
                            value={datasetField}
                            primaryText={datasetField}
                        />
                    ))}
                </SelectField>
                <SelectField
                    id="select_ref_column"
                    onChange={handleChangeRef}
                    style={styles.select}
                    floatingLabelText={polyglot.t('select_a_ref_column')}
                    value={refColumn}
                >
                    {datasetFields.map(datasetField => (
                        <MenuItem
                            key={`ref_${datasetField}`}
                            className={`ref-column-${datasetField}`}
                            value={datasetField}
                            primaryText={datasetField}
                        />
                    ))}
                </SelectField>
            </div>
        }
    </div>
);

StepValueLinkComponent.propTypes = {
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleChangeId: PropTypes.func.isRequired,
    handleChangeRef: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
    idColumn: PropTypes.string,
    refColumn: PropTypes.string,
};
StepValueLinkComponent.defaultProps = {
    idColumn: undefined,
    refColumn: undefined,
};

const mapStateToProps = (state) => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(state, 'transformers');

    const valueTransformer =
        transformers && transformers[0] && transformers[0].operation === 'LINK'
        ? transformers[0]
        : null;

    if (valueTransformer) {
        const id = valueTransformer.args && valueTransformer.args.find(a => a.name === 'identifier');
        const ref = valueTransformer.args && valueTransformer.args.find(a => a.name === 'reference');

        return {
            selected: true,
            idColumn: (id ? id.value : null),
            refColumn: (ref ? ref.value : null),
        };
    }

    return { selected: false, column: null };
};

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleSelect: ({ onChange, idColumn, refColumn }) => () => {
            onChange({
                operation: 'LINK',
                args: [{
                    name: 'identifier',
                    type: 'column',
                    value: idColumn,
                }, {
                    name: 'reference',
                    type: 'column',
                    value: refColumn,
                }],
            });
        },
        handleChangeId: ({ onChange, refColumn }) => (event, key, value) => {
            onChange({
                operation: 'LINK',
                args: [{
                    name: 'identifier',
                    type: 'column',
                    value,
                }, {
                    name: 'reference',
                    type: 'column',
                    value: refColumn,
                }],
            });
        },
        handleChangeRef: ({ onChange, idColumn }) => (event, key, value) => {
            onChange({
                operation: 'LINK',
                args: [{
                    name: 'identifier',
                    type: 'column',
                    value: idColumn,
                }, {
                    name: 'reference',
                    type: 'column',
                    value,
                }],
            });
        },
    }),
    translate,
)(StepValueLinkComponent);
