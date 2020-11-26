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
} from '../../chartsUtils';
import BasicChart from './BasicChart';

/**
 * Class use for create bar chart spec
 */
class BarChart extends BasicChart {
    /**
     * Init all required parameters
     */
    constructor() {
        super();
        this.padding = {
            left: 10,
            right: 0,
            top: 10,
            bottom: 0,
        };
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
        this.labelOverlap = false;
    }

    /**
     * round the value or not
     * @param round new round status
     */
    setRoundValue(round) {
        this.round = round;
    }

    /**
     * Set bar size
     * @param size new size
     */
    setSize(size) {
        this.size = size;
    }

    /**
     * Add label on the bar for display her value or not
     * @param labels new labels status
     */
    setLabels(labels) {
        this.labels = labels;
    }

    /**
     * Set labelOverlap
     * @param labelOverlap flag
     */
    setLabelOverlap(labelOverlap) {
        this.labelOverlap = Boolean(labelOverlap);
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

    /**
     * Function use for rebuild the edited spec
     * @param widthIn
     */
    buildSpec(widthIn, dataNumber) {
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

        if (this.labelOverlap) {
            model.encoding.x.axis.labelOverlap = true;
        }

        if (this.round) {
            model.encoding.x.axis.tickMinStep = 1;
            model.encoding.y.axis.tickMinStep = 1;
        }

        if (widthIn <= 300) {
            model.encoding.x.axis.labelLimit = 120;
        }

        let x, y, lx, ly;
        if (this.direction === AXIS_VERTICAL) {
            x = model.encoding.x;
            lx = labelsModel.encoding.y;
            y = model.encoding.y;
            ly = labelsModel.encoding.x;
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

        let width, height;

        if (this.direction === AXIS_VERTICAL) {
            width =
                widthIn -
                widthIn * 0.09 -
                (!this.labels ? 30 : 0) -
                (this.padding.right + this.padding.left);
            height = 300;
            if (dataNumber * (parseInt(this.size) + 4) >= width) {
                encoding.size = {
                    value: width / (dataNumber + 1),
                };
            } else {
                encoding.size = {
                    value: parseInt(this.size),
                };
            }
        } else {
            width =
                widthIn -
                widthIn * 0.25 -
                (widthIn <= 800 ? 80 : 0) -
                (this.labelAngle.x !== 0 ? 80 : 0) -
                (this.padding.right + this.padding.left);
            height = { step: parseInt(this.size) };
        }

        if (!this.labels) {
            return {
                mark: model.mark,
                encoding: encoding,
                padding: this.padding,
                width: width,
                height: height,
            };
        } else {
            const mark = labelsModel.mark;
            if (this.direction !== AXIS_VERTICAL) {
                mark.dx = 4;
                mark.dy = 0;
                mark.baseline = 'middle';
                mark.align = 'left';
            } else {
                mark.dx = 0;
                mark.baseline = 'bottom';
                mark.align = 'center';
            }

            return {
                layer: [
                    {
                        mark: model.mark,
                        encoding: encoding,
                    },
                    {
                        mark: mark,
                        encoding: labelsEncoding,
                    },
                ],
                padding: this.padding,
                config: {
                    view: { strokeWidth: 0 },
                },
                width: width,
                height: height,
            };
        }
    }
}

export default BarChart;
