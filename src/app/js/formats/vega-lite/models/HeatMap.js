import BasicChart from './BasicChart';

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

    flipAxis(flip) {
        this.flip = flip;
    }

    buildSpec() {
        const layer1 = this.model.layer[0];

        layer1.encoding.color.scale.range = this.colors;

        layer1.encoding.color.condition.value = this.colors[
            this.colors.length - 1
        ];

        this.model.layer[0] = layer1;

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

        this.model.padding = this.padding;

        return this.model;
    }
}

export default HeatMap;
