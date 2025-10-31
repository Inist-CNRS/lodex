import { List } from '@mui/material';
import classnames from 'classnames';
import { useMemo } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';

import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import { fromFields } from '@lodex/frontend-common/sharedSelectors';
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
                height: 'auto',
            },
        },
        listItemOpen: {
            height: '100%',
        },
    },
    'facets',
);

type FacetListProps = {
    className?: string;
    open?: boolean;
    fields: { name: string; language: string }[];
    hasFacetFields: boolean;
    page: 'dataset' | 'search';
    changeFacetValue(): void;
    invertFacet(): void;
    openFacet(): void;
    sortFacetValue(): void;
    toggleFacetValue(): void;
    isMultilingual: boolean;
    locale: string;
};

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
}: FacetListProps) => {
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

// @ts-expect-error TS7006
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
