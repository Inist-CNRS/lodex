import {
    AXIS_HORIZONTAL,
    AXIS_NOMINAL,
    AXIS_QUANTITATIVE,
    AXIS_VERTICAL,
    AXIS_X,
    AXIS_Y,
    LABEL_ASC,
    LABEL_DESC,
    SCALE_LINEAR,
    SCALE_LOG,
    VALUES_ASC,
    VALUES_DESC,
} from '../chartsUtils';
import BasicChart from './BasicChart';

class BarChart extends BasicChart {
    constructor() {
        super();
        this.model = require('./json/bar_chart.vl.json');
        this.labelsModel = require('./json/bar_chart_labels.vl.json');
        this.scale = 'linear';
        this.labelAngle = {
            x: 0,
            y: 0,
        };
        this.title = {
            x: '',
            y: '',
        };
        this.type = {
            x: AXIS_NOMINAL,
            y: AXIS_QUANTITATIVE,
        };
        this.orderBy = VALUES_ASC;
        this.direction = AXIS_HORIZONTAL;
        this.size = 20;
        this.round = false;
        this.labels = false;
    }

    setRoundValue(round) {
        this.round = round;
    }

    setSize(size) {
        this.size = size;
    }

    setLabels(labels) {
        this.labels = labels;
    }

    /**
     * Change/update the scale on the y axis
     * @param scale the new scale
     */
    setScale(scale) {
        switch (scale) {
            case SCALE_LINEAR:
                this.scale = 'linear';
                break;
            case SCALE_LOG:
                this.scale = 'log';
                break;
            default:
                throw 'Illegal state: The scale given is not a valid scale !';
        }
    }

    /**
     * Change/update the axis angle
     * @param axis the corresponding axis (x or y)
     * @param angle the new label angle
     */
    setLabelAngle(axis, angle) {
        if (isNaN(angle)) {
            throw 'Illegal state: The angle given is not a valid number !';
        }
        if (axis === AXIS_X) {
            this.labelAngle.x = angle;
        } else if (axis === AXIS_Y) {
            this.labelAngle.y = angle;
        } else {
            throw 'Illegal state: The axis given is not a valid axis !';
        }
    }

    /**
     * Change/update the title by axis
     * @param axis the corresponding axis (x or y)
     * @param title the new title
     */
    setTitle(axis, title) {
        if (axis === AXIS_X) {
            this.title.x = title;
        } else if (axis === AXIS_Y) {
            this.title.y = title;
        } else {
            throw 'Illegal state: The axis given is not a valid axis !';
        }
    }

    /**
     * Change/update the type (quantitative, temporal, etc.)
     * @param axis the corresponding axis (x or y)
     * @param type the new type
     */
    setType(axis, type) {
        if (axis === AXIS_X) {
            this.type.x = type;
        } else if (axis === AXIS_Y) {
            this.type.y = type;
        } else {
            throw 'Illegal state: The axis given is not a valid axis !';
        }
    }

    /**
     * Change the value order
     * @param orderBy order wanted (use factoryUtils const) [default value: VALUES_ASC]
     */
    setOrderBy(orderBy) {
        this.orderBy = orderBy;
    }

    /**
     * Change axis direction (swap x and y values)
     * @param axisDirection direction wanted (use factoryUtils const) [default value: AXIS_VERTICAL]
     */
    setAxisDirection(axisDirection) {
        this.direction = axisDirection;
    }

    buildSpec() {
        let model = this.model;
        let labelsModel = this.labelsModel;
        model.encoding.color.scale.range = this.colors;
        model.encoding.y.scale.type = this.scale;
        model.encoding.x.type = this.type.x;
        model.encoding.y.type = this.type.y;
        model.encoding.x.title = this.title.x;
        model.encoding.y.title = this.title.y;
        model.encoding.x.axis.labelAngle = this.labelAngle.x;
        model.encoding.y.axis.labelAngle = this.labelAngle.y;

        switch (this.orderBy) {
            case VALUES_ASC:
                labelsModel.encoding.y.sort = model.encoding.x.sort =
                    this.direction === AXIS_VERTICAL ? 'y' : 'x';
                break;
            case VALUES_DESC:
                labelsModel.encoding.y.sort = model.encoding.x.sort =
                    this.direction === AXIS_VERTICAL ? '-y' : '-x';
                break;
            case LABEL_ASC:
                labelsModel.encoding.y.sort = model.encoding.x.sort =
                    this.direction === AXIS_VERTICAL ? 'x' : 'y';
                break;
            case LABEL_DESC:
                labelsModel.encoding.y.sort = model.encoding.x.sort =
                    this.direction === AXIS_VERTICAL ? '-x' : '-y';
                break;
            default:
                break;
        }

        if (this.round) {
            model.encoding.x.axis.tickMinStep = 1;
            model.encoding.y.axis.tickMinStep = 1;
        }

        let x, y, lx, ly;
        if (this.direction === AXIS_VERTICAL) {
            x = model.encoding.x;
            lx = labelsModel.encoding.y;
            y = model.encoding.y;
            ly = labelsModel.encoding.x;
            labelsModel.mark.align = 'center';
            labelsModel.mark.baseline = 'bottom';
        } else {
            y = model.encoding.x;
            ly = labelsModel.encoding.y;
            x = model.encoding.y;
            lx = labelsModel.encoding.x;
        }

        const labelsEncoding = {
            x: lx,
            y: ly,
            text: labelsModel.encoding.text,
        };

        const encoding = {
            x: x,
            y: y,
            color: model.encoding.color,
        };

        if (this.tooltip.toggle) {
            encoding.tooltip = [this.tooltip.category, this.tooltip.value];
        }

        if (!this.labels) {
            return {
                mark: {
                    type: model.mark.type,
                },
                encoding: encoding,
                padding: this.padding,
                data: {
                    name: this.model.data.name,
                },
            };
        } else {
            return {
                layer: [
                    {
                        mark: {
                            type: model.mark.type,
                        },
                        encoding: encoding,
                    },
                    {
                        mark: labelsModel.mark,
                        encoding: labelsEncoding,
                    },
                ],
                padding: this.padding,
                data: {
                    name: this.model.data.name,
                },
            };
        }
    }
}

export default BarChart;
