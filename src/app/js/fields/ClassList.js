import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import pure from 'recompose/pure';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import memoize from 'lodash.memoize';

import { polyglot as polyglotPropTypes } from '../propTypes';
import ClassListItem from './ClassListItem';

const styles = {
    header: {
        fontSize: '16px',
        paddingLeft: 0,
    },
};

const ClassList = ({ fields, p: polyglot, onRemove}) => (
    <div>
        <Subheader style={styles.header}>
            <FlatButton
                className="add-class"
                onClick={() => fields.push()}
                label={polyglot.t('add_class')}
            />
        </Subheader>
        {fields.map((fieldName, index) => (
            <ClassListItem
                fieldName={fieldName}
                onRemove={onRemove}
            />
        ))}
    </div>
);

ClassList.PropTypes = {
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
        get: PropTypes.func.isRequired,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
    pure,
)(ClassList);
