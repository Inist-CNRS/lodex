import DefaultFormat from '../../utils/components/default-format';
import Component from './ObjectView';
import AdminComponent, { defaultArgs } from './ObjectAdmin';
import DataObjectIcon from '@mui/icons-material/DataObject';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    defaultArgs,
    Icon: () => <DataObjectIcon sx={{ fontSize: '48px' }} />,
};
