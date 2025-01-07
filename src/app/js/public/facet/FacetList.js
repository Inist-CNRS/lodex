import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { List } from '@mui/material';

import { field as fieldPropTypes } from '../../propTypes';
import stylesToClassname from '../../lib/stylesToClassName';
import { facetActions as datasetActions } from '../dataset';
import { facetActions as searchActions } from '../search/reducer';
import FacetActionsContext from './FacetActionsContext';
import { fromFields } from '../../sharedSelectors';
import FacetItem from './FacetItem';
import { fromDisplayConfig, fromI18n } from '../selectors';

const styles = stylesToClassname(
    {
        list: {
            opacity: '0',
            maxHeight: '0px',
            height: '0px',
            padding: '0px !important',
            transition: 'max-height 300ms ease-in-out, opacity 600ms ease',
            overflowY: 'auto',
            '@media (min-width: 992px)': {
                opacity: '1',
                height: '100%',
                maxHeight: '70vh',
                minWidth: '300px',
                flex: 1,
            },
        },
        listOpen: {
            opacity: '1',
            height: '100%',
            maxHeight: '10000px',
        },
        listItem: {
            height: '0px',
            '@media (min-width: 992px)': {
                height: '100%',
            },
        },
        listItemOpen: {
            height: '100%',
        },
    },
    'facets',
);

const FacetList = ({
    className,
    open,
    hasFacetFields,
    fields,
    page,
    changeFacetValue,
    invertFacet,
    openFacet,
    sortFacetValue,
    toggleFacetValue,
    isMultilingual,
    locale,
}) => {
    if (!hasFacetFields) {
        return null;
    }

    const actions = {
        changeFacetValue,
        invertFacet,
        openFacet,
        sortFacetValue,
        toggleFacetValue,
    };

    const filteredFieldsByLocale = useMemo(() => {
        return fields.filter((field) => {
            return (
                !isMultilingual || !field.language || field.language === locale
            );
        });
    }, [locale, fields]);

    return (
        <List
            className={classnames(className, styles.list, {
                [styles.listOpen]: open,
            })}
        >
            <FacetActionsContext.Provider value={actions}>
                {filteredFieldsByLocale.map((field) => (
                    <FacetItem
                        key={`${page}-${field.name}`}
                        field={field}
                        page={page}
                        className={classnames(styles.listItem, {
                            [styles.listItemOpen]: open,
                        })}
                    />
                ))}
            </FacetActionsContext.Provider>
        </List>
    );
};

FacetList.propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    hasFacetFields: PropTypes.bool.isRequired,
    page: PropTypes.oneOf(['dataset', 'search']).isRequired,
    changeFacetValue: PropTypes.func.isRequired,
    invertFacet: PropTypes.func.isRequired,
    openFacet: PropTypes.func.isRequired,
    sortFacetValue: PropTypes.func.isRequired,
    toggleFacetValue: PropTypes.func.isRequired,
    isMultilingual: PropTypes.bool,
    locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
    hasFacetFields: fromFields.hasFacetFields(state),
    fields: fromFields.getFacetFields(state),
    isMultilingual: fromDisplayConfig.isMultilingual(state),
    locale: fromI18n.getLocale(state),
});

const actionsByPage = {
    dataset: datasetActions,
    search: searchActions,
};

const mapDispatchToProps = (dispatch, { page }) => ({
    changeFacetValue: (...args) =>
        dispatch(actionsByPage[page].changeFacetValue(...args)),
    invertFacet: (...args) =>
        dispatch(actionsByPage[page].invertFacet(...args)),
    openFacet: (...args) => dispatch(actionsByPage[page].openFacet(...args)),
    sortFacetValue: (...args) =>
        dispatch(actionsByPage[page].sortFacetValue(...args)),
    toggleFacetValue: (...args) =>
        dispatch(actionsByPage[page].toggleFacetValue(...args)),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(FacetList);
