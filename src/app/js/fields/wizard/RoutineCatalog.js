import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { polyglot as polyglotPropTypes } from '../../propTypes';

import {
    List,
    ListItemText,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    ListItem,
    Box,
    Link,
    Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import routines from '../../../custom/routines/routines-catalog.json';
import classnames from 'classnames';
import theme from '../../theme';

const useStyles = makeStyles({
    item: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.black.veryLight,
        },
        borderBottom: `1px solid ${theme.black.light}`,
    },
    selectedItem: {
        backgroundColor: theme.green.secondary,
        '&:hover': {
            backgroundColor: theme.green.primary,
        },
        '& a': {
            color: 'white',
        },
    },
});

const RoutineCatalogDescription = ({ routine, polyglot }) => {
    return (
        <React.Fragment>
            <Typography>{polyglot.t(`${routine.id}_description`)}</Typography>
            <Box justifyContent="space-between" display="flex" mt={2}>
                {routine.recommendedWith && (
                    <Tooltip title={polyglot.t(`tooltip_recommendedWith`)}>
                        <Box style={{ display: 'flex', gap: '10px' }}>
                            <ThumbUpIcon color="primary" />
                            <Typography>
                                {routine.recommendedWith.toString()}
                            </Typography>
                        </Box>
                    </Tooltip>
                )}
                {routine.doc && (
                    <Tooltip title={polyglot.t(`tooltip_documentation`)}>
                        <Link
                            href={routine.doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                        >
                            <SettingsEthernetIcon />
                        </Link>
                    </Tooltip>
                )}
            </Box>
        </React.Fragment>
    );
};

export const RoutineCatalog = ({
    p: polyglot,
    isOpen,
    handleClose,
    onChange,
    currentValue,
}) => {
    const classes = useStyles();

    const handleValueChange = newValue => {
        const event = { target: { value: newValue } };
        onChange(event);
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="lg">
            <DialogContent style={{ padding: 0, width: '1100px' }}>
                <List
                    component="nav"
                    aria-label="format list"
                    style={{ height: '70vh' }}
                >
                    {routines.map(routine => (
                        <ListItem
                            key={routine.id}
                            onClick={() => handleValueChange(routine.url)}
                            className={classnames(classes.item, {
                                [classes.selectedItem]: currentValue.includes(
                                    routine.url,
                                ),
                            })}
                        >
                            <ListItemText
                                primary={polyglot.t(`${routine.id}_title`)}
                                primaryTypographyProps={{
                                    style: { fontWeight: 'bold' },
                                }}
                                secondary={
                                    <RoutineCatalogDescription
                                        routine={routine}
                                        polyglot={polyglot}
                                    />
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="text"
                    key="cancel"
                    color="secondary"
                    onClick={handleClose}
                >
                    {polyglot.t('cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

RoutineCatalog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    currentValue: PropTypes.string,
};

RoutineCatalogDescription.propTypes = {
    routine: PropTypes.shape({
        id: PropTypes.string.isRequired,
        doc: PropTypes.string,
        url: PropTypes.string,
        recommendedWith: PropTypes.array,
    }).isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default compose(translate)(RoutineCatalog);
