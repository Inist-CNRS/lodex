import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    ListItemIcon,
    MenuItem,
    MenuList,
    Stack,
    useTheme,
} from '@mui/material';

import CommentIcon from '@mui/icons-material/Comment';
import { useField } from '@tanstack/react-form';
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_CORRECTION,
    ANNOTATION_KIND_REMOVAL,
} from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { COMMENT_STEP, VALUE_STEP } from '../steps';

interface TargetFieldProps {
    form: object;
    field: object;
    initialValue?: any;
    goToStep(...args: unknown[]): unknown;
}

export function TargetField({
    form,
    field,
    initialValue,
    goToStep,
}: TargetFieldProps) {
    const theme = useTheme();
    const { translate } = useTranslate();

    const initialValueField = useField({
        name: 'initialValue',
        // @ts-expect-error TS2740
        form,
    });
    const kindField = useField({
        name: 'kind',
        // @ts-expect-error TS2322
        form,
    });

    return (
        // @ts-expect-error TS2339
        <form.Field name="target">
            {/*
             // @ts-expect-error TS7006 */}
            {(formField) => {
                return (
                    <MenuList
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <MenuItem
                            sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontWeight: 'bold',
                            }}
                            onClick={() => {
                                formField.handleChange('title');
                                kindField.handleChange('comment');
                                initialValueField.handleChange(null);
                                goToStep(COMMENT_STEP);
                            }}
                        >
                            <Stack direction="row" spacing="1rem">
                                <ListItemIcon>
                                    <CommentIcon
                                        // @ts-expect-error TS2769
                                        color={theme.palette.primary.main}
                                        htmlColor={theme.palette.primary.main}
                                    />
                                </ListItemIcon>
                                {translate('annotation_annotate_field_choice')}
                            </Stack>
                            <ArrowForwardIosIcon
                                // @ts-expect-error TS2769
                                color={theme.palette.primary.main}
                                htmlColor={theme.palette.primary.main}
                            />
                        </MenuItem>
                        {/*
                         // @ts-expect-error TS2339 */}
                        {field.enableAnnotationKindCorrection !== false && (
                            <MenuItem
                                sx={{
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    fontWeight: 'bold',
                                }}
                                onClick={() => {
                                    formField.handleChange('value');
                                    kindField.handleChange(
                                        ANNOTATION_KIND_CORRECTION,
                                    );

                                    if (Array.isArray(initialValue)) {
                                        goToStep(VALUE_STEP);
                                        return;
                                    }
                                    initialValueField.handleChange(
                                        initialValue?.toString(),
                                    );
                                    goToStep(COMMENT_STEP);
                                }}
                            >
                                <Stack direction="row" spacing="1rem">
                                    <ListItemIcon>
                                        <EditIcon
                                            // @ts-expect-error TS2769
                                            color={theme.palette.primary.main}
                                            htmlColor={
                                                theme.palette.primary.main
                                            }
                                        />
                                    </ListItemIcon>
                                    {translate('annotation_correct_content')}
                                </Stack>
                                <ArrowForwardIosIcon
                                    // @ts-expect-error TS2769
                                    color={theme.palette.primary.main}
                                    htmlColor={theme.palette.primary.main}
                                />
                            </MenuItem>
                        )}
                        {/*
                         // @ts-expect-error TS2339 */}
                        {field.enableAnnotationKindAddition !== false && (
                            <MenuItem
                                sx={{
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    fontWeight: 'bold',
                                }}
                                onClick={() => {
                                    formField.handleChange('value');
                                    initialValueField.handleChange(null);
                                    kindField.handleChange(
                                        ANNOTATION_KIND_ADDITION,
                                    );

                                    goToStep(COMMENT_STEP);
                                }}
                            >
                                <Stack direction="row" spacing="1rem">
                                    <ListItemIcon>
                                        <AddIcon
                                            // @ts-expect-error TS2769
                                            color={theme.palette.primary.main}
                                            htmlColor={
                                                theme.palette.primary.main
                                            }
                                        />
                                    </ListItemIcon>
                                    {translate('annotation_add_content')}
                                </Stack>
                                <ArrowForwardIosIcon
                                    // @ts-expect-error TS2769
                                    color={theme.palette.primary.main}
                                    htmlColor={theme.palette.primary.main}
                                />
                            </MenuItem>
                        )}

                        {/*
                         // @ts-expect-error TS2339 */}
                        {field.enableAnnotationKindRemoval !== false && (
                            <MenuItem
                                sx={{
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    fontWeight: 'bold',
                                }}
                                onClick={() => {
                                    formField.handleChange('value');
                                    kindField.handleChange(
                                        ANNOTATION_KIND_REMOVAL,
                                    );

                                    if (Array.isArray(initialValue)) {
                                        goToStep(VALUE_STEP);
                                        return;
                                    }
                                    initialValueField.handleChange(
                                        initialValue?.toString(),
                                    );
                                    goToStep(COMMENT_STEP);
                                }}
                            >
                                <Stack direction="row" spacing="1rem">
                                    <ListItemIcon>
                                        <RemoveIcon
                                            // @ts-expect-error TS2769
                                            color={theme.palette.primary.main}
                                            htmlColor={
                                                theme.palette.primary.main
                                            }
                                        />
                                    </ListItemIcon>
                                    {translate(
                                        'annotation_remove_content_choice',
                                    )}
                                </Stack>
                                <ArrowForwardIosIcon
                                    // @ts-expect-error TS2769
                                    color={theme.palette.primary.main}
                                    htmlColor={theme.palette.primary.main}
                                />
                            </MenuItem>
                        )}
                    </MenuList>
                );
            }}
            {/*
         // @ts-expect-error TS2339 */}
        </form.Field>
    );
}
