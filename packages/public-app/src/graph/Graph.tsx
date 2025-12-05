import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CardHeader, IconButton, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import classnames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { preLoadPublication } from '@lodex/frontend-common/fields/reducer';
import type { Field } from '@lodex/frontend-common/fields/types';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import {
    fromCharacteristic,
    fromFields,
    fromUser,
} from '@lodex/frontend-common/sharedSelectors';
import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import { Settings } from '@mui/icons-material';
import { CreateAnnotationButton } from '../annotation/CreateAnnotationButton';
import { preLoadDatasetPage as preLoadDatasetPageAction } from '../dataset';
import AppliedFacetList from '../dataset/AppliedDatasetFacetList';
import DatasetSearchBar from '../dataset/DatasetSearchBar';
import DatasetStats from '../dataset/DatasetStats';
import Drawer, { DRAWER_CLOSED, DRAWER_CLOSING, DRAWER_OPEN } from '../Drawer';
import FacetList from '../facet/FacetList';
import Format from '../Format';
import { getEditFieldRedirectUrl } from '../Property';
import CompositeProperty from '../Property/CompositeProperty';
import PropertyLinkedFields from '../Property/PropertyLinkedFields';
import BrowseResult from './BrowseResult';
import { GraphContextProvider } from './GraphContext';

const styles = stylesToClassname(
    {
        container: {
            marginBottom: '30px',
            width: '100%',
        },
        header: {
            gridColumn: 'span 2',
            position: 'sticky',
            top: '0',
            paddingTop: '30px!important',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--background-default)',
            zIndex: 1001,
        },
        advanced: {
            display: 'flex',
            flex: '0 0 auto',
            flexDirection: 'column',
            maxWidth: '400px',
            justifyContent: 'center',
        },
        content: {
            width: '100%',
            '@media (min-width: 992px)': {
                display: 'grid',
                gridTemplateColumns: '1fr 3fr',
            },
        },
        results: {
            '@media (min-width: 992px)': {
                minWidth: '600px',
                maxWidth: '100%',
                flex: 3,
                padding: '0rem calc(1rem + 12px)',
            },
        },
        facets: {
            backgroundColor: 'var(--background-default)',
            position: 'sticky',
            top: '8rem',
            zIndex: 1,
        },
    },
    'graph',
);

const muiStyles = {
    graphContainer: {
        marginBottom: '20px',
    },
    graphTitle: {
        display: 'flex',
        alignItems: 'center',
        color: grey[500],
        fontWeight: 'bold',
        fontSize: '1.25rem',
    },
};

interface GraphProps {
    className?: string;
    name: string;
    graphField?: Field;
    resource: Record<string, unknown>;
    preLoadPublication(...args: unknown[]): unknown;
    preLoadDatasetPage(...args: unknown[]): unknown;
    isAdmin?: boolean;
}

