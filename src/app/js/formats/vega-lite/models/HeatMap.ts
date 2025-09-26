import BasicChart from './BasicChart';
import { LABEL_ASC, LABEL_DESC } from '../../utils/chartsUtils';
import heatmapVL from './json/heatmap.vl.json';
// @ts-expect-error TS7016
import deepClone from 'lodash/cloneDeep';

class HeatMap extends BasicChart {
    /**
     * Init all required parameters
     */
    constructor() {
        super();
        // @ts-expect-error TS2339
        this.model = deepClone(heatmapVL);
        // @ts-expect-error TS2339
        this.flip = false;

        // @ts-expect-error TS2339
        this.tooltip = {
            toggle: false,
            source: {
                field: 'source',
                title: 'Source',
                type: 'nominal',
            },
            target: {
                field: 'target',
                title: 'Target',
                type: 'nominal',
            },
            weight: {
                field: 'weight',
                title: 'Weight',
                type: 'quantitative',
            },
        };

        // @ts-expect-error TS2339
        this.orderBy = LABEL_ASC;
    }

    /**
     * Set the display name of the weight
     * @param title new name
     */
    // @ts-expect-error TS7006
    setTooltipValue(title) {
        // @ts-expect-error TS2339
        this.tooltip.weight.title = title;
    }

    /**
     * Set the display name of the source
     * @param title new name
     */
    // @ts-expect-error TS7006
    setTooltipCategory(title) {
        // @ts-expect-error TS2339
        this.tooltip.source.title = title;
    }

    /**
     * Set the display name of the target
     * @param title new name
     */
    // @ts-expect-error TS7006
    setTooltipTarget(title) {
        // @ts-expect-error TS2339
        this.tooltip.target.title = title;
    }

    /**
     * Change the value order
     * @param orderBy order wanted (use factoryUtils const) [default value: VALUES_ASC]
     */
    // @ts-expect-error TS7006
    setOrderBy(orderBy) {
        // @ts-expect-error TS2339
        this.orderBy = orderBy;
    }

    /**
     * Swap x and y axis
     * @param flip new flip status
     */
    // @ts-expect-error TS7006
    flipAxis(flip) {
        // @ts-expect-error TS2339
        this.flip = flip;
    }

    commonWithBubblePlot() {
        // @ts-expect-error TS2339
        this.model.background = 'transparent';

        // @ts-expect-error TS2339
        if (this.flip) {
            // @ts-expect-error TS2339
            const field = this.model.encoding.x.field;
            // @ts-expect-error TS2339
            this.model.encoding.x.field = this.model.encoding.y.field;
            // @ts-expect-error TS2339
            this.model.encoding.y.field = field;
        }

        // @ts-expect-error TS2339
        if (this.tooltip.toggle) {
            // @ts-expect-error TS2339
            this.model.encoding.tooltip = [
                // @ts-expect-error TS2339
                this.tooltip.source,
                // @ts-expect-error TS2339
                this.tooltip.target,
                // @ts-expect-error TS2339
                this.tooltip.weight,
            ];
        }

        // @ts-expect-error TS2339
        switch (this.orderBy) {
            case LABEL_ASC:
                // @ts-expect-error TS2339
                this.model.encoding.x.sort = 'x';
                // @ts-expect-error TS2339
                this.model.encoding.y.sort = 'y';
                break;
            case LABEL_DESC:
                // @ts-expect-error TS2339
                this.model.encoding.x.sort = '-x';
                // @ts-expect-error TS2339
                this.model.encoding.y.sort = '-y';
                break;
        }

        // @ts-expect-error TS2339
        this.model.width = 'container';
        // @ts-expect-error TS2339
        this.model.height = 'container';
        // @ts-expect-error TS2339
        this.model.autosize = {
            type: 'fit',
            contains: 'padding',
        };
    }

    /**
     * Rebuild the edited spec
     * @param widthIn{number | null}
     */
    buildSpec() {
        // @ts-expect-error TS2339
        this.model.layer.forEach((e) => {
            if (e.mark.type === 'rect') {
                // @ts-expect-error TS2339
                e.encoding.color.scale.range = this.colors;
                e.encoding.color.condition.value =
                    // @ts-expect-error TS2339
                    this.colors[this.colors.length - 1];
            }
        });

        // @ts-expect-error TS2339
        this.model.encoding.x.axis.labelAngle = -45;

        this.commonWithBubblePlot();

        // @ts-expect-error TS2339
        return this.model;
    }
}

export default HeatMap;
