import { List } from '@mui/material';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';

import stylesToClassname from '../../lib/stylesToClassName';
import { field as fieldPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import { facetActions as datasetActions } from '../dataset';
import { facetActions as searchActions } from '../search/reducer';
import { fromDisplayConfig, fromI18n } from '../selectors';
import FacetActionsContext from './FacetActionsContext';
import FacetItem from './FacetItem';

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
    // @ts-expect-error TS7031
    className,
    // @ts-expect-error TS7031
    open,
    // @ts-expect-error TS7031
    hasFacetFields,
    // @ts-expect-error TS7031
    fields,
    // @ts-expect-error TS7031
    page,
    // @ts-expect-error TS7031
    changeFacetValue,
    // @ts-expect-error TS7031
    invertFacet,
    // @ts-expect-error TS7031
    openFacet,
    // @ts-expect-error TS7031
    sortFacetValue,
    // @ts-expect-error TS7031
    toggleFacetValue,
    // @ts-expect-error TS7031
    isMultilingual,
    // @ts-expect-error TS7031
    locale,
}) => {
    const actions = {
        changeFacetValue,
        invertFacet,
        openFacet,
        sortFacetValue,
        toggleFacetValue,
    };

    const filteredFieldsByLocale = useMemo(() => {
        // @ts-expect-error TS7006
        return fields.filter((field) => {
            return (
                !isMultilingual || !field.language || field.language === locale
            );
        });
    }, [fields, isMultilingual, locale]);

    if (!hasFacetFields) {
        return null;
    }

    return (
        <List
            // @ts-expect-error TS2339
            className={classnames(className, styles.list, {
                // @ts-expect-error TS2339
                [styles.listOpen]: open,
            })}
        >
            <FacetActionsContext.Provider value={actions}>
                {/*
                 // @ts-expect-error TS7006 */}
                {filteredFieldsByLocale.map((field) => (
                    <FacetItem
                        key={`${page}-${field.name}`}
                        field={field}
                        page={page}
                        // @ts-expect-error TS2339
                        className={classnames(styles.listItem, {
                            // @ts-expect-error TS2339
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
    isMultilingual: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    hasFacetFields: fromFields.hasFacetFields(state),
    // @ts-expect-error TS2339
    fields: fromFields.getFacetFields(state),
    // @ts-expect-error TS2339
    isMultilingual: fromDisplayConfig.isMultilingual(state),
    // @ts-expect-error TS2339
    locale: fromI18n.getLocale(state),
});

const actionsByPage = {
    dataset: datasetActions,
    search: searchActions,
};

// @ts-expect-error TS7006
const mapDispatchToProps = (dispatch, { page }) => ({
    // @ts-expect-error TS7019
    changeFacetValue: (...args) =>
        // @ts-expect-error TS7053
        dispatch(actionsByPage[page].changeFacetValue(...args)),
    // @ts-expect-error TS7019
    invertFacet: (...args) =>
        // @ts-expect-error TS7053
        dispatch(actionsByPage[page].invertFacet(...args)),
    // @ts-expect-error TS7019
    openFacet: (...args) => dispatch(actionsByPage[page].openFacet(...args)),
    // @ts-expect-error TS7019
    sortFacetValue: (...args) =>
        // @ts-expect-error TS7053
        dispatch(actionsByPage[page].sortFacetValue(...args)),
    // @ts-expect-error TS7019
    toggleFacetValue: (...args) =>
        // @ts-expect-error TS7053
        dispatch(actionsByPage[page].toggleFacetValue(...args)),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
    // @ts-expect-error TS2345
)(FacetList);
