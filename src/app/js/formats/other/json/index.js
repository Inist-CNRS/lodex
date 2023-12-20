import React from 'react';
import DefaultFormat from '../../utils/components/DefaultFormat';
import Component from './JsonDebugView';
import AdminComponent, { defaultArgs } from './JsonDebugAdmin';
import DataObjectIcon from '@mui/icons-material/DataObject';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    defaultArgs,
    Icon: () => <DataObjectIcon sx={{ fontSize: '48px' }} />,
};
