import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import injectData from '../injectData';
import { mapSourceToX, mapTargetToX } from './parseChartData';
import getGradientScaleAndLegend from '../../lib/components/getGradientScaleAndLegend';
import stylesToClassname from '../../lib/stylesToClassName';

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

const styles = stylesToClassname(
    {
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
    },
    'heat-map',
);

const getColorStyle = color => ({
    backgroundColor: color,
});

const getTooltip = (xKey, yKey, dictionary) =>
    `${xKey},${yKey},${dictionary[xKey][yKey] || 0}`;

export const HeatMapView = ({
    xAxis,
    yAxis,
    dictionary,
    colorScale,
    legend,
}) => (
    <div>
        <table className={styles.table}>
            <thead className={styles.thead}>
                <tr className={styles.tr}>
                    <th className={styles.th} />
                    {yAxis.map(yKey => (
                        <th className={styles.th} key={yKey}>
                            {yKey}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className={styles.tbody}>
                {xAxis.map(xKey => (
                    <tr key={xKey} className={styles.tr}>
                        <td className={styles.td}>
                            <div className={styles.rotate}>
                                <span className={styles.rotateSpan}>
                                    {xKey}
                                </span>
                            </div>
                        </td>
                        {yAxis.map(yKey => (
                            <td
                                className={styles.td}
                                key={`${xKey}-${yKey}`}
                                data-tip={getTooltip(xKey, yKey, dictionary)}
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
                                const [source, target, value] = data.split(',');
                                return (
                                    <span className={styles.tooltip}>
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

export default compose(
    injectData(),
    connect(mapStateToProps),
)(HeatMapView);
