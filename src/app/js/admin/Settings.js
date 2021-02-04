import React from 'react';
import { makeStyles } from '@material-ui/core';

import ExportFieldsButton from '../public/export/ExportFieldsButton';
import { ExportDatasetButton } from '../public/export/ExportDatasetButton';
import { ClearDatasetButton } from './clear/ClearDatasetButton';

const useStyles = makeStyles({
    actionList: {
        listStyleType: 'none',
        padding: 0,
        '&>li': {
            marginBottom: 10,
            width: 300,
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
            <li>
                <ClearDatasetButton />
            </li>
        </ul>
    );
}
