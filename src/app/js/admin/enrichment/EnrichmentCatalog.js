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
    Link,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ListItemButton } from '@mui/material';
import enrichers from '../../../custom/enrichers/enrichers-catalog.json';

const useStyles = makeStyles({
    list: {
        width: 800,
        height: '70vh',
    },
});

const EnricherDescription = ({ enricher, polyglot }) => {
    return (
        <React.Fragment>
            <Typography>
                {polyglot.t(`ws_${enricher.id}_description`)}
            </Typography>
            {enricher.doc && (
                <Typography>
                    Doc :{' '}
                    <Link
                        href={enricher.doc}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {enricher.doc}
                    </Link>
                </Typography>
            )}
            {enricher.swagger && (
                <Typography>
                    Swagger :{' '}
                    <Link
                        href={enricher.swagger}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {enricher.swagger}
                    </Link>
                </Typography>
            )}
            {enricher.objectifTDM && (
                <Typography>
                    Objectif TDM :{' '}
                    <Link
                        href={enricher.objectifTDM}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {enricher.objectifTDM}
                    </Link>
                </Typography>
            )}
        </React.Fragment>
    );
};

export const EnrichmentCatalog = ({
    p: polyglot,
    isOpen,
    handleClose,
    onChange,
    selectedWebServiceUrl,
}) => {
    const classes = useStyles();

    const handleValueChange = newValue => {
        onChange(newValue);
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="xl">
            <DialogContent>
                <List
                    component="nav"
                    aria-label="format list"
                    className={classes.list}
                >
                    {enrichers.map(enricher => (
                        <ListItemButton
                            key={enricher.id}
                            onClick={() => handleValueChange(enricher.url)}
                            selected={selectedWebServiceUrl === enricher.url}
                        >
                            <ListItemText
                                primary={polyglot.t(`ws_${enricher.id}_title`)}
                                secondary={
                                    <EnricherDescription
                                        enricher={enricher}
                                        polyglot={polyglot}
                                    />
                                }
                            />
                        </ListItemButton>
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

EnrichmentCatalog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedWebServiceUrl: PropTypes.string,
};

EnricherDescription.propTypes = {
    enricher: PropTypes.shape({
        id: PropTypes.string.isRequired,
        doc: PropTypes.string,
        swagger: PropTypes.string,
        objectifTDM: PropTypes.string,
    }).isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default compose(translate)(EnrichmentCatalog);
