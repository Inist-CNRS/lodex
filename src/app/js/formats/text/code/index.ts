import Component from './CodeView';
import AdminComponent, { defaultArgs } from './CodeAdmin';
import EditionComponent from './CodeEdit';
import DefaultFormat from '../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    EditionComponent,
    defaultArgs,
};
