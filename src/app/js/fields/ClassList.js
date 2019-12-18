import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import pure from 'recompose/pure';
import IconButton from '@material-ui/core/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { polyglot as polyglotPropTypes } from '../propTypes';
import ListItem from './ClassListItem';

const styles = {
    header: {
        lineHeight: '36px',
        marginBottom: '10px',
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
            <IconButton
                className="add-class"
                variant="fab"
                onClick={() => fields.push()}
                mini
                style={styles.add}
            >
                <FontAwesomeIcon icon={faPlus} />;
            </IconButton>
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

ClassList.propTypes = {
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
        get: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
    }).isRequired,
    p: polyglotPropTypes.isRequired,
    onChangeClass: PropTypes.func.isRequired,
};

export default compose(translate, pure)(ClassList);
