import BasicChart from "./BasicChart";
import {
    AXIS_NOMINAL,
    AXIS_QUANTITATIVE,
    AXIS_VERTICAL,
    AXIS_X,
    AXIS_Y,
    LABEL_ASC, LABEL_DESC, SCALE_LINEAR, SCALE_LOG,
    VALUES_ASC,
    VALUES_DESC
} from "../chartsUtils";

class BasicBarChart extends BasicChart {
    constructor() {
        super();
        this.mark = 'bar';
        this.direction = AXIS_VERTICAL;
        this.short = VALUES_ASC;
        this.encoding = {
            x: {
                field: '_id',
                type: AXIS_NOMINAL,
                axis: {
                    labelAngle: 0
                },
                title: ''
            },
            y: {
                field: 'value',
                type: AXIS_QUANTITATIVE,
                axis: {
                    labelAngle: 0
                },
                scale: {
                    type: 'linear'
                },
                title: ''
            }
        }
    }

    setScale(scale) {
        switch (scale) {
            case SCALE_LINEAR:
                this.encoding.y.scale.type = 'linear';
                break;
            case SCALE_LOG:
                this.encoding.y.scale.type = 'log';
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
            this.encoding.x.axis.labelAngle = angle;
        } else if (axis === AXIS_Y) {
            this.encoding.y.axis.labelAngle = angle;
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
            this.encoding.x.title = title;
        } else if (axis === AXIS_Y) {
            this.encoding.y.title = title;
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
            this.encoding.x.type = type;
        } else if (axis === AXIS_Y) {
            this.encoding.y.type = type;
        } else {
            throw 'Illegal state: The axis given is not a valid axis !';
        }
    }

    /**
     * Change the value order
     * @param orderBy order wanted (use factoryUtils const) [default value: VALUES_ASC]
     */
    setOrderBy(orderBy) {
        this.short = orderBy
    }

    /**
     * Change axis direction (swap x and y values)
     * @param axisDirection direction wanted (use factoryUtils const) [default value: AXIS_VERTICAL]
     */
    setAxisDirection(axisDirection) {
        this.direction = axisDirection
    }

    buildSpec() {
        let encoding;
        switch (this.short) {
            case VALUES_ASC:
                this.encoding.x.sort = (this.direction === AXIS_VERTICAL) ? 'y' : 'x';
                break;
            case VALUES_DESC:
                this.encoding.x.sort = (this.direction === AXIS_VERTICAL) ? '-y' : '-x';
                break;
            case LABEL_ASC:
                this.encoding.x.sort = (this.direction === AXIS_VERTICAL) ? 'x' : 'y';
                break;
            case LABEL_DESC:
                this.encoding.x.sort = (this.direction === AXIS_VERTICAL) ? '-x' : '-y';
                break;
            default:
        }

        if (this.direction !== AXIS_VERTICAL) {
            encoding = {
                x: this.encoding.y,
                y: this.encoding.x
            };
        } else {encoding = this.encoding}

        let colorSet = this.colors;

        encoding.color = {
            field: '_id',
            scale: {
                range: colorSet
            },
            type: AXIS_NOMINAL,
            legend: null
        };

        return {
            mark: this.mark,
            encoding: encoding,
            data: {name: 'values'},
            padding: this.padding
        }
    }
}

export default BasicBarChart;
