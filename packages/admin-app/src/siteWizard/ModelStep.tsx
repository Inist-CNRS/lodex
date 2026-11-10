import { useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { getModelTitleKey, type CatalogModel } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { ModelCatalogDialog } from './ModelCatalogDialog';

type ModelStepProps = {
    models: CatalogModel[];
    selectedId: string;
    onSelect: (id: string) => void;
};

export const ModelStep = ({ models, selectedId, onSelect }: ModelStepProps) => {
    const { translate } = useTranslate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <Box>
            <Typography
                variant="h2"
                fontSize={20}
                color="text.primary"
                sx={{ mt: 2 }}
            >
                {translate('site_wizard_catalog_intro')}
            </Typography>
            {models.length === 0 ? (
                <Typography sx={{ mt: 2 }}>
                    {translate('site_wizard_no_model')}
                </Typography>
            ) : (
                <>
                    <Box
                        display="flex"
                        alignItems="center"
                        marginTop="24px"
                        marginBottom="10px"
                    >
                        <TextField
                            select
                            sx={{ minWidth: 400 }}
                            label={translate('site_wizard_choose_model')}
                            value={selectedId}
                            onChange={(e) => onSelect(e.target.value)}
                            variant="standard"
                            InputLabelProps={{ shrink: !!selectedId }}
                        >
                            {models.map((model) => (
                                <MenuItem key={model.id} value={model.id}>
                                    {translate(getModelTitleKey(model.id))}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box mt="10px" ml="10px">
                            <Button
                                variant="contained"
                                color="primary"
                                aria-label={translate(
                                    'site_wizard_choose_model',
                                )}
                                onClick={() => setIsDialogOpen(true)}
                            >
                                <ListAltIcon fontSize="small" />
                            </Button>
                        </Box>
                    </Box>
                    <Typography sx={{ mt: 2 }}>
                        {translate('site_wizard_manual_hint')}
                    </Typography>
                </>
            )}
            <ModelCatalogDialog
                isOpen={isDialogOpen}
                models={models}
                selectedId={selectedId}
                onSelect={onSelect}
                onClose={() => setIsDialogOpen(false)}
            />
        </Box>
    );
};
