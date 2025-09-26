// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    // @ts-expect-error TS7006
    previewColor: (color) => ({
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

// @ts-expect-error TS7031
const ColorScalePreview = ({ colorScale }) => (
    <div style={styles.preview}>
        {/*
         // @ts-expect-error TS7006 */}
        {colorScale.range().map((value) => (
            <div key={value} style={styles.previewColor(value)} />
        ))}
    </div>
);

ColorScalePreview.propTypes = {
    colorScale: PropTypes.func.isRequired,
};

export default ColorScalePreview;
