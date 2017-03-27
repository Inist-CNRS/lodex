import React, { Component, PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { change } from 'redux-form';

import Step from './Step';
import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../../propTypes';
import { fromParsing } from '../../selectors';
import { FIELD_FORM_NAME } from '../';
import { getTransformerMetas } from '../../../../../common/transformers';

const styles = {
    inset: {
        paddingLeft: 40,
    },
    select: {
        width: '100%',
    },
    radio: {
        marginTop: 12,
    },
    compositionContainer: {
        display: 'flex',
    },
    compositionSelect: {
        flexGrow: 2,
    },
};

export class StepValueComponent extends Component {
    static propTypes = {
        datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
        handleComposedOfChange: PropTypes.func.isRequired,
        handleTransformerChange: PropTypes.func.isRequired,
        field: fieldPropTypes.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    constructor(props) {
        super(props);

        const { field: { transformers, composedOf } } = props;

        const valueTransformer =
            transformers && transformers[0] && getTransformerMetas(transformers[0].operation).type === 'value'
            ? transformers[0]
            : null;

        let column;
        let columns = ['', ''];
        let separator;
        let type;
        let value;

        if (composedOf && composedOf.fields.length > 1) {
            type = 'composition';
            columns = composedOf.fields;
        } else if (valueTransformer && valueTransformer.operation === 'VALUE') {
            type = 'value';
            value = valueTransformer.args && valueTransformer.args[0] && valueTransformer.args[0].value;
        } else if (valueTransformer && valueTransformer.operation === 'COLUMN') {
            type = 'column';
            column = valueTransformer.args && valueTransformer.args[0] && valueTransformer.args[0].value;
        }

        this.state = {
            column,
            columns,
            separator,
            type,
            value,
        };
    }

    handleChange = () => {
        const {
            column,
            columns,
            separator,
            type,
            value,
        } = this.state;

        if (type === 'value') {
            const transformer = {
                operation: 'VALUE',
                args: [{
                    name: 'value',
                    type: 'string',
                    value,
                }],
            };

            this.props.handleTransformerChange(transformer, this.props.field.transformers);
            return;
        }

        if (type === 'column') {
            const transformer = {
                operation: 'COLUMN',
                args: [{
                    name: 'column',
                    type: 'column',
                    value: column,
                }],
            };

            this.props.handleTransformerChange(transformer, this.props.field.transformers);
            return;
        }

        if (type === 'composition') {
            this.props.handleComposedOfChange(columns, separator);
        }
    }

    handleChangeSeparator = (event) => {
        this.setState({ separator: event.target.value }, () => {
            this.handleChange();
        });
    }

    handleChangeValue = (event) => {
        this.setState({ value: event.target.value }, () => {
            this.handleChange();
        });
    }

    handleSelectType = (event) => {
        this.setState({ type: event.target.value }, () => {
            this.handleChange();
        });
    }

    handleSelectColumn = (event, key, column) => {
        this.setState({ column }, () => {
            this.handleChange();
        });
    }

    handleSelectColumns = index => (event, key, column) => {
        this.setState({
            columns: [
                ...this.state.columns.slice(0, index),
                column,
                ...this.state.slice(index + 1),
            ],
        }, () => {
            this.handleChange();
        });
    }

    handleAddCompositionColumn = () => {
        this.setState({
            columns: [
                ...this.state.columns,
                '',
            ],
        }, () => {
            this.handleChange();
        });
    }

    handleRemoveCompositionColumn = index => () => {
        this.setState({
            columns: [
                ...this.state.columns.slice(0, index),
                ...this.state.slice(index + 1),
            ],
        }, () => {
            this.handleChange();
        });
    }

    render() {
        const {
            datasetFields,
            p: polyglot,
            ...props
        } = this.props;

        const {
            column,
            columns,
            separator,
            type,
            value,
        } = this.state;

        return (
            <Step label="field_wizard_step_value" {...props}>
                <RadioButton
                    label={polyglot.t('a_value')}
                    value="value"
                    onClick={this.handleSelectType}
                    checked={type === 'value'}
                    style={styles.radio}
                />
                {type === 'value' &&
                    <div style={styles.inset}>
                        <TextField
                            id="textbox_value"
                            fullWidth
                            placeholder={polyglot.t('enter_a_value')}
                            onChange={this.handleChangeValue}
                            value={value}
                        />
                    </div>
                }
                <RadioButton
                    label={polyglot.t('a_column')}
                    value="column"
                    onClick={this.handleSelectType}
                    checked={type === 'column'}
                    style={styles.radio}
                />
                {type === 'column' &&
                    <div style={styles.inset}>
                        <SelectField
                            id="select_column"
                            onChange={this.handleSelectColumn}
                            style={styles.select}
                            hintText={polyglot.t('select_a_column')}
                            value={column}
                        >
                            {datasetFields.map(datasetField => (
                                <MenuItem
                                    key={datasetField}
                                    value={datasetField}
                                    primaryText={datasetField}
                                />
                            ))}
                        </SelectField>
                    </div>
                }
                <RadioButton
                    label={polyglot.t('a_composition')}
                    value="composition"
                    onClick={this.handleSelectType}
                    checked={type === 'composition'}
                    style={styles.radio}
                />
                {type === 'composition' &&
                    <div style={styles.inset}>
                        {columns.map((col, index) => (
                            <div
                                key={`compotransformerssition_${index}`} // eslint-disable-line
                                style={styles.compositionContainer}
                            >
                                <SelectField
                                    onChange={this.handleSelectColumns(index)}
                                    style={styles.compositionSelect}
                                    hintText={polyglot.t('select_a_column')}
                                    value={col}
                                >
                                    {datasetFields.map(datasetField => (
                                        <MenuItem
                                            key={`select_composition_${index}_${datasetField}`} // eslint-disable-line
                                            insetChildren
                                            value={datasetField}
                                            primaryText={datasetField}
                                        />
                                    ))}
                                </SelectField>
                                {index > 1 &&
                                    <IconButton
                                        onClick={this.handleRemoveCompositionColumn(index)}
                                        title={polyglot.t('remove_composition_column')}
                                    >
                                        <IconDelete />
                                    </IconButton>
                                }
                            </div>
                        ))}
                        <FlatButton
                            label={polyglot.t('add_composition_column')}
                            onClick={this.handleAddCompositionColumn}
                        />
                        <TextField
                            id="textbox_separator"
                            fullWidth
                            placeholder={polyglot.t('enter_a_separator')}
                            onChange={this.handleChangeSeparator}
                            value={separator}
                        />
                    </div>
                }
            </Step>
        );
    }
}

const mapStateToProps = state => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
});

const mapDispatchToProps = dispatch => ({
    handleTransformerChange: (valueTransformer, transformers) => {
        let newTransformers = [];

        if (transformers[0].operation && getTransformerMetas(transformers[0].operation).type === 'value') {
            newTransformers = [
                valueTransformer,
                ...transformers.slice(1),
            ];
        }

        dispatch(change(FIELD_FORM_NAME, 'transformers', newTransformers));
    },
    handleComposedOfChange: (fields, separator) => {
        dispatch(change(FIELD_FORM_NAME, 'composedOf', {
            separator,
            fields,
        }));
    },
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(StepValueComponent);
