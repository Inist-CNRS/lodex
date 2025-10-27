import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import ParsingResult from '../parsing/ParsingResult';
import { fromParsing, fromPublication } from '../selectors';
import Upload from '../upload/Upload';
import { preLoadLoaders } from '../loader';
import withInitialData from '../withInitialData';
import { Grid, Tab, Tabs } from '@mui/material';
import { useMemo } from 'react';
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

interface DataRouteComponentProps {
    canUploadFile: boolean;
    hasPublishedDataset: boolean;
}

export const DataRouteComponent = ({
    canUploadFile,
}: DataRouteComponentProps) => {
    const { translate } = useTranslate();
    const { pathname, search } = useLocation();

    const { path } = useRouteMatch();
    const history = useHistory();

    const selectedPrecomputation = useMemo(() => {
        const params = new URLSearchParams(search);
        return params.get('precomputation');
    }, [search]);

    const setSelectedPrecomputation = (precomputationId: string) => {
        if (precomputationId === selectedPrecomputation) return;
        const params = new URLSearchParams(search);
        if (precomputationId) {
            params.set('precomputation', precomputationId);
        } else {
            params.delete('precomputation');
        }
        const newSearch = params.toString();
        const newPath = `${pathname}${newSearch ? `?${newSearch}` : ''}`;
        history.replace(newPath);
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
    if (canUploadFile) {
        // @ts-expect-error TS2322
        return <Upload className="admin" isFirstFile={canUploadFile} />;
    }

    if (!pathname.endsWith('dataset') && !pathname.endsWith('precomputation')) {
        return <Redirect to={`${pathname}/dataset`} />;
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
                    label={
                        <Grid container justifyContent="center">
                            <Grid item xs={6} alignContent="center">
                                {translate('precomputed_data')}
                            </Grid>
                            <Grid item xs={6}>
                                <PreComputationSelector
                                    disabled={tab !== 'precomputation'}
                                    value={selectedPrecomputation}
                                    onChange={setSelectedPrecomputation}
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
                    component={() => <p>SOON</p>}
                />
            </Switch>
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    canUploadFile: fromParsing.canUpload(state),
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
