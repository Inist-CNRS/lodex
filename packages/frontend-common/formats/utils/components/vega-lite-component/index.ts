import { lazyComponent } from '../../../../utils/lazyComponent';

// vega and vega-lite are heavy: loaded on first render
export const CustomActionVegaLite = lazyComponent(
    () => import('./VegaLiteComponent'),
);
