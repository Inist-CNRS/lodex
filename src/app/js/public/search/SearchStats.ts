import { connect } from 'react-redux';

import Stats from '../Stats';
import { fromSearch } from '../selectors';

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    currentNbResources: fromSearch.getDatasetTotal(state),
    nbResources: fromSearch.getDatasetFullTotal(state),
});

export default connect(mapStateToProps)(Stats);
