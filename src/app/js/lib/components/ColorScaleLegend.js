import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    legendColor: color => ({
        display: 'block',
        backgroundColor: color,
        height: '1em',
        width: '100%',
    }),
    legend: {
        display: 'flex',
        width: '50%',
        padding: '20px',
    },
    legendItem: {
        flex: 1,
    },
    last: {
        height: '1em',
    },
};

const ColorScaleLegend = ({ colorScale, nullColor }) => (
    <div style={styles.legend}>
        {nullColor && (
            <div style={styles.legendItem}>
                <div style={styles.legendColor(nullColor)} title={0} />
                <div>{0}</div>
            </div>
        )}
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
    nullColor: PropTypes.string,
};

export default ColorScaleLegend;
