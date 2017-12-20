import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    legendColor: color => ({
        display: 'block',
        backgroundColor: color,
        height: '2em',
        width: '100%',
    }),
    legend: {
        display: 'flex',
        width: '100%',
        margin: '20px',
    },
    legendItem: {
        flex: 1,
    },
    last: {
        height: '2em',
    },
};

const ColorScaleLegend = ({ colorScale }) => (
    <div style={styles.legend}>
        {colorScale.range().map(value => {
            const [start, end] = colorScale.invertExtent(value);
            return (
                <div key={value} style={styles.legendItem}>
                    <div
                        style={styles.legendColor(value)}
                        title={`${Math.round(start)} to ${Math.round(end)}`}
                    />
                    <div>{Math.round(start)}</div>
                </div>
            );
        })}
        <div style={styles.legendItem}>
            <div style={styles.last} />
            <div>{colorScale.domain()[1]}</div>
        </div>
    </div>
);

ColorScaleLegend.propTypes = {
    colorScale: PropTypes.func.isRequired,
};

export default ColorScaleLegend;
