import React from 'react';
import { makeStyles } from '@material-ui/core';

import ExportFieldsButton from '../public/export/ExportFieldsButton';
import { ExportDatasetButton } from '../public/export/ExportDatasetButton';

const useStyles = makeStyles({
    actionList: {
        listStyleType: 'none',
        padding: 0,
        '&>li': {
            marginBottom: 10,
        },
    },
});

export default function Settings() {
    const classes = useStyles();

    return (
        <ul className={classes.actionList}>
            <li>
                <ExportDatasetButton />
            </li>
            <li>
                <ExportFieldsButton />
            </li>
        </ul>
    );
}
