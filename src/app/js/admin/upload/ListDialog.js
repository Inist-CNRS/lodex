import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import compose from 'recompose/compose';
import {
    Select,
    MenuItem,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogContent,
    DialogActions,
} from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    button: {
        marginLeft: 4,
        marginRight: 4,
    },
    input: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        width: '100%',
        cursor: 'pointer',
    },
    divider: {
        display: 'flex',
        margin: '10px',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dividerLabel: {
        margin: '1rem',
    },
    dividerHr: {
        flexGrow: 2,
        marginLeft: '1rem',
        marginRight: '1rem',
    },
    list: {
        width: 1000,
    },
};

const ListItemComponent = ({ value, title, comment }) => {
    return (
        <ListItem
            value={value}
            onClick={() => changeValue(value)}
            className={classnames('facet-item')}
        >
            <ListItemText
                primary={title}
                secondary={
                    <div dangerouslySetInnerHTML={{ __html: comment }} />
                }
            />
        </ListItem>
    );
};

export const ListDialogComponent = ({
    p: polyglot,
    loaders,
    value,
    setLoader,
    open,
    handleClose,
    actions,
}) => {
    const changeValue = newValue => {
        setLoader(newValue);
        handleClose();
    };
    console.log('loaders', loaders);
    const loaderNames = loaders
        .map(loader => loader.name)
        .sort((x, y) => polyglot.t(x).localeCompare(polyglot.t(y)))
        .map(pn => (
            <ListItemComponent
                key={value}
                value={pn}
                title={polyglot.t(pn)}
                comment={polyglot.t(`${pn}-comment`)}
            />
        ));

    return (
        <Dialog open={open} onClose={handleClose} scroll="body" maxWidth="xl">
            <DialogContent>
                <List
                    style={styles.list}
                    className={classnames(styles.list, {})}
                >
                    <ListItemComponent
                        key={'automatic'}
                        value={'automatic'}
                        title={polyglot.t('automatic-loader')}
                        comment={polyglot.t('automatic-loader-comment')}
                    />
                    {loaderNames}
                </List>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

ListDialogComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    loaders: PropTypes.array,
    setLoader: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default compose(translate)(ListDialogComponent);
