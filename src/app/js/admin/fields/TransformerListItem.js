import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import { Field, FieldArray, propTypes as reduxFormPropTypes } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFields } from '../';
import FormSelectField from '../../lib/FormSelectField';
import TransformerArgList from './TransformerArgList';

const styles = {
    container: {
        alignItems: 'flex-end',
        display: 'flex',
    },
};

const TransformerListItem = ({ availableTransformers, fieldName, onRemove, p: polyglot }) => (
    <div style={styles.container}>
        <IconButton
            tooltip={polyglot.t('remove_transformer')}
            onClick={onRemove}
        >
            <ActionDeleteIcon />
        </IconButton>
        <Field
            className="operation"
            name={`${fieldName}.operation`}
            type="text"
            component={FormSelectField}
            label={polyglot.t('select_an_operation')}
        >
            {availableTransformers.map(t => <MenuItem className={t.name} value={t.name} primaryText={t.name} />)}
        </Field>
        <FieldArray name={`${fieldName}.args`} component={TransformerArgList} />
    </div>
);

TransformerListItem.propTypes = {
    availableTransformers: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    })).isRequired,
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    availableTransformers: fromFields.getTransformers(state),
    transformerArgs: fromFields.getTransformerArgs(state, ownProps.operation),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(TransformerListItem);
