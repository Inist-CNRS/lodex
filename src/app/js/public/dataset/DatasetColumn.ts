// @ts-expect-error TS7016
import branch from 'recompose/branch';
// @ts-expect-error TS7016
import renderComponent from 'recompose/renderComponent';

import UriColumn from './UriColumn';
import DefaultColumn from './DefaultColumn';

export default branch(
    // @ts-expect-error TS7006
    (props) => props.column.name === 'uri',
    renderComponent(UriColumn),
)(DefaultColumn);
