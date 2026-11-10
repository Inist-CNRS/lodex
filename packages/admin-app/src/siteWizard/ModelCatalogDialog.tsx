import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    Link,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
    getModelDescriptionKey,
    getModelTitleKey,
    type CatalogModel,
} from '@lodex/common';
import CancelButton from '@lodex/frontend-common/components/CancelButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { catalogListStyles } from '../upload/ListDialog';

const styles = {
    ...catalogListStyles,
    selectedItem: {
        ...catalogListStyles.selectedItem,
        // the doc and demo icons stay visible on the selected item
        '& a': {
            color: 'var(--contrast-main)',
        },
    },
};

type ModelCatalogDialogProps = {
    isOpen: boolean;
    models: CatalogModel[];
    selectedId?: string;
    onSelect: (id: string) => void;
    onClose: () => void;
};

export const ModelCatalogDialog = ({
    isOpen,
    models,
    selectedId,
    onSelect,
    onClose,
}: ModelCatalogDialogProps) => {
    const { translate } = useTranslate();

    const handleSelect = (id: string) => {
        onSelect(id);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} scroll="body" maxWidth="lg">
            <DialogContent style={{ padding: 0, width: '1100px' }}>
                <List
                    component="nav"
                    aria-label="model list"
                    style={{ height: '70vh' }}
                >
                    {models.map((model) => (
                        <ListItem
                            key={model.id}
                            onClick={() => handleSelect(model.id)}
                            sx={{
                                ...styles.item,
                                ...(selectedId === model.id
                                    ? styles.selectedItem
                                    : {}),
                            }}
                        >
                            <ListItemText
                                disableTypography
                                primary={
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {translate(getModelTitleKey(model.id))}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography>
                                            {translate(
                                                getModelDescriptionKey(
                                                    model.id,
                                                ),
                                            )}
                                        </Typography>
                                        <Box
                                            justifyContent="flex-end"
                                            display="flex"
                                        >
                                            {model.doc && (
                                                <Tooltip
                                                    title={translate(
                                                        'site_wizard_documentation_link',
                                                    )}
                                                >
                                                    <Link
                                                        href={model.doc}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            marginRight: '1em',
                                                        }}
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <MenuBookIcon />
                                                    </Link>
                                                </Tooltip>
                                            )}
                                            {model.demo && (
                                                <Tooltip
                                                    title={translate(
                                                        'site_wizard_demo_link',
                                                    )}
                                                >
                                                    <Link
                                                        href={model.demo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <OpenInNewIcon />
                                                    </Link>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <CancelButton key="cancel" onClick={onClose}>
                    {translate('cancel')}
                </CancelButton>
            </DialogActions>
        </Dialog>
    );
};
