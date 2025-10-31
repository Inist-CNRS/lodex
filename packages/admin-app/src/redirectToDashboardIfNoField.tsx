import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { compose, branch, renderComponent } from 'recompose';

import { fromFields } from '@lodex/frontend-common/sharedSelectors';

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    nbFields: fromFields.getNbFields(state),
    isLoading: fromFields.isLoading(state),
});

export default compose(
    connect(mapStateToProps),
    branch(
        // @ts-expect-error TS7031
        ({ isLoading, nbFields }) => !isLoading && nbFields === 0,
        renderComponent(() => <Redirect to="/" />),
    ),
);
