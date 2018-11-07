export default (animated = false) => {
    if (typeof window === 'undefined') return null;
    if (!window.scroll) return null;

    window.scroll({
        top: 0,
        left: 0,
        behavior: animated ? 'smooth' : 'auto',
    });
};
