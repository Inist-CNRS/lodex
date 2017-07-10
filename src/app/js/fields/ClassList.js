import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import pure from 'recompose/pure';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import { polyglot as polyglotPropTypes } from '../propTypes';
import ListItem from './ClassListItem';

const styles = {
    header: {
        lineHeight: '48px',
        paddingLeft: 0,
    },
    subHeader: {
        fontSize: '16px',
        paddingLeft: 0,
        marginBottom: 10,
    },
    tab: {
        paddingLeft: '40px',
    },
};

const ClassList = ({ fields, p: polyglot }) => (
    <div>
        <div style={styles.header}>{polyglot.t('annotate_class')}</div>
        <Subheader style={styles.subHeader}>
            <FlatButton
                className="add-class"
                onClick={() => fields.push()}
                label={polyglot.t('add_class')}
            />
        </Subheader>
        <div style={styles.tab}>
            {fields.map((fieldName, index) => (
                <ListItem
                    key={fieldName}
                    fieldName={fieldName}
                    onRemove={() => fields.remove(index)}
                />
        ))}
        </div>
    </div>
);

ClassList.PropTypes = {
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
        get: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
    }).isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
    pure,
)(ClassList);
