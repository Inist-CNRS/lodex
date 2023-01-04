import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import translate from 'redux-polyglot/translate';
import { Add as AddNewIcon } from '@material-ui/icons';
import { compose } from 'recompose';
import { Button, makeStyles } from '@material-ui/core';

import { addField as addFieldAction } from '../../fields';

const useStyles = makeStyles({
    icon: {
        marginRight: 10,
    },
});

const createDefaultSubresourceField = subresource => {
    const transformers = [
        {
            operation: 'COLUMN',
            args: [
                {
                    name: 'column',
                    type: 'column',
                    value: subresource.path,
                },
            ],
        },
        {
            operation: 'PARSE',
        },
    ];

    if (subresource.identifier) {
        transformers.push({
            operation: 'GET',
            args: [
                { name: 'path', type: 'string', value: subresource.identifier },
            ],
        });
    }

    return {
        subresourceId: subresource._id,
        transformers: transformers,
    };
};

export const AddSubresourceFieldButtonComponent = ({
    addField,
    subresource,
    p: polyglot,
}) => {
    const classes = useStyles();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={() =>
                subresource &&
                addField(createDefaultSubresourceField(subresource))
            }
        >
            <AddNewIcon className={classes.icon} />
            {polyglot.t('new_field')}
        </Button>
    );
};

export const AddSubresourceFieldButton = compose(
    translate,
    withRouter,
    connect(
        (state, { match }) => ({
            subresource: state.subresource.subresources.find(
                s => s._id === match.params.subresourceId,
            ),
        }),
        { addField: addFieldAction },
    ),
)(AddSubresourceFieldButtonComponent);
