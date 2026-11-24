import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import ParsingResult from '../parsing/ParsingResult';
import { fromParsing, fromPublication, fromUpload } from '../selectors';
import { UploadPage } from '../upload/UploadPage';
import { preLoadLoaders } from '../loader';
import withInitialData from '../withInitialData';
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useContext, useMemo } from 'react';
import {
    Redirect,
    Route,
    Switch,
    useHistory,
    useLocation,
    useRouteMatch,
} from 'react-router';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { PreComputationSelector } from './PreComputationSelector';
import { useFetchPrecomputations } from './useFetchPrecomputations';
import { SiteWizardContext } from '../siteWizard/SiteWizardContext';
import { ImportInProgress } from './ImportInProgress';

interface DataRouteComponentProps {
    canUploadFile: boolean;
    isUploading: boolean;
    hasPublishedDataset: boolean;
}

export const DataRouteComponent = ({
    canUploadFile,
    isUploading,
}: DataRouteComponentProps) => {
    const { translate } = useTranslate();
    const { pathname, search } = useLocation();

    const { openWizard } = useContext(SiteWizardContext);

    const { path } = useRouteMatch();
    const history = useHistory();

    const selectedPrecomputation = useMemo(() => {
        const params = new URLSearchParams(search);
        return params.get('precomputation');
    }, [search]);

    // Choosing a precomputation shows it: the selector also works from the
    // dataset tab, so nothing is loaded before the admin has chosen.
    const setSelectedPrecomputation = (precomputationId: string) => {
        if (precomputationId === selectedPrecomputation) return;
        const params = new URLSearchParams(search);
        params.set('precomputation', precomputationId);
        history.replace(`${path}/precomputation?${params}`);
    };

    const tab = useMemo(() => {
        const activePath: string = pathname.split('/').pop() as string;
        return ['dataset', 'precomputation'].includes(activePath)
            ? activePath
            : 'dataset';
    }, [pathname]);

    const switchTab = (newTab: string) => {
        if (newTab === tab) return;
        history.push(
            `${pathname.split('/').slice(0, -1).join('/')}/${newTab}${search}`,
        );
    };

    const { isPrecomputationsLoading, precomputations, precomputationsError } =
        useFetchPrecomputations();

    if (canUploadFile && isUploading) {
        // No data yet but an import is running: don't show the upload form again
        return <ImportInProgress />;
    }

    if (canUploadFile) {
        return (
            <UploadPage isFirstFile={canUploadFile} onOpenWizard={openWizard} />
        );
    }

    if (!pathname.endsWith('dataset') && !pathname.endsWith('precomputation')) {
        return <Redirect to={`${pathname}/dataset${search}`} />;
    }

    return (
        <div>
            <Tabs
                value={tab}
                onChange={(_, newValue) => switchTab(newValue)}
                variant="fullWidth"
            >
                <Tab label={translate('dataset')} value="dataset" />
                <Tab
                    disabled={
                        isPrecomputationsLoading ||
                        !!precomputationsError ||
                        !precomputations ||
                        precomputations.length === 0
                    }
                    label={
                        <Grid container justifyContent="center">
                            <Grid item xs={6} alignContent="center">
                                {translate('precomputed_data')}
                            </Grid>
                            {/* a click in the selector must not also reach the
                                tab: it would navigate without the selection */}
                            <Grid
                                item
                                xs={6}
                                onClick={(event) => event.stopPropagation()}
                            >
                                <PreComputationSelector
                                    value={selectedPrecomputation}
                                    onChange={setSelectedPrecomputation}
                                    data={precomputations || []}
                                    isLoading={isPrecomputationsLoading}
                                    error={!!precomputationsError}
                                />
                            </Grid>
                        </Grid>
                    }
                    value="precomputation"
                />
            </Tabs>
            <Switch>
                <Route
                    path={`${path}/dataset`}
                    exact
                    component={ParsingResult}
                />
                <Route
                    path={`${path}/precomputation`}
                    exact
                    render={() =>
                        selectedPrecomputation ? (
                            <ParsingResult
                                key={selectedPrecomputation}
                                precomputedId={selectedPrecomputation}
                            />
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '200px',
                                    p: 2,
                                }}
                            >
                                <Typography variant="caption">
                                    {translate(
                                        precomputations.length
                                            ? 'select_precomputed_data'
                                            : 'no_precomputed_data',
                                    )}
                                </Typography>
                            </Box>
                        )
                    }
                />
            </Switch>
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    canUploadFile: fromParsing.canUpload(state),
    isUploading: fromUpload.isUploadPending(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

const mapDispatchToProps = {
    preLoadLoaders,
};

export const DataRoute = compose(
    withInitialData,
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
        componentWillMount() {
            // @ts-expect-error TS2571
            this.props.preLoadLoaders();
        },
    }),
    // @ts-expect-error TS2345
)(DataRouteComponent);
