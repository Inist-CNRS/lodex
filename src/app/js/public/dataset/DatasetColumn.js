import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';

import UriColumn from './UriColumn';
import DefaultColumn from './DefaultColumn';

export default branch(
    props => props.column.name === 'uri',
    renderComponent(UriColumn),
)(DefaultColumn);
