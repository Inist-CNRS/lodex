import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import get from 'lodash.get';
import { Tooltip, actions } from 'redux-tooltip';

import injectData from '../injectData';
import { fromFields } from '../../sharedSelectors';
import { mapSourceToX, mapTargetToX } from './parseChartData';
import getGradientScaleAndLegend from '../../lib/components/getGradientScaleAndLegend';

const firstCell = {
    height: '60px',
    width: '30px',
    minWidth: '30px',
    maxWidth: '30px',
    position: 'relative',
    verticalAlign: 'bottom',
    padding: 0,
    fontSize: '12px',
    lineHeight: 0.8,
};

const styles = StyleSheet.create({
    table: {
        verticalAlign: 'top',
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        borderCollapse: 'collapse',
        borderSpacing: 0,
        display: 'flex',
        overflow: 'hidden',
        background: 'none',
    },
    thead: {
        display: 'flex',
        flexShrink: 0,
        minWidth: 'min-content',
    },
    tbody: {
        display: 'flex',
        position: 'relative',
        overflowX: 'auto',
        overflowY: 'hidden',
        width: '100%',
    },
    tr: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 'min-content',
        flexShrink: 0,
    },
    td: {
        ':first-child': firstCell,
        display: 'block',
        borderLeft: 0,
        width: '30px',
        height: '30px',
        margin: '2px',
    },
    th: {
        ':first-child': firstCell,
        fontSize: '12px',
        textAlign: 'right',
        textTransform: 'none',
        display: 'block',
        height: '30px',
        margin: '2px',
        lineHeight: '30px',
    },
    rotate: {
        position: 'relative',
        top: '0px',
        left: '0px',
        height: '100%',
        transform: 'skew(-45deg,0deg)',
    },
    rotateSpan: {
        fontWeight: 'bold',
        transform: 'skew(45deg,0deg) rotate(315deg)',
        position: 'absolute',
        bottom: '30px',
        left: '0px',
        display: 'inline-block',
        width: '85px',
        textAlign: 'left',
        whiteSpace: 'normal',
    },
});

const getColorStyle = color => ({
    backgroundColor: color,
});

class HeatMapView extends Component {
    handleMove = event => {
        const x = event.clientX;
        const y = event.clientY + window.pageYOffset;
        const value = Number(get(event, ['target', 'dataset', 'value'], null));

        if (!value) {
            this.props.hideTooltip();
            return;
        }

        this.props.showTooltip({
            origin: { x, y },
            content: <p>{value}</p>,
        });
    };

    handleLeave = () => {
        this.props.hideTooltip();
    };
    render() {
        const { xAxis, yAxis, dictionary, colorScale, legend } = this.props;

        return (
            <div>
                <table
                    onMouseMove={this.handleMove}
                    onMouseLeave={this.handleLeave}
                    className={css(styles.table)}
                >
                    <thead className={css(styles.thead)}>
                        <tr className={css(styles.tr)}>
                            <th className={css(styles.th)} />
                            {yAxis.map(yKey => (
                                <th className={css(styles.th)} key={yKey}>
                                    {yKey}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={css(styles.tbody)}>
                        {xAxis.map(xKey => (
                            <tr key={xKey} className={css(styles.tr)}>
                                <td className={css(styles.td)}>
                                    <div className={css(styles.rotate)}>
                                        <span
                                            className={css(styles.rotateSpan)}
                                        >
                                            {xKey}
                                        </span>
                                    </div>
                                </td>
                                {yAxis.map(yKey => (
                                    <td
                                        className={css(styles.td)}
                                        key={`${xKey}-${yKey}`}
                                        data-value={dictionary[xKey][yKey] || 0}
                                        style={getColorStyle(
                                            colorScale(dictionary[xKey][yKey]),
                                        )}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {legend}
                <Tooltip />
            </div>
        );
    }
}

HeatMapView.propTypes = {
    xAxis: PropTypes.arrayOf(PropTypes.string).isRequired,
    yAxis: PropTypes.arrayOf(PropTypes.string).isRequired,
    dictionary: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number))
        .isRequired,
    legend: PropTypes.element.isRequired,
    colorScale: PropTypes.func.isRequired,
    showTooltip: PropTypes.func.isRequired,
    hideTooltip: PropTypes.func.isRequired,
};

const alphabeticalComparison = (a, b) => {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }

    return 0;
};

const mapStateToProps = (state, { chartData, field }) => {
    const { colorScheme, flipAxis } = fromFields.getFieldFormatArgs(
        state,
        field.name,
    );

    if (!chartData) {
        return {
            xAxis: [],
            yAxis: [],
            dictionary: {},
            colorScheme,
        };
    }

    const { xAxis, yAxis, dictionary, maxValue } = chartData.reduce(
        flipAxis ? mapTargetToX : mapSourceToX,
        { xAxis: [], yAxis: [], dictionary: {}, maxValue: 0 },
    );

    const { colorScale, legend } = getGradientScaleAndLegend({
        colorScheme,
        maxValue,
    });

    return {
        xAxis: xAxis.sort(alphabeticalComparison),
        yAxis: yAxis.sort(alphabeticalComparison),
        dictionary,
        colorScale,
        legend,
    };
};

const mapDispatchToProps = {
    showTooltip: actions.show,
    hideTooltip: actions.hide,
};

export default compose(
    injectData,
    connect(mapStateToProps, mapDispatchToProps),
)(HeatMapView);
