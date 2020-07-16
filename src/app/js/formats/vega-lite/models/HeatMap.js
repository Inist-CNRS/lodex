import BasicChart from './BasicChart';
import { LABEL_ASC, LABEL_DESC } from '../chartsUtils';

/**
 * Class use for create heatmap spec
 */
class HeatMap extends BasicChart {
    /**
     * Init all required parameters
     */
    constructor() {
        super();
        this.model = require('./json/heatmap.vl.json');
        this.flip = false;
        this.padding = {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
        };

        this.tooltip = {
            toggle: false,
            source: {
                field: 'source',
                title: 'Sous-domaine x',
                type: 'nominal',
            },
            target: {
                field: 'target',
                title: 'Sous-domaine y',
                type: 'nominal',
            },
            weight: {
                field: 'weight',
                title: 'Nb publis',
                type: 'quantitative',
            },
        };

        this.orderBy = LABEL_ASC;
    }

    /**
     * Set the display name of the weight
     * @param title new name
     */
    setTooltipValue(title) {
        this.tooltip.weight.title = title;
    }

    /**
     * Set the display name of the source
     * @param title new name
     */
    setTooltipCategory(title) {
        this.tooltip.source.title = title;
    }

    /**
     * Set the display name of the target
     * @param title new name
     */
    setTooltipTarget(title) {
        this.tooltip.target.title = title;
    }

    /**
     * Change the value order
     * @param orderBy order wanted (use factoryUtils const) [default value: VALUES_ASC]
     */
    setOrderBy(orderBy) {
        this.orderBy = orderBy;
    }

    /**
     * Swap x and y axis
     * @param flip new flip status
     */
    flipAxis(flip) {
        this.flip = flip;
    }

    /**
     * Function use for rebuild the edited spec
     * @param widthIn
     */
    buildSpec(widthIn) {
        this.model.layer.forEach(e => {
            if (e.mark.type === 'rect') {
                e.encoding.color.scale.range = this.colors;
                e.encoding.color.condition.value = this.colors[
                    this.colors.length - 1
                ];
            }
        });

        if (this.flip) {
            const field = this.model.encoding.x.field;
            this.model.encoding.x.field = this.model.encoding.y.field;
            this.model.encoding.y.field = field;
        }

        this.model.encoding.x.axis.labelAngle = -45;

        if (this.tooltip.toggle) {
            this.model.encoding.tooltip = [
                this.tooltip.source,
                this.tooltip.target,
                this.tooltip.weight,
            ];
        }

        switch (this.orderBy) {
            case LABEL_ASC:
                this.model.encoding.x.sort = 'x';
                this.model.encoding.y.sort = 'y';
                break;
            case LABEL_DESC:
                this.model.encoding.x.sort = '-x';
                this.model.encoding.y.sort = '-y';
                break;
        }

        this.model.padding = this.padding;

        this.model.width = this.model.height =
            widthIn * (widthIn <= 920 ? 0.5 : 0.7);

        return this.model;
    }
}

export default HeatMap;
