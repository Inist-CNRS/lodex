import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';
import MenuItem from './MenuItem';

const AdvancedPage = ({
    advancedMenu,
    role,
    polyglot,
    hasGraph,
    canBeSearched,
    closeDrawer,
}) => (
    <div>
        {advancedMenu.map((config, index) => (
            <MenuItem
                key={index}
                config={config}
                role={role}
                canBeSearched={canBeSearched}
                hasGraph={hasGraph}
                onClick={closeDrawer}
                polyglot={polyglot}
            />
        ))}
    </div>
);

AdvancedPage.propTypes = {
    advancedMenu: PropTypes.arrayOf(fieldPropTypes).isRequired,
    role: PropTypes.oneOf(['admin', 'user', 'not logged']).isRequired,
    polyglot: PropTypes.isRequired,
    hasGraph: PropTypes.bool.isRequired,
    canBeSearched: PropTypes.bool.isRequired,
    closeDrawer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    graphFields: fromFields.getGraphFields(state),
});

export default connect(mapStateToProps)(AdvancedPage);
