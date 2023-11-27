import React from 'react';
import DefaultFormat from '../DefaultFormat';
import Component from './JsonDebugView';
import AdminComponent, { defaultArgs } from './JsonDebugAdmin';
import DataObjectIcon from '@mui/icons-material/DataObject';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    defaultArgs,
    Icon: () => {
        return <DataObjectIcon sx={{ fontSize: '48px' }} />;
    },
};
