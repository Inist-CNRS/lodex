import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import theme from '../../../theme';
import stylesToClassname from '../../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        icon: {
            color: theme.green.primary,
        },
    },
    'searchbar-facets-toggler',
);

const ToggleFacetsButton = ({ className, onChange }) => (
    <IconButton className={className} onClick={onChange}>
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
