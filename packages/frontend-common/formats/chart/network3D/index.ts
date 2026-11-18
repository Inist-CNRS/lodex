import DefaultFormat from '../../utils/components/default-format';
import { lazyComponent } from '../../../utils/lazyComponent';
import AdminComponent, { defaultArgs } from './Network3DAdmin';
import Icon from './NetworkIcon';

// heavy dependencies: loaded on first render
const Component = lazyComponent(() => import('./Network3DView'));

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
