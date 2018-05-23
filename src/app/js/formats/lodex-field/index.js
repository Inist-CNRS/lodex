import Component from './LodexFieldView';
import AdminComponent, { defaultArgs } from './LodexFieldAdmin';

import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    ListComponent: Component,
    defaultArgs,
};
