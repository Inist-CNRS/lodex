import React, { useEffect, useState } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import { connect } from 'react-redux';

import AddFromColumnDialog from './AddFromColumnDialog';
import PublicationPreview from '../preview/publication/PublicationPreview';
import Statistics from '../Statistics';
import { fromParsing } from '../selectors';
import { FieldGrid } from './FieldGrid';
import { hideAddColumns } from '../parsing';
import { SCOPE_DATASET, SCOPE_DOCUMENT } from '@lodex/common';
import DatasetOverviewSelect from './DatasetOverviewSelect';
import SubresourceOverviewSelect from './SubresourceOverviewSelect';
import FieldAddDropdownButtonConnected from './FieldAddDropdownButton';
import { AddFieldButton } from './AddFieldButton';
import { DeleteFieldsButton } from './DeleteFieldsButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface FieldsEditComponentProps {
    addFieldButton?: React.ReactElement;
    defaultTab?: 'page' | 'published';
    filter?: string;
    hideAddColumns(...args: unknown[]): unknown;
    showAddFromColumn: boolean;
    subresourceId?: string;
}

export const FieldsEditComponent = ({
    defaultTab = 'page',

    filter,

    hideAddColumns,

    showAddFromColumn,

    subresourceId,
}: FieldsEditComponentProps) => {
    const { translate } = useTranslate();
    const [tab, setTab] = useState(defaultTab);
    const [showAddFromColumnDialog, setAddFromColumnDialog] = useState(false);
    const [selectedFields, setSelectedFields] = useState([]);

    useEffect(() => {
        if (showAddFromColumn) {
            setAddFromColumnDialog(true);
        }
    }, [showAddFromColumn]);

    // @ts-expect-error TS7006
    const handleChangeTab = (_, newValue) => setTab(newValue);
    const handleCloseAddFromColumnDialog = () => {
        hideAddColumns();
        setAddFromColumnDialog(false);
    };

    // @ts-expect-error TS7006
    const handleToggleSelectedField = (fieldName) => {
        // @ts-expect-error TS2345
        setSelectedFields((prev) =>
            // @ts-expect-error TS2345
            prev.includes(fieldName)
                ? prev.filter((item) => item !== fieldName)
                : [...prev, fieldName],
        );
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
                        label={translate('published_data')}
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
                                // @ts-expect-error TS2322
                                subresourceId={subresourceId}
                            />
                        )}

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <DeleteFieldsButton
                                // @ts-expect-error TS2322
                                selectedFields={selectedFields}
                                filter={filter}
                                subresourceId={subresourceId}
                            />

                            {filter === SCOPE_DOCUMENT && (
                                <FieldAddDropdownButtonConnected
                                    subresourceId={subresourceId}
                                />
                            )}

                            {filter !== SCOPE_DOCUMENT && !subresourceId && (
                                <AddFieldButton />
                            )}

                            {showAddFromColumnDialog && (
                                <AddFromColumnDialog
                                    onClose={handleCloseAddFromColumnDialog}
                                />
                            )}
                        </Box>
                    </Box>
                    <FieldGrid
                        filter={filter}
                        subresourceId={subresourceId}
                        selectedFields={selectedFields}
                        toggleSelectedField={handleToggleSelectedField}
                    />
                    <Statistics filter={filter} subresourceId={subresourceId} />
                </Box>
            )}
            {tab === 'published' && (
                <>
                    <PublicationPreview
                        // @ts-expect-error TS2322
                        filter={filter}
                        subresourceId={subresourceId}
                    />
                    <Statistics filter={filter} subresourceId={subresourceId} />
                </>
            )}
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    showAddFromColumn: fromParsing.showAddFromColumn(state),
});

const mapDispatchToProps = {
    hideAddColumns,
};

export const FieldsEdit = connect(
    mapStateToProps,
    mapDispatchToProps,
)(FieldsEditComponent);
