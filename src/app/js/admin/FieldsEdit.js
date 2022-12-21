import React, { useEffect, useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import AddFieldFromColumnButton from './Appbar/AddFieldFromColumnButton';
import AddFromColumnDialog from './AddFromColumnDialog';
import PublicationPreview from './preview/publication/PublicationPreview';
import Statistics from './Statistics';
import translate from 'redux-polyglot/translate';
import { fromParsing } from './selectors';
import { FieldGrid } from '../fields/FieldGrid';
import { hideAddColumns } from './parsing';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';
import { SCOPE_DOCUMENT } from '../../../common/scope';
import { fromFields } from '../sharedSelectors';
import PublicationModalWizard from '../fields/wizard';
import { editField } from '../fields';

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
    addFieldButton,
    defaultTab = 'page',
    filter,
    hideAddColumns,
    p: polyglot,
    showAddFromColumn,
    subresourceId,
    field,
}) => {
    const classes = useStyles();
    const [tab, setTab] = useState(defaultTab);
    const [showAddFromColumnDialog, setAddFromColumnDialog] = useState(false);

    useEffect(() => {
        if (showAddFromColumn) {
            setAddFromColumnDialog(true);
        }
    }, [showAddFromColumn]);

    const handleChangeTab = (_, newValue) => setTab(newValue);
    const handleCloseAddFromColumnDialog = () => {
        hideAddColumns();
        setAddFromColumnDialog(false);
    };

    const handleExitEdition = e => {
        e.preventDefault();
        e.stopPropagation();
        editField(null);
    };

    if (field) {
        return (
            <PublicationModalWizard
                filter={filter}
                onExitEdition={handleExitEdition}
            />
        );
    }

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
                    <Tab
                        value="published"
                        label={polyglot.t('published_data')}
                    />
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
                    {showAddFromColumnDialog && (
                        <AddFromColumnDialog
                            onClose={handleCloseAddFromColumnDialog}
                        />
                    )}
                    <Statistics filter={filter} subresourceId={subresourceId} />
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
                    <Statistics filter={filter} subresourceId={subresourceId} />
                </>
            )}
        </div>
    );
};

FieldsEditComponent.propTypes = {
    addFieldButton: PropTypes.element,
    defaultTab: PropTypes.oneOf(['page', 'published']),
    filter: PropTypes.string,
    hideAddColumns: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showAddFromColumn: PropTypes.bool.isRequired,
    subresourceId: PropTypes.string,
    field: fieldPropTypes,
};

const mapStateToProps = state => ({
    field: fromFields.getEditedField(state),
    showAddFromColumn: fromParsing.showAddFromColumn(state),
});

const mapDispatchToProps = {
    hideAddColumns,
    editField,
};

export const FieldsEdit = compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(FieldsEditComponent);
