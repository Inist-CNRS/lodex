import { connect } from 'react-redux';

import Stats from '../Stats';
import { fromDataset } from '../selectors';

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    currentNbResources: fromDataset.getDatasetTotal(state),
    nbResources: fromDataset.getDatasetFullTotal(state),
});

export default connect(mapStateToProps)(Stats);
