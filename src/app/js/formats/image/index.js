import Component from './Component';
import DefaultFormat from '../DefaultFormat';
import AdminComponent, { defaultArgs } from './ImageAdmin';

export default {
    Component,
    AdminComponent,
    EditionComponent: DefaultFormat.EditionComponent,
    defaultArgs,
};
