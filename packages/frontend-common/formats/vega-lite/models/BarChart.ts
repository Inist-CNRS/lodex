import {
    AXIS_HORIZONTAL,
    AXIS_NOMINAL,
    AXIS_QUANTITATIVE,
    AXIS_VERTICAL,
    AXIS_X,
    AXIS_Y,
    SCALE_LINEAR,
    SCALE_LOG,
} from '../../utils/chartsUtils';
import BasicChart from './BasicChart';
import barChartVL from './json/bar_chart.vl.json';
import barChartLabelsVL from './json/bar_chart_labels.vl.json';
import deepClone from 'lodash/cloneDeep';

class BarChart extends BasicChart {
    enableSelection: boolean;
    /**
     * Init all required parameters
     */
    constructor({ enableSelection = false }: { enableSelection?: boolean }) {
        super();
        this.enableSelection = enableSelection;
        // @ts-expect-error TS2339
        this.padding = 18;
        // @ts-expect-error TS2339
        this.model = deepClone(barChartVL);
        // @ts-expect-error TS2339
        this.labelsModel = deepClone(barChartLabelsVL);
        // @ts-expect-error TS2339
        this.scale = 'linear';
        // @ts-expect-error TS2551
        this.labelAngle = {
            x: 0,
            y: 0,
        };
        // @ts-expect-error TS2339
        this.title = {
            x: '',
            y: '',
        };
        // @ts-expect-error TS2339
        this.type = {
            x: AXIS_NOMINAL,
            y: AXIS_QUANTITATIVE,
        };
        // @ts-expect-error TS2339
        this.direction = AXIS_HORIZONTAL;
        // @ts-expect-error TS2339
        this.size = 20;
        // @ts-expect-error TS2339
        this.round = false;
        // @ts-expect-error TS2339
        this.labels = false;
        // @ts-expect-error TS2551
        this.labelOverlap = false;
    }

    /**
     * round the value or not
     * @param round {boolean} new round status
     */
    // @ts-expect-error TS7006
    setRoundValue(round) {
        // @ts-expect-error TS2339
        this.round = round;
    }

    /**
     * Set bar size
     * @param size {number} new size
     */
    // @ts-expect-error TS7006
    setSize(size) {
        // @ts-expect-error TS2339
        this.size = size;
    }

    /**
     * Add label on the bar for display her value or not
     * @param labels {boolean} new labels status
     */
    // @ts-expect-error TS7006
    setLabels(labels) {
        // @ts-expect-error TS2339
        this.labels = labels;
    }

    /**
     * Set labelOverlap
     * @param labelOverlap {boolean} flag
     */
    // @ts-expect-error TS7006
    setLabelOverlap(labelOverlap) {
        // @ts-expect-error TS2551
        this.labelOverlap = Boolean(labelOverlap);
    }

