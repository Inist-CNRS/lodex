import { useState } from 'react';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TuneIcon from '@mui/icons-material/Tune';
import { Box, Button, IconButton, MenuItem, TextField } from '@mui/material';
import ListDialog from './ListDialog';
import CustomLoader from './CustomLoader';
import CancelButton from '@lodex/frontend-common/components/CancelButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

type LoaderSelectComponentProps = {
    loaders: Array<{ name: string }>;
    value: string;
    setLoader: (loaderName: string) => void;
};

const LoaderSelectComponent = ({
    loaders,
    value,
    setLoader,
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
        <Box display="flex" alignItems="center" gap={1}>
            <TextField
                select
                size="small"
                sx={{ minWidth: 220 }}
                className="select-loader"
                label={translate('loader_name')}
                onChange={(e) => setLoader(e.target.value)}
                value={value ?? ''}
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
            <IconButton
                className="open-loaders"
                color="primary"
                onClick={handleOpen}
                aria-label={translate('supported_format_list')}
            >
                <ListAltIcon />
            </IconButton>
            <Button
                color="primary"
                startIcon={<TuneIcon />}
                onClick={() => setOpenCustomLoadersDialog(true)}
                // the automatic loader has no script to start from
                disabled={!value || value === 'automatic'}
            >
                {translate(`add-custom-loader`)}
            </Button>
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
