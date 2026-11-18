import { lazyComponent } from '../../../utils/lazyComponent';
import DefaultFormat from '../../utils/components/default-format';
import AdminComponent, { defaultArgs } from './LatexAdmin';

// heavy dependencies: loaded on first render
const Component = lazyComponent(() => import('./LatexView'));

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
