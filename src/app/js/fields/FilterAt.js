import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

export const FilterAt = React.forwardRef((props, ref) => {
    return (
        <SvgIcon
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            {...props}
            ref={ref}
        >
            <path d="M84.4 15.6c-.9-1.7-2.7-2.7-4.6-2.7H20.2c-1.9 0-3.7 1-4.6 2.7-.9 1.7-.9 3.7.1 5.3.1.1.1.2.2.3l23.9 31.5v22.7c0 1.4.7 2.7 1.9 3.4L54 86.5c.6.4 1.4.6 2.1.6.7 0 1.3-.2 1.9-.5 1.3-.7 2.1-2 2.1-3.5V52.7L84 21.2c.1-.1.1-.2.2-.3 1-1.6 1.1-3.6.2-5.3z" />
        </SvgIcon>
    );
});

FilterAt.displayName = 'FilterAt';
export default FilterAt;
