import { lazyComponent } from '../../../utils/lazyComponent';
import AdminComponent, { defaultArgs } from './CodeAdmin';
import DefaultFormat from '../../utils/components/default-format';

// heavy dependencies: loaded on first render
const Component = lazyComponent(() => import('./CodeView'));

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    defaultArgs,
};
