import React, { useEffect, useState } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
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
import { SCOPE_DATASET, SCOPE_DOCUMENT } from '../../../common/scope';
import DatasetOverviewSelect from '../fields/DatasetOverviewSelect';
import SubresourceOverviewSelect from '../fields/SubresourceOverviewSelect';

export const FieldsEditComponent = ({
    addFieldButton,
    defaultTab = 'page',
    filter,
    hideAddColumns,
    p: polyglot,
    showAddFromColumn,
    subresourceId,
}) => {
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
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    marginBottom: 4,
                }}
            >
                <Tabs
                    value={tab}
                    onChange={handleChangeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    sx={{
                        '& button:hover': {
                            color: 'primary.main',
                        },
                    }}
                >
                    <Tab value="page" label="Page" />
                    <Tab
                        value="published"
                        label={polyglot.t('published_data')}
                    />
                </Tabs>
            </Box>

            {tab === 'page' && (
                <Box mb={2}>
                    <Box
                        mb={4}
                        display="flex"
                        justifyContent={
                            filter === SCOPE_DATASET ||
                            (filter === SCOPE_DOCUMENT && subresourceId)
                                ? 'space-between'
                                : 'flex-end'
                        }
                        alignItems="center"
                    >
                        {filter === SCOPE_DATASET && <DatasetOverviewSelect />}
                        {filter === SCOPE_DOCUMENT && subresourceId && (
                            <SubresourceOverviewSelect
                                subresourceId={subresourceId}
                            />
                        )}
                        {filter === SCOPE_DOCUMENT && !subresourceId && (
                            <AddFieldFromColumnButton />
                        )}
                        {addFieldButton}
                        {showAddFromColumnDialog && (
                            <AddFromColumnDialog
                                onClose={handleCloseAddFromColumnDialog}
                            />
                        )}
                    </Box>
                    <FieldGrid filter={filter} subresourceId={subresourceId} />
                    <Statistics filter={filter} subresourceId={subresourceId} />
                </Box>
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
