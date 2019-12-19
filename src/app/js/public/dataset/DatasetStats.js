import { connect } from 'react-redux';

import Stats from '../Stats';
import { fromDataset } from '../selectors';

const mapStateToProps = state => ({
    currentNbResources: fromDataset.getDatasetTotal(state),
    nbResources: fromDataset.getDatasetFullTotal(state),
});

export default connect(mapStateToProps)(Stats);
