import DefaultFormat from '../../../utils/components/default-format';
import AdminComponent, { defaultArgs } from './TreeMapAdmin';
import Component from './TreeMapView';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import React from 'react';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    defaultArgs,
    Icon: (props) => {
        return <ViewQuiltIcon {...props}></ViewQuiltIcon>;
    },
};
