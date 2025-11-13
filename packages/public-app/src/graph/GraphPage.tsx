import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import getTitle from '@lodex/frontend-common/utils/getTitle';
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
        <Graph className="graph-page" name={name} />
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
