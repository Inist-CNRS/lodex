import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import pure from 'recompose/pure';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { polyglot as polyglotPropTypes } from '../propTypes';
import ListItem from './ClassListItem';

const styles = {
    header: {
        lineHeight: '36px',
        marginBottom: '10',
    },
    add: {
        marginLeft: '10px',
    },
    subHeader: {
        fontSize: '16px',
        paddingLeft: 0,
        marginBottom: '10px',
    },
    tab: {
        paddingLeft: '40px',
    },
};

const ClassList = ({ fields, p: polyglot }) => (
    <div>
        <div style={styles.header}>
            {polyglot.t('annotate_class')}
            <FloatingActionButton
                className="add-class"
                onTouchTap={() => fields.push()}
                mini
                style={styles.add}
            >
                <ContentAdd />
            </FloatingActionButton>
        </div>
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
    onChangeClass: PropTypes.func.isRequired,
};

export default compose(
    translate,
    pure,
)(ClassList);
