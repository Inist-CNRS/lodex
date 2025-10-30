import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { compose, withProps } from 'recompose';

import { Box, Tab, Tabs } from '@mui/material';

import { lodexFieldFormChange, saveField as saveFieldAction } from '../';

import { withRouter } from 'react-router';
import {
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
    toast,
} from '@lodex/common';
import { hideAddColumns } from '../../../../../packages/admin-app/src/parsing';
import { fromFields } from '../../sharedSelectors';
import Actions from './Actions';
import TabAnnotations from './TabAnnotations';
import TabDisplay from './TabDisplay';
import TabGeneral from './TabGeneral';
import { TabPanel } from './TabPanel';
import TabSemantics from './TabSemantics';
import ValuePreviewConnected from './ValuePreview';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { Field } from '../types';

const ACTIONS_BAR_HEIGHT = 70;
const PREVIEW_WIDTH = 320;

interface FieldEditionWizardComponentProps {
    currentEditedField?: Field;
    fields?: Field[];
    fieldsFromFilter?: Field[];
    filter?: string;
    saveField(...args: unknown[]): unknown;
    handleHideExistingColumns(...args: unknown[]): unknown;
    fieldName?: string;
    history?: {
        push(...args: unknown[]): unknown;
    };
    isFieldsLoading: boolean;
}

