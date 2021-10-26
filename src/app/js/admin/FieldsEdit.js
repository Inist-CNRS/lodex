import React, { useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PublicationPreview from './preview/publication/PublicationPreview';
import Statistics from './Statistics';
import { fromParsing } from './selectors';
import ParsingResult from './parsing/ParsingResult';
import { buildFieldsDefinitionsArray, FieldGrid } from '../fields/FieldGrid';
import { SCOPE_DOCUMENT } from '../../../common/scope';
import { fromFields } from '../sharedSelectors';
import { URI_FIELD_NAME } from '../../../common/uris';
import AddFieldFromColumnButton from './Appbar/AddFieldFromColumnButton';

const useStyles = makeStyles({
    actionsContainer: {
        textAlign: 'right',
        padding: '20px 0 30px 0',
    },
});

export const FieldsEditComponent = ({
    filter,
    fields,
    showAddColumns,
    addFieldButton,
    subresourceId,
    defaultTab = 'page',
}) => {
    const classes = useStyles();
    const [tab, setTab] = useState(defaultTab);

    const handleChangeTab = (_, newValue) => setTab(newValue);

    return (
        <div>
            <Tabs
                value={tab}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                style={{ paddingBottom: 20 }}
            >
                <Tab value="page" label="Page" />
                <Tab value="published" label="Données publiées" />
            </Tabs>
            {tab === 'page' && (
                <>
                    <div className={classes.actionsContainer}>
                        {filter === SCOPE_DOCUMENT && !subresourceId && (
                            <AddFieldFromColumnButton />
                        )}
                        {addFieldButton}
                    </div>
                    <div
                        style={{
                            display: showAddColumns ? 'block' : 'none',
                            paddingBottom: 20,
                        }}
                    >
                        <ParsingResult showAddColumns maxLines={3} />
                    </div>
                    <Statistics
                        mode="display"
                        filter={filter}
                        fields={fields}
                    />
                    <FieldGrid
                        key={JSON.stringify(
                            buildFieldsDefinitionsArray(fields),
                        )}
                        filter={filter}
                        fields={fields}
                        isSubresource={!!subresourceId}
                        addFieldButton={addFieldButton}
                    />
                </>
            )}
            {tab === 'published' && (
                <>
                    <PublicationPreview
                        readonly
                        filter={filter}
                        fields={fields}
                    />
                    <Statistics
                        mode="display"
                        filter={filter}
                        fields={fields}
                    />
                </>
            )}
        </div>
    );
};

FieldsEditComponent.propTypes = {
    showAddColumns: PropTypes.bool.isRequired,
    filter: PropTypes.string,
    fields: PropTypes.array,
    subresourceId: PropTypes.string,
    defaultTab: PropTypes.oneOf(['page', 'published']),
    addFieldButton: PropTypes.element,
};

export const FieldsEdit = compose(
    connect((state, { subresourceId, filter }) => ({
        showAddColumns: fromParsing.showAddColumns(state),
        fields: (!subresourceId
            ? fromFields.getFromFilterFields(state, filter)
            : fromFields
                  .getSubresourceFields(state, subresourceId)
                  .filter(field => {
                      // Remove subresource field uri from editable columns
                      return !field.name.endsWith('_uri');
                  })
        ).filter(field => field.name !== URI_FIELD_NAME),
    })),
)(FieldsEditComponent);
