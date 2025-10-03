import { connect } from 'react-redux';

import Stats from '../Stats';
import { fromSearch } from '../selectors';

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    currentNbResources: fromSearch.getDatasetTotal(state),
    // @ts-expect-error TS2339
    nbResources: fromSearch.getDatasetFullTotal(state),
});

export default connect(mapStateToProps)(Stats);
