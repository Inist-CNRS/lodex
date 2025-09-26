import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import stylesToClassname from '../../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        icon: {
            color: 'var(--primary-main)',
        },
    },
    'searchbar-facets-toggler',
);

// @ts-expect-error TS7031
const ToggleFacetsButton = ({ className, onChange }) => (
    <IconButton className={className} onClick={onChange}>
        {/*
         // @ts-expect-error TS2339 */}
        <FontAwesomeIcon className={styles.icon} icon={faFilter} height={20} />
    </IconButton>
);

ToggleFacetsButton.propTypes = {
    className: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

ToggleFacetsButton.defaultProps = {
    className: 'searchbar-facets-toggler',
};

export default ToggleFacetsButton;
