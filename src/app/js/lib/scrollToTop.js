export default (typeof window === 'undefined' ||
typeof window.scroll === 'undefined'
    ? () => null
    : (animated = false) =>
          window.scroll({
              top: 0,
              left: 0,
              behavior: animated ? 'smooth' : 'auto',
          }));
