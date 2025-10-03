import { connect } from 'react-redux';

import Stats from '../Stats';
import { fromDataset } from '../selectors';

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    currentNbResources: fromDataset.getDatasetTotal(state),
    // @ts-expect-error TS2339
    nbResources: fromDataset.getDatasetFullTotal(state),
});

export default connect(mapStateToProps)(Stats);
