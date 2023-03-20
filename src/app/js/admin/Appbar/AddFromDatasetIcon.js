import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

function AddFromDatasetIcon(props) {
    return (
        <SvgIcon
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            {...props}
        >
            <path d="M76.667 57.002V16.667C76.667 13.001 73.665 10 70 10H16.667C13.001 10 10 13.001 10 16.667V70c0 3.665 3.001 6.667 6.667 6.667h40.335C58.548 84.271 65.273 90 73.333 90 82.536 90 90 82.536 90 73.333c0-8.062-5.729-14.785-13.333-16.331zM57.002 70H16.667V16.667H70v40.335A16.69 16.69 0 0057.002 70zm26.331 5.833h-7.5v7.5h-5v-7.5h-7.5v-5h7.5v-7.5h5v7.5h7.5v5z" />
            <path d="M63.333 28.333v-5h-40v40h5V55h8.334v8.333h5V55H50v8.333h5V55h8.333v-5H55v-8.333h8.333v-5H55v-8.334h8.333zm-35 0h8.334v8.334h-8.334v-8.334zm0 21.667v-8.333h8.334V50h-8.334zM50 50h-8.333v-8.333H50V50zm0-13.333h-8.333v-8.334H50v8.334z" />
        </SvgIcon>
    );
}

export default AddFromDatasetIcon;
