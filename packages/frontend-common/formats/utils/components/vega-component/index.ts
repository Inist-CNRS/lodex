import { lazyComponent } from '../../../../utils/lazyComponent';

// vega is heavy: loaded on first render
export const CustomActionVega = lazyComponent(() => import('./VegaComponent'));
