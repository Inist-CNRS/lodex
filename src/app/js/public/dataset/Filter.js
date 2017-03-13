import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';
import { ToolbarGroup } from 'material-ui/Toolbar';
import ActionSearch from 'material-ui/svg-icons/action/search';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { applyFilter as applyFilterAction } from './';

export const FilterComponent = ({ handleFilterChange, p: polyglot }) => (
    <ToolbarGroup>
        <ActionSearch />
        <TextField
            hintText={polyglot.t('filter')}
            onChange={(_, e) => handleFilterChange(e)}
        />
    </ToolbarGroup>
);

FilterComponent.propTypes = {
    handleFilterChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};


const mapDispatchToProps = ({
    applyFilter: applyFilterAction,
});

export default compose(
    connect(undefined, mapDispatchToProps),
    withHandlers({
        handleFilterChange: ({ applyFilter }) => (match) => {
            applyFilter(match);
        },
    }),
    translate,
)(FilterComponent);
