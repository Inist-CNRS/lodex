import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import compose from 'recompose/compose';
import {
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const useStyles = makeStyles({
    item: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.black.veryLight,
        },
    },
    selectedItem: {
        backgroundColor: theme.green.secondary,
        '&:hover': {
            backgroundColor: theme.green.primary,
        },
    },
    list: {
        width: 1000,
    },
});

export const ListDialogComponent = ({
    p: polyglot,
    loaders,
    value,
    setLoader,
    open,
    handleClose,
    actions,
}) => {
    const classes = useStyles();

    const changeValue = newValue => {
        setLoader(newValue);
        handleClose();
    };

    const loaderNames = loaders
        .map(loader => loader.name)
        .sort((x, y) => polyglot.t(x).localeCompare(polyglot.t(y)))
        .map(pn => (
            <ListItemComponent
                key={pn}
                value={pn}
                title={polyglot.t(pn)}
                comment={polyglot.t(`${pn}-comment`)}
                selected={value === pn}
                changeValue={changeValue}
            />
        ));

    return (
        <Dialog open={open} onClose={handleClose} scroll="body" maxWidth="xl">
            <DialogContent>
                <List className={classnames(classes.list)}>
                    <ListItemComponent
                        key={'automatic'}
                        value={'automatic'}
                        title={polyglot.t('automatic-loader')}
                        selected={value === 'automatic'}
                        comment={polyglot.t('automatic-loader-comment')}
                        changeValue={changeValue}
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

const ListItemComponent = ({
    value,
    title,
    comment,
    selected,
    changeValue,
}) => {
    const classes = useStyles();
    console.log(value, selected);
    return (
        <ListItem
            value={value}
            onClick={() => changeValue(value)}
            className={classnames(classes.item, {
                [classes.selectedItem]: selected,
            })}
        >
            <ListItemText
                primary={title}
                primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                secondary={
                    <span dangerouslySetInnerHTML={{ __html: comment }} />
                }
            />
        </ListItem>
    );
};

ListItemComponent.propTypes = {
    selected: PropTypes.bool,
    comment: PropTypes.string,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

export default compose(translate)(ListDialogComponent);