const FieldEditionWizardComponent = ({
    currentEditedField,

    fields,

    fieldsFromFilter,

    filter,

    saveField,

    handleHideExistingColumns,

    fieldName,

    history,

    isFieldsLoading,
}: FieldEditionWizardComponentProps) => {
    const { translate } = useTranslate();
    const [tabValue, setTabValue] = useState(0);

    // handle page loading before the field has started loading
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (isInitialized) {
            return;
        }
        if (isFieldsLoading) {
            setIsInitialized(true);
        }
    }, [isInitialized, setIsInitialized, isFieldsLoading]);
    useEffect(() => {
        if (!fieldName) {
            // @ts-expect-error TS18048
            history.push(`/display/${filter}`);
            return;
        }

        if (isInitialized && !isFieldsLoading && !currentEditedField) {
            toast(translate('no_field', { fieldName }), {
                type: 'error',
            });
            // @ts-expect-error TS18048
            history.push(`/display/${filter}`);
        }
        if (
            currentEditedField &&
            // @ts-expect-error TS7006
            !fieldsFromFilter.some((f) => f.name === currentEditedField.name)
        ) {
            toast(translate('no_field_in_scope', { fieldName, filter }), {
                type: 'error',
            });
            // @ts-expect-error TS18048
            history.push(`/display/${filter}`);
        }
    }, [
        fieldName,
        currentEditedField,
        filter,
        isInitialized,
        isFieldsLoading,
        fieldsFromFilter,
        history,
        translate,
    ]);

    const dispatch = useDispatch();

    const formMethods = useForm({
        values: currentEditedField,
    });
    useEffect(
        () =>
            formMethods.subscribe({
                formState: {
                    values: true,
                },
                callback: ({ values }) => {
                    dispatch(lodexFieldFormChange({ values }));
                },
            }),
        [formMethods.subscribe],
    );

    // @ts-expect-error TS7006
    const handleChange = (_, newValue) => {
        setTabValue(newValue);
    };

    const handleCancel = () => {
        handleHideExistingColumns();
        // @ts-expect-error TS18048
        history.push(
            `/display/${filter}${
                // @ts-expect-error TS18046
                filter === SCOPE_DOCUMENT && currentEditedField.subresourceId
                    ? // @ts-expect-error TS18046
                      `/subresource/${currentEditedField.subresourceId}`
                    : ''
            }`,
        );
    };

    const handleSave = () => {
        saveField({
            field: currentEditedField,
            filter,
            values: formMethods.getValues(),
        });
        handleHideExistingColumns();
    };

    if (!currentEditedField) return null;
    const tabs = [
        {
            label: 'field_wizard_tab_identity',
            id: 'tab-general',
            component: (
                <TabGeneral
                    subresourceUri={currentEditedField.subresourceId}
                    arbitraryMode={[SCOPE_DATASET, SCOPE_GRAPHIC].includes(
                        // @ts-expect-error TS2345
                        filter,
                    )}
                />
            ),
        },
        {
            label: 'field_wizard_tab_display',
            id: 'tab-display',
            component: (
                <TabDisplay
                    // @ts-expect-error TS2322
                    filter={filter}
                    // @ts-expect-error TS2322
                    fields={fields}
                    subresourceId={currentEditedField.subresourceId}
                />
            ),
        },
        {
            label: 'field_wizard_tab_annotations',
            id: 'tab-annotations',
            component: <TabAnnotations />,
        },
        {
            label: 'field_wizard_tab_semantic',
            id: 'tab-semantics',
            component: <TabSemantics currentEditedField={currentEditedField} />,
        },
    ].filter((x) => x);

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(handleSave)}>
                <Box
                    className="wizard"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        width: {
                            xs: '100%',
                            md: `calc(100% - ${PREVIEW_WIDTH}px)`,
                        },
                    }}
                >
                    {currentEditedField && (
                        <Box
                            sx={{
                                display: 'flex',
                                paddingBottom: '1rem',
                                flexGrow: 1,
                            }}
                        >
                            <Box
                                id="field_form"
                                sx={{
                                    marginRight: '1rem',
                                    paddingRight: '1rem',
                                    flexGrow: 1,
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Tabs
                                    value={tabValue}
                                    onChange={handleChange}
                                    variant="fullWidth"
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: 'divider',
                                        marginBottom: 4,
                                        '& button:hover': {
                                            color: 'primary.main',
                                        },
                                    }}
                                >
                                    {tabs.map((tab, index) => (
                                        <Tab
                                            label={translate(tab.label)}
                                            value={index}
                                            key={index}
                                            id={tab.id}
                                        />
                                    ))}
                                </Tabs>
                                <Box
                                    flexGrow={1}
                                    marginBottom={`${ACTIONS_BAR_HEIGHT}px`}
                                >
                                    {tabs.map((tab, index) => (
                                        <TabPanel
                                            value={tabValue}
                                            index={index}
                                            key={index}
                                        >
                                            {tab.component}
                                        </TabPanel>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    )}
                    <Box
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'block',
                            },
                            width: `${PREVIEW_WIDTH}px`,
                            boxSizing: 'content-box',
                            position: 'fixed',
                            right: 0,
                            marginX: '1rem',
                            height: `calc(100% - ${ACTIONS_BAR_HEIGHT * 2.5}px)`,
                            overflowY: 'auto',
                        }}
                        className="mui-fixed"
                    >
                        {/*
                         // @ts-expect-error TS2322 */}
                        <ValuePreviewConnected scope={filter} />
                    </Box>
                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'white',
                            boxShadow: '-3px -12px 15px -3px rgba(0,0,0,0.1)',
                            padding: '1rem',
                            maxHeight: ACTIONS_BAR_HEIGHT,
                            zIndex: 999,
                        }}
                        className="mui-fixed"
                    >
                        <Box className="container">
                            <Actions
                                currentEditedField={currentEditedField}
                                onCancel={handleCancel}
                                onSave={handleSave}
                            />
                        </Box>
                    </Box>
                </Box>
            </form>
        </FormProvider>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { match, filter }) => {
    const { fieldName } = match.params;
    const currentEditedField = fromFields.getFieldByName(state, fieldName);

    return {
        currentEditedField,
        fieldName,
        fields: currentEditedField
            ? fromFields
                  .getFieldsExceptField(state, currentEditedField)
                  .sort((a, b) =>
                      a.label
                          ?.toLowerCase()
                          .localeCompare(b.label?.toLowerCase()),
                  )
            : null,
        fieldsFromFilter: fromFields.getOntologyFields(state, filter),
        isFieldsLoading: fromFields.isLoading(state),
    };
};

const mapDispatchToProps = {
    saveField: saveFieldAction,
    handleHideExistingColumns: hideAddColumns,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS7031
    withProps(({ currentEditedField, filter }) => {
        const fieldFilterAttributes = filter
            ? {
                  scope: filter,
                  display: currentEditedField
                      ? currentEditedField.display
                      : true,
              }
            : {};

        return {
            initialValues: {
                ...currentEditedField,
                ...fieldFilterAttributes,
                annotable: currentEditedField?.annotable ?? true,
                enableAnnotationKindCorrection:
                    currentEditedField?.enableAnnotationKindCorrection ?? true,
                enableAnnotationKindAddition:
                    currentEditedField?.enableAnnotationKindAddition ?? true,
                enableAnnotationKindRemoval:
                    currentEditedField?.enableAnnotationKindRemoval ?? true,
                annotationFormat:
                    currentEditedField?.annotationFormat ?? 'text',
                annotationFormatListKind:
                    currentEditedField?.annotationFormatListKind ?? 'single',
                annotationFormatListSupportsNewValues:
                    currentEditedField?.annotationFormatListSupportsNewValues ??
                    true,
            },
        };
    }),
    // @ts-expect-error TS2345
)(FieldEditionWizardComponent);
