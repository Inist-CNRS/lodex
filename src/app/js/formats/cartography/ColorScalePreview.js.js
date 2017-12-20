import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    previewColor: color => ({
        display: 'block',
        backgroundColor: color,
        height: '1em',
        width: '100%',
        flex: 1,
    }),
    preview: {
        display: 'flex',
        width: '100%',
        padding: '1em',
    },
};

const ColorScalePreview = ({ colorScale }) => (
    <div style={styles.preview}>
        {colorScale.range().map(value => {
            return <div key={value} style={styles.previewColor(value)} />;
        })}
    </div>
);

ColorScalePreview.propTypes = {
    colorScale: PropTypes.object.isRequired,
};

export default ColorScalePreview;
