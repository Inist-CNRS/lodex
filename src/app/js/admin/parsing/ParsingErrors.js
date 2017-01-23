import React, { PropTypes } from 'react';

const ParsingErrors = ({ lines }) => (
    <div>
        {lines.map(l => (
            <div>
                <code>{l}</code>
                <hr />
            </div>
        ))}
    </div>
);

ParsingErrors.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ParsingErrors;
