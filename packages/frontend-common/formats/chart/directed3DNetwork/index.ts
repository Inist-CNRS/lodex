import DefaultFormat from '../../utils/components/default-format';
import { lazyComponent } from '../../../utils/lazyComponent';
import AdminComponent, { defaultArgs } from '../network3D/Network3DAdmin';
import Icon from '../network/NetworkIcon';

// heavy dependencies: loaded on first render
const Component = lazyComponent(() => import('./Directed3DNetworkView'));

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
