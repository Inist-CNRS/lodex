import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Chip } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        margin: '10px 0',
        display: 'flex',
        flexFlow: 'row wrap',
        width: '100%',
    },
    chip: {
        margin: '5px',
    },
};

export const AppliedFacetListComponent = ({
    facets,
    clearAll,
    children,
    p: polyglot,
}) => (
    <div className="applied-facet-container">
        {facets.length ? (
            <div style={styles.container}>
                {facets.map(({ name, value }) =>
                    Children.map(children, (child, i) => {
                        if (i > 0) {
                            return;
                        }
                        return cloneElement(child, {
                            key: `${name}-${value}`,
                            name: name,
                            value: value,
                        });
                    }),
                )}
                {facets.length && (
                    <Chip
                        style={styles.chip}
                        onClick={clearAll}
                        label={polyglot.t('clear_all')}
                    />
                )}
            </div>
        ) : null}
    </div>
);

AppliedFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(PropTypes.any).isRequired,
    clearAll: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(AppliedFacetListComponent);
