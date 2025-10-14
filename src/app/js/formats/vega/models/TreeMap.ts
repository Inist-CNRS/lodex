import BasicChartVG from './BasicChartVG';
import { MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH } from '../../utils/colorUtils';
import deepClone from 'lodash/cloneDeep';
import treeMapModel from './json/tree_map.vg.json';

export const TREE_MAP_LAYOUT = [
    'squarify' as const,
    'binary' as const,
    'slicedice' as const,
];

export type TreeMapLayout = 'squarify' | 'binary' | 'slicedice';

class TreeMap extends BasicChartVG {
    constructor() {
        super();
        // @ts-expect-error TS2339
        this.model = deepClone(treeMapModel);
        // @ts-expect-error TS2551
        this.isHierarchy = true;
        // @ts-expect-error TS2339
        this.layout = 'squarify';
        // @ts-expect-error TS2339
        this.ratio = 2.0;
        // @ts-expect-error TS2339
        this.colors = MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH.split(' ');
        // @ts-expect-error TS2339
        this.tooltip = {
            toggle: false,
            third: true,
            source: 'Source',
            target: 'Target',
            weight: 'Weight',
        };
    }

    // @ts-expect-error TS7006
    setHierarchy(bool) {
        // @ts-expect-error TS2551
        this.isHierarchy = bool;
    }

    // @ts-expect-error TS7006
    setLayout(newLayout) {
        if (!TREE_MAP_LAYOUT.includes(newLayout)) {
            return;
        }
        // @ts-expect-error TS2339
        this.layout = newLayout;
    }

    // @ts-expect-error TS7006
    setRatio(newRatio) {
        if (newRatio < 1 || newRatio > 5) {
            return;
        }
        // @ts-expect-error TS2339
        this.ratio = newRatio;
    }

    // @ts-expect-error TS7006
    setColors(colors) {
        // @ts-expect-error TS2339
        this.colors = colors;
    }

    /**
     * Set the status of the tooltip (display or not)
     * @param bool new status
     */
    // @ts-expect-error TS7006
    setTooltip(bool) {
        // @ts-expect-error TS2339
        this.tooltip.toggle = bool;
    }

    // @ts-expect-error TS7006
    setThirdTooltip(bool) {
        // @ts-expect-error TS2339
        this.tooltip.third = bool;
    }

    /**
     * Set the display name of the source
     * @param title new name
     */
    // @ts-expect-error TS7006
    setTooltipSource(title) {
        // @ts-expect-error TS2339
        this.tooltip.source = title;
    }

    /**
     * Set the display name of the target
     * @param title new name
     */
    // @ts-expect-error TS7006
    setTooltipTarget(title) {
        // @ts-expect-error TS2339
        this.tooltip.target = title;
    }

    /**
     * Set the display name of the weight
     * @param title new name
     */
    // @ts-expect-error TS7006
    setTooltipWeight(title) {
        // @ts-expect-error TS2339
        this.tooltip.weight = title;
    }

    // @ts-expect-error TS7006
    buildSpec(widthIn) {
        // @ts-expect-error TS2339
        if (!this.editMode) {
            // @ts-expect-error TS2339
            this.model.width = widthIn - widthIn * 0.06;
            // @ts-expect-error TS2339
            this.model.height = widthIn - widthIn * 0.24;
        } else {
            // @ts-expect-error TS2339
            this.model.width = '{|__LODEX_WIDTH__|}';
            // @ts-expect-error TS2339
            this.model.height = '{|__LODEX_HEIGHT__|}';
        }

        // @ts-expect-error TS2339
        this.model.data.forEach((dataEntry) => {
            if (dataEntry.name === 'tree') {
                // @ts-expect-error TS7006
                dataEntry.transform.forEach((transformEntry) => {
                    if (transformEntry.name === 'treemap') {
                        // @ts-expect-error TS2339
                        transformEntry.method = this.layout;
                        // @ts-expect-error TS2339
                        transformEntry.ratio = this.ratio;
                    }
                });
            }
        });

        // @ts-expect-error TS2339
        if (this.tooltip.toggle) {
            // @ts-expect-error TS2339
            this.model.marks.forEach((markEntry) => {
                if (
                    markEntry.type === 'rect' &&
                    markEntry.from.data === 'leaves'
                ) {
                    // @ts-expect-error TS2551
                    if (this.isHierarchy) {
                        const signal = ['{'];
                        signal.push(
                            // @ts-expect-error TS2339
                            `"${this.tooltip.source}": datum.hierarchy`,
                        );
                        signal.push(',');
                        // @ts-expect-error TS2339
                        signal.push(`"${this.tooltip.target}": datum.name`);
                        signal.push(',');
                        // @ts-expect-error TS2339
                        signal.push(`"${this.tooltip.weight}": datum.size`);
                        signal.push('}');
                        markEntry.encode.enter.tooltip = {
                            signal: signal.join(''),
                        };
                    } else {
                        // @ts-expect-error TS2339
                        if (this.tooltip.third) {
                            const signal = ['{'];
                            signal.push(
                                // @ts-expect-error TS2339
                                `"${this.tooltip.source}": datum.original.source`,
                            );
                            signal.push(',');
                            signal.push(
                                // @ts-expect-error TS2339
                                `"${this.tooltip.target}": datum.original.target`,
                            );
                            signal.push(',');
                            // @ts-expect-error TS2339
                            signal.push(`"${this.tooltip.weight}": datum.size`);
                            signal.push('}');
                            markEntry.encode.enter.tooltip = {
                                signal: signal.join(''),
                            };
                        } else {
                            const signal = ['{'];
                            // @ts-expect-error TS2339
                            signal.push(`"${this.tooltip.source}": datum.name`);
                            signal.push(',');
                            // @ts-expect-error TS2339
                            signal.push(`"${this.tooltip.target}": datum.size`);
                            signal.push('}');
                            markEntry.encode.enter.tooltip = {
                                signal: signal.join(''),
                            };
                        }
                    }
                }
            });
        }

        // @ts-expect-error TS2339
        this.model.scales.forEach((scalesEntry) => {
            if (scalesEntry.name === 'color') {
                // @ts-expect-error TS2339
                scalesEntry.range = this.colors;
            }
        });

        // @ts-expect-error TS2551
        if (!this.isHierarchy && !this.tooltip.third) {
            // @ts-expect-error TS2339
            this.model.marks.forEach((markEntry) => {
                if (markEntry.type === 'text') {
                    markEntry.from.data = 'leaves';
                }
            });
        }

        // @ts-expect-error TS2339
        return this.model;
    }
}

export default TreeMap;
