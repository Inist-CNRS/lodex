import { connect } from 'react-redux';

import ParsingExcerpt from '../parsing/ParsingExcerpt';
import { getPublicationColumns } from '../fields';

const mapStateToProps = state => ({
    columns: getPublicationColumns(state),
    lines: state.publicationPreview,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ParsingExcerpt);
