import React, { PropTypes } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import { Field, FieldArray, propTypes as reduxFormPropTypes } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import { getTransformers, getTransformerArgs } from './';
import FormSelectField from '../../lib/FormSelectField';
import TransformerArgList from './TransformerArgList';

const styles = {
    container: {
        alignItems: 'flex-end',
        display: 'flex',
    },
};

const TransformerListItem = ({ availableTransformers, index, fieldName, onRemove, p: polyglot }) => (
    <div style={styles.container}>
        <IconButton
            tooltip={polyglot.t('remove_transformer')}
            onClick={() => onRemove(index)}
        >
            <ActionDeleteIcon />
        </IconButton>
        <Field
            name={`${fieldName}.operation`}
            type="text"
            component={FormSelectField}
            label={polyglot.t('select_an_operation')}
        >
            {availableTransformers.map(t => <MenuItem value={t.name} primaryText={t.name} />)}
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
    availableTransformers: getTransformers(state),
    transformerArgs: getTransformerArgs(state, ownProps.operation),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(TransformerListItem);
