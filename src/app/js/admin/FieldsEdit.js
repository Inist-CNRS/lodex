import React, { useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PublicationPreview from './preview/publication/PublicationPreview';
import Statistics from './Statistics';
import { fromParsing } from './selectors';
import ParsingResult from './parsing/ParsingResult';
import { FieldGrid } from '../fields/FieldGrid';
import { SCOPE_DOCUMENT } from '../../../common/scope';
import AddFieldFromColumnButton from './Appbar/AddFieldFromColumnButton';

const useStyles = makeStyles({
    actionsContainer: {
        textAlign: 'right',
        padding: '20px 0 30px 0',
    },
    editHeaderContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export const FieldsEditComponent = ({
    filter,
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
            <div className={classes.editHeaderContainer}>
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
                    <div className={classes.actionsContainer}>
                        {filter === SCOPE_DOCUMENT && !subresourceId && (
                            <AddFieldFromColumnButton />
                        )}
                        {addFieldButton}
                    </div>
                )}
            </div>
            {tab === 'page' && (
                <>
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
                        subresourceId={subresourceId}
                    />
                    <FieldGrid filter={filter} subresourceId={subresourceId} />
                </>
            )}
            {tab === 'published' && (
                <>
                    <PublicationPreview
                        readonly
                        filter={filter}
                        subresourceId={subresourceId}
                    />
                    <Statistics
                        mode="display"
                        filter={filter}
                        subresourceId={subresourceId}
                    />
                </>
            )}
        </div>
    );
};

FieldsEditComponent.propTypes = {
    showAddColumns: PropTypes.bool.isRequired,
    filter: PropTypes.string,
    subresourceId: PropTypes.string,
    defaultTab: PropTypes.oneOf(['page', 'published']),
    addFieldButton: PropTypes.element,
};

export const FieldsEdit = compose(
    connect(state => ({
        showAddColumns: fromParsing.showAddColumns(state),
    })),
)(FieldsEditComponent);
