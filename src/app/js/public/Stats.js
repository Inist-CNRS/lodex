import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import { polyglot as polyglotPropTypes } from '../propTypes';

const styles = {
    nb: {
        fontWeight: 'bold',
        height: '36px',
        lineHeight: '36px',
    },
};

export const StatsComponent = ({
    nbResources,
    currentNbResources,
    p: polyglot,
}) => (
    <div className="stats" style={styles.nb}>
        {polyglot.t('resources_found', {
            current: currentNbResources,
            total: nbResources,
        })}
    </div>
);

StatsComponent.propTypes = {
    nbResources: PropTypes.number.isRequired,
    currentNbResources: PropTypes.number.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(StatsComponent);
