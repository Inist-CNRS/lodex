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
import { polyglot as polyglotPropTypes } from '../propTypes';
import { SCOPE_DOCUMENT } from '../../../common/scope';

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
};

const mapStateToProps = state => ({
    showAddFromColumn: fromParsing.showAddFromColumn(state),
});

const mapDispatchToProps = {
    hideAddColumns,
};

export const FieldsEdit = compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(FieldsEditComponent);
