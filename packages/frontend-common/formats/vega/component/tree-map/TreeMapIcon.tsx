import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

// @ts-expect-error TS7006
const TreeMapIcon = (props) => (
    // We size the fontSize to empty string to disable it
    <ViewQuiltIcon fontSize={''} {...props} width="1em" height="1em" />
);

export default TreeMapIcon;
