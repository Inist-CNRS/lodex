import BasicChart from './BasicChart';
import { LABEL_ASC, LABEL_DESC } from '../chartsUtils';

class HeatMap extends BasicChart {
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

    setTooltipValue(title) {
        this.tooltip.weight.title = title;
    }

    setTooltipCategory(title) {
        this.tooltip.source.title = title;
    }

    setTooltipTarget(title) {
        this.tooltip.target.title = title;
    }

    setOrderBy(orderBy) {
        this.orderBy = orderBy;
    }

    flipAxis(flip) {
        this.flip = flip;
    }

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
