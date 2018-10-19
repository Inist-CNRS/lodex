export const concat = (render1, render2) => props =>
    render2({ ...props, children: p => render1({ ...props, ...p }) });

export const neutral = ({ children }) => children();

export default renderProps => renderProps.reverse().reduce(concat, neutral);
