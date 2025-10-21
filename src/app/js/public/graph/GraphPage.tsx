import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import getTitle from '../../lib/getTitle';
import Graph from './Graph';

type GraphPageProps = {
    name: string;
    onSearch(): void;
    tenant?: string;
};

const GraphPage = ({ name, onSearch, tenant }: GraphPageProps) => (
    <>
        <Helmet>
            <title>{getTitle(tenant, 'Resources')}</title>
        </Helmet>
        <Graph className="graph-page" name={name} onSearch={onSearch} />
    </>
);

GraphPage.defaultProps = {
    name: null,
};

const mapStateToProps = (
    // @ts-expect-error TS7006
    _,
    {
        match: {
            // @ts-expect-error TS7031
            params: { name },
        },
    },
) => ({
    name,
});

// @ts-expect-error TS2345
export default compose(connect(mapStateToProps))(GraphPage);
