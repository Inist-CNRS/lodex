import React from 'react';
import get from 'lodash.get';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';

import injectData from '../injectData';

const firstCell = {
    height: '100px',
    width: '50px',
    minWidth: '50px',
    maxWidth: '50px',
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
    },
    th: {
        ':first-child': firstCell,
        fontSize: '11px',
        textAlign: 'left',
        textTransform: 'uppercase',
        display: 'block',
        height: '30px',
    },
    rotate: {
        position: 'relative',
        top: '0px',
        left:
            '50px' /* 100 * tan(45) / 2 = 50 where 100 is the height on the cell and 45 is the transform angle*/,
        height: '100%',
        transform: 'skew(-45deg,0deg)',
        // overflow: 'hidden',
    },
    rotateSpan: {
        transform: 'skew(45deg,0deg) rotate(315deg)',
        position: 'absolute',
        bottom: '30px' /* 40 cos(45) = 28 with an additional 2px margin*/,
        left: '-25px',
        display: 'inline-block',
        width:
            '85px' /* 80 / cos(45) - 40 cos (45) = 85 where 80 is the height of the cell, 40 the width of the cell and 45 the transform angle*/,
        textAlign: 'left',
        whiteSpace: 'normal',
    },
});

const HeatMapView = ({ chartData }) => {
    const { xAxis, yAxis, dictionary } = chartData.reduce(
        (acc, { source, target, weight }) => ({
            xAxis:
                acc.xAxis.indexOf(target) === -1
                    ? acc.xAxis.concat(target)
                    : acc.xAxis,
            yAxis:
                acc.yAxis.indexOf(source) === -1
                    ? acc.yAxis.concat(source)
                    : acc.yAxis,
            dictionary: {
                ...acc.dictionary,
                [target]: {
                    ...get(acc, ['dictionary', target], {}),
                    [source]: weight,
                },
            },
        }),
        { xAxis: [], yAxis: [] },
    );

    return (
        <div>
            <table className={css(styles.table)}>
                <thead className={css(styles.thead)}>
                    <tr className={css(styles.tr)}>
                        <th className={css(styles.th)} />
                        {xAxis.map(xKey => (
                            <th className={css(styles.th)} key={xKey}>
                                {xKey}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={css(styles.tbody)}>
                    {yAxis.map(yKey => (
                        <tr key={yKey} className={css(styles.tr)}>
                            <td className={css(styles.td)}>
                                <div className={css(styles.rotate)}>
                                    <span className={css(styles.rotateSpan)}>
                                        {yKey}
                                    </span>
                                </div>
                            </td>
                            {xAxis.map(xKey => (
                                <td className={css(styles.td)} key={xKey}>
                                    {dictionary[xKey][yKey] || 0}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

HeatMapView.propTypes = {
    chartData: PropTypes.array.isRequired,
};

export default injectData(HeatMapView);