    /**
     * Change/update the scale on the y axis
     * @param scale the new scale
     */
    // @ts-expect-error TS7006
    setScale(scale) {
        switch (scale) {
            case SCALE_LINEAR:
                // @ts-expect-error TS2339
                this.scale = 'linear';
                break;
            case SCALE_LOG:
                // @ts-expect-error TS2339
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
    // @ts-expect-error TS7006
    setLabelAngle(axis, angle) {
        if (isNaN(angle)) {
            throw 'Illegal state: The angle given is not a valid number !';
        }
        if (axis === AXIS_X) {
            // @ts-expect-error TS2551
            this.labelAngle.x = angle;
        } else if (axis === AXIS_Y) {
            // @ts-expect-error TS2551
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
    // @ts-expect-error TS7006
    setTitle(axis, title) {
        if (axis === AXIS_X) {
            // @ts-expect-error TS2339
            this.title.x = title;
        } else if (axis === AXIS_Y) {
            // @ts-expect-error TS2339
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
    // @ts-expect-error TS7006
    setType(axis, type) {
        if (axis === AXIS_X) {
            // @ts-expect-error TS2339
            this.type.x = type;
        } else if (axis === AXIS_Y) {
            // @ts-expect-error TS2339
            this.type.y = type;
        } else {
            throw 'Illegal state: The axis given is not a valid axis !';
        }
    }

    /**
     * Change axis direction (swap x and y values)
     * @param axisDirection direction wanted (use factoryUtils const) [default value: AXIS_VERTICAL]
     */
    // @ts-expect-error TS7006
    setAxisDirection(axisDirection) {
        // @ts-expect-error TS2339
        this.direction = axisDirection;
    }

    /**
     * Rebuild the edited spec
     */
    buildSpec({ selectedDatum }: { selectedDatum?: unknown } = {}) {
        // @ts-expect-error TS2339
        const model = this.model;
        // @ts-expect-error TS2339
        const labelsModel = this.labelsModel;
        // @ts-expect-error TS2339
        model.encoding.color.scale.range = this.colors;
        // @ts-expect-error TS2339
        model.encoding.y.scale.type = this.scale;
        // @ts-expect-error TS2339
        model.encoding.x.type = this.type.x;
        // @ts-expect-error TS2339
        model.encoding.y.type = this.type.y;
        // @ts-expect-error TS2339
        model.encoding.x.title = this.title.x;
        // @ts-expect-error TS2339
        model.encoding.y.title = this.title.y;
        // @ts-expect-error TS2551
        model.encoding.x.axis.labelAngle = this.labelAngle.x;
        // @ts-expect-error TS2551
        model.encoding.y.axis.labelAngle = this.labelAngle.y;

        // Disable sort because the data
        // send by the routines are already sorted
        // and enabling this can cause unexpected behaviours
        labelsModel.encoding.x.sort = null;
        labelsModel.encoding.y.sort = null;
        model.encoding.x.sort = null;
        model.encoding.y.sort = null;

        // @ts-expect-error TS2551
        if (this.labelOverlap) {
            model.encoding.x.axis.labelOverlap = true;
        }

        // @ts-expect-error TS2339
        if (this.round) {
            model.encoding.x.axis.tickMinStep = 1;
            model.encoding.y.axis.tickMinStep = 1;
        }

        let x, y, lx, ly;
        // @ts-expect-error TS2339
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

        let params: any[] = model.params;

        if (this.enableSelection) {
            // @ts-expect-error TS2339
            encoding.fillOpacity = {
                condition: [
                    {
                        param: 'select',
                        value: 1,
                    },
                    {
                        param: 'highlight',
                        empty: false,
                        value: 1,
                    },
                ],
                value: 0.3,
            };

            // @ts-expect-error TS2339
            encoding.strokeWidth = {
                condition: [
                    {
                        param: 'select',
                        empty: false,
                        value: 2,
                    },
                    {
                        param: 'highlight',
                        empty: false,
                        value: 1,
                    },
                ],
                value: 0,
            };

            params = (params ?? []).concat([
                {
                    name: 'highlight',
                    select: {
                        type: 'point',
                        on: 'pointerover',
                    },
                },
                {
                    name: 'select',
                    select: 'point',
                    value: selectedDatum ? [selectedDatum] : null,
                },
            ]);
        }

        // @ts-expect-error TS2339
        if (this.tooltip.toggle) {
            // @ts-expect-error TS2339
            encoding.tooltip = [this.tooltip.category, this.tooltip.value];
        }

        let height = 'container';
        // @ts-expect-error TS2339
        if (this.size > 0) {
            // @ts-expect-error TS2339
            if (this.direction === AXIS_HORIZONTAL) {
                // @ts-expect-error TS2322
                height = {
                    // @ts-expect-error TS2339
                    step: this.size,
                };
            } else {
                // @ts-expect-error TS2322
                encoding.size = {
                    // @ts-expect-error TS2339
                    value: this.size,
                };
            }
        }

        // @ts-expect-error TS2339
        if (!this.labels) {
            return {
                ...(params ? { params } : {}),
                background: 'transparent',
                mark: {
                    ...model.mark,
                    ...(this.enableSelection
                        ? {
                              cursor: 'pointer',
                              stroke: 'black',
                          }
                        : {}),
                },
                encoding: encoding,
                // @ts-expect-error TS2339
                padding: this.padding,
                width: 'container',
                height,
                autosize: {
                    type: 'fit',
                    contains: 'padding',
                },
            };
        } else {
            const mark = labelsModel.mark;
            // @ts-expect-error TS2339
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
                background: 'transparent',
                layer: [
                    {
                        ...(this.enableSelection ? { params } : {}),
                        mark: {
                            ...model.mark,
                            ...(this.enableSelection
                                ? {
                                      cursor: 'pointer',
                                      stroke: 'black',
                                  }
                                : {}),
                        },
                        encoding: encoding,
                    },
                    {
                        mark: mark,
                        encoding: labelsEncoding,
                    },
                ],
                // @ts-expect-error TS2339
                padding: this.padding,
                config: {
                    view: { strokeWidth: 0 },
                },
                width: 'container',
                height,
                autosize: {
                    type: 'fit',
                    contains: 'padding',
                },
            };
        }
    }
}

export default BarChart;
