import BasicChartVG from './BasicChartVG';
import { MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH } from '../../utils/colorUtils';
import deepClone from 'lodash/cloneDeep';
import treeMapModel from './json/tree_map.vg.json';

export const TREE_MAP_LAYOUT = ['squarify', 'binary', 'slicedice'];

class TreeMap extends BasicChartVG {
    constructor() {
        super();
        this.model = deepClone(treeMapModel);
        this.layout = 'squarify';
        this.ratio = 2.0;
        this.colors = MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH.split(' ');
    }

    setLayout(newLayout) {
        if (!TREE_MAP_LAYOUT.includes(newLayout)) {
            return;
        }
        this.layout = newLayout;
    }

    setRatio(newRatio) {
        if (newRatio < 1 || newRatio > 5) {
            return;
        }
        this.ratio = newRatio;
    }

    setColor(colors) {
        this.colors = colors.split(' ');
    }

    buildSpec(widthIn) {
        if (!this.editMode) {
            this.model.width = widthIn - widthIn * 0.06;
            this.model.height = widthIn - widthIn * 0.24;
        } else {
            this.model.width = '{|__LODEX_WIDTH__|}';
            this.model.height = '{|__LODEX_HEIGHT__|}';
        }

        this.model.data.forEach((dataEntry) => {
            if (dataEntry.name === 'tree') {
                dataEntry.transform.forEach((transformEntry) => {
                    if (transformEntry.name === 'treemap') {
                        transformEntry.method = this.layout;
                        transformEntry.ratio = this.ratio;
                    }
                });
            }
        });

        this.model.scales.forEach((scalesEntry) => {
            if (scalesEntry.name === 'color') {
                scalesEntry.range = this.colors;
            }
        });

        return this.model;
    }
}

export default TreeMap;
