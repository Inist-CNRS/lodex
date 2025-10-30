import { useState } from 'react';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import ListDialog from './ListDialog';
import CustomLoader from './CustomLoader';
import CancelButton from '../../../../src/app/js/lib/components/CancelButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const styles = {
    disableUppercase: {
        textTransform: 'initial',
    },
};

type LoaderSelectComponentProps = {
    loaders: Array<{ name: string }>;
    value: string;
    setLoader: (loaderName: string) => void;
    disabled?: boolean;
};

const LoaderSelectComponent = ({
    loaders,
    value,
    setLoader,
    disabled,
}: LoaderSelectComponentProps) => {
    const { translate } = useTranslate();
    const [openLoadersDialog, setOpenLoadersDialog] = useState(false);
    const [openCustomLoadersDialog, setOpenCustomLoadersDialog] =
        useState(false);

    const handleOpen = () => {
        setOpenLoadersDialog(true);
    };

    const handleClose = () => {
        setOpenLoadersDialog(false);
    };

    const actions = [
        <CancelButton key="cancel" onClick={handleClose}>
            {translate('cancel')}
        </CancelButton>,
    ];

    return (
        <Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginBottom="10px"
                marginTop="60px"
            >
                <TextField
                    select
                    sx={{ minWidth: 200 }}
                    className="select-loader"
                    label={translate('loader_name')}
                    onChange={(e) => setLoader(e.target.value)}
                    value={value}
                    disabled={disabled}
                    variant="standard"
                    InputLabelProps={{ shrink: !!value }}
                >
                    <MenuItem
                        className="select-loader-item"
                        key={'automatic'}
                        value={'automatic'}
                    >
                        {translate('automatic-loader')}
                    </MenuItem>
                    {loaders
                        .sort((x, y) =>
                            translate(x.name).localeCompare(translate(y.name)),
                        )
                        .map((loader) => (
                            <MenuItem
                                className="select-loader-item"
                                key={loader.name}
                                value={loader.name}
                            >
                                {translate(loader.name)}
                            </MenuItem>
                        ))}
                    {value === 'custom-loader' && (
                        <MenuItem
                            className="select-loader-item"
                            key={'custom-loader'}
                            value={'custom-loader'}
                        >
                            {translate('custom-loader')}
                        </MenuItem>
                    )}
                </TextField>
                <Box mt="10px" ml="10px">
                    <Button
                        variant="contained"
                        className="open-loaders"
                        color="primary"
                        onClick={handleOpen}
                        disabled={disabled}
                    >
                        <ListAltIcon fontSize="small" />
                    </Button>
                </Box>
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginBottom="48px"
            >
                <Button
                    sx={styles.disableUppercase}
                    color="primary"
                    onClick={() => setOpenCustomLoadersDialog(true)}
                    disabled={disabled || !value || value === 'automatic'}
                >
                    {translate(`add-custom-loader`)}
                </Button>
            </Box>
            <ListDialog
                open={openLoadersDialog}
                handleClose={handleClose}
                actions={actions}
                loaders={loaders}
                setLoader={setLoader}
                value={value}
            />
            <CustomLoader
                isOpen={openCustomLoadersDialog}
                handleClose={() => {
                    setOpenCustomLoadersDialog(false);
                }}
            />
        </Box>
    );
};

export default LoaderSelectComponent;
