import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import injectData from '../injectData';
import { mapSourceToX, mapTargetToX } from './parseChartData';
import getGradientScaleAndLegend from '../../lib/components/getGradientScaleAndLegend';
import exportableToPng from '../exportableToPng';

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
    tooltip: {
        textAlign: 'center',
    },
});

const getColorStyle = color => ({
    backgroundColor: color,
});

export class HeatMapView extends Component {
    render() {
        const { xAxis, yAxis, dictionary, colorScale, legend } = this.props;

        return (
            <div>
                <table className={css(styles.table)}>
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
                                        data-tip={`${xKey},${yKey},${dictionary[
                                            xKey
                                        ][yKey] || 0}`}
                                        data-for="heatmap"
                                        style={getColorStyle(
                                            colorScale(dictionary[xKey][yKey]),
                                        )}
                                    />
                                ))}
                                <ReactTooltip
                                    id="heatmap"
                                    getContent={data => {
                                        if (!data) {
                                            return null;
                                        }
                                        const [
                                            source,
                                            target,
                                            value,
                                        ] = data.split(',');
                                        return (
                                            <span
                                                className={css(styles.tooltip)}
                                            >
                                                <p>{source}</p>
                                                <p>{target}</p>
                                                <p>{value}</p>
                                            </span>
                                        );
                                    }}
                                    place="top"
                                    type="light"
                                    effect="float"
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>
                {legend}
            </div>
        );
    }
}

HeatMapView.propTypes = {
    xAxis: PropTypes.arrayOf(PropTypes.string).isRequired,
    yAxis: PropTypes.arrayOf(PropTypes.string).isRequired,
    dictionary: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number))
        .isRequired,
    legend: PropTypes.element,
    colorScale: PropTypes.func,
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

const mapStateToProps = (state, { formatData, colorScheme, flipAxis }) => {
    if (!formatData) {
        return {
            xAxis: [],
            yAxis: [],
            dictionary: {},
            colorScheme,
        };
    }

    const { xAxis, yAxis, dictionary, maxValue } = formatData.reduce(
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

const mapDispatchToProps = {};

export default compose(
    injectData(),
    connect(mapStateToProps, mapDispatchToProps),
    exportableToPng,
)(HeatMapView);
