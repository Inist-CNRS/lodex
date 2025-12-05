import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { SearchPaneContextProvider } from '@lodex/frontend-common/search/SearchPaneContext';
import getTitle from '@lodex/frontend-common/utils/getTitle';
import { Stack } from '@mui/material';
import { SearchResultPane } from '../search/SearchResultPane';
import Graph from './Graph';

type GraphPageProps = {
    name: string;
    tenant?: string | undefined;
};

const GraphPage = ({ name, tenant }: GraphPageProps) => (
    <>
        <Helmet>
            <title>{getTitle(tenant, 'Resources')}</title>
        </Helmet>
        <SearchPaneContextProvider resultsPane={<SearchResultPane />}>
            <Stack direction="row" sx={{ width: '100%' }}>
                <Graph className="graph-page" name={name} />
            </Stack>
        </SearchPaneContextProvider>
    </>
);

const mapStateToProps = (
    _: unknown,
    {
        match: {
            params: { name },
        },
    }: { match: { params: { name: string } } },
) => ({
    name,
});

export default compose<GraphPageProps, GraphPageProps>(
    connect(mapStateToProps),
)(GraphPage);