const Graph = ({
    className,
    name,
    graphField,
    resource,
    preLoadPublication,
    preLoadDatasetPage,
    isAdmin,
}: GraphProps) => {
    const { translate } = useTranslate();
    const [showFacets, setShowFacets] = useState(false);
    const [browseResultDrawerStatus, setBrowseResultDrawerStatus] =
        useState(DRAWER_CLOSED);

    useEffect(() => {
        preLoadPublication();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array for componentDidMount behavior

    useEffect(() => {
        preLoadDatasetPage();
        setBrowseResultDrawerStatus(DRAWER_CLOSED);
    }, [name, preLoadDatasetPage]); // Run when name changes

    const handleToggleFacets = () => {
        setShowFacets(!showFacets);
    };

    // @ts-expect-error TS7006
    const handleEditField = (field) => {
        const redirectUrl = getEditFieldRedirectUrl(
            field.name,
            field.scope,
            field.subresourceId,
        );
        window.open(redirectUrl, '_blank');
    };

    const graphActionRef = useRef<HTMLDivElement | null>(null);

    return (
        <GraphContextProvider
            portalContainer={graphActionRef}
            field={graphField}
        >
            {/* // 
            @ts-expect-error TS2339 */}
            <div className={classnames(className, styles.container)}>
                {/*
             // @ts-expect-error TS2339 */}
                <div className={styles.content}>
                    {/*
             // @ts-expect-error TS2339 */}
                    <div className={styles.header}>
                        <DatasetSearchBar
                            // @ts-expect-error TS2339
                            onToggleFacets={handleToggleFacets}
                        />
                        {/* 
                    // @ts-expect-error TS2339 */}
                        <div className={classnames(styles.advanced)}>
                            <DatasetStats />
                        </div>
                        <AppliedFacetList />
                    </div>
                    <FacetList
                        // @ts-expect-error TS2339
                        className={classnames('graph-facets', styles.facets)}
                        page="dataset"
                        open={showFacets}
                    />
                    {/*
                 // @ts-expect-error TS2339 */}
                    <div className={styles.results}>
                        {graphField && (
                            <Card
                                className="graph"
                                sx={muiStyles.graphContainer}
                            >
                                <CardHeader
                                    className="title"
                                    sx={muiStyles.graphTitle}
                                    title={
                                        <Stack direction="row" gap="2rem">
                                            <Stack
                                                direction="row"
                                                gap="0.5rem"
                                                alignItems="center"
                                            >
                                                {graphField.label}

                                                {isAdmin && (
                                                    // @ts-expect-error TS2769
                                                    <IconButton
                                                        onClick={() =>
                                                            handleEditField(
                                                                graphField,
                                                            )
                                                        }
                                                        classnames={
                                                            'edit-field-icon'
                                                        }
                                                    >
                                                        <Settings
                                                            sx={{
                                                                fontSize:
                                                                    '1.2rem',
                                                            }}
                                                        />
                                                    </IconButton>
                                                )}
                                                <CreateAnnotationButton
                                                    field={graphField}
                                                    resource={resource}
                                                />
                                            </Stack>
                                            <Stack
                                                flex="1"
                                                direction="row"
                                                gap="0.5rem"
                                                justifyContent="flex-end"
                                                ref={graphActionRef}
                                            />
                                        </Stack>
                                    }
                                />
                                <Format
                                    field={graphField}
                                    resource={resource}
                                />
                                <CompositeProperty
                                    key="composite"
                                    field={graphField}
                                    resource={resource}
                                    parents={[]}
                                />
                                <PropertyLinkedFields
                                    fieldName={graphField.name}
                                    // @ts-expect-error TS2322
                                    resource={resource}
                                    parents={[]}
                                />
                            </Card>
                        )}
                        <Button
                            variant="contained"
                            className="browse-result"
                            onClick={() =>
                                setBrowseResultDrawerStatus(DRAWER_OPEN)
                            }
                            color="primary"
                            fullWidth
                            startIcon={
                                <FontAwesomeIcon icon={faSearch} height={20} />
                            }
                        >
                            {translate('browse_results')}
                        </Button>
                    </div>
                </div>
            </div>

            <Drawer
                status={browseResultDrawerStatus}
                onClose={() => setBrowseResultDrawerStatus(DRAWER_CLOSING)}
            >
                <BrowseResult
                    className="browse-result-drawer"
                    closeDrawer={() =>
                        setBrowseResultDrawerStatus(DRAWER_CLOSING)
                    }
                />
            </Drawer>
        </GraphContextProvider>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { name }) => ({
    name,
    graphField: name && fromFields.getFieldByName(state, name),
    hasFacetFields: fromFields.hasFacetFields(state),
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
    isAdmin: fromUser.isAdmin(state),
});

const mapDispatchToProps = {
    preLoadPublication,
    preLoadDatasetPage: preLoadDatasetPageAction,
};

export default compose<
    GraphProps,
    Omit<
        GraphProps,
        | 'graphField'
        | 'hasFacetFields'
        | 'resource'
        | 'isAdmin'
        | 'preLoadPublication'
        | 'preLoadDatasetPage'
    >
>(connect(mapStateToProps, mapDispatchToProps))(Graph);
