import { connect } from 'react-redux';

import Stats from '../Stats';
import { fromSearch } from '../selectors';

const mapStateToProps = (state) => ({
    currentNbResources: fromSearch.getDatasetTotal(state),
    nbResources: fromSearch.getDatasetFullTotal(state),
});

export default connect(mapStateToProps)(Stats);
