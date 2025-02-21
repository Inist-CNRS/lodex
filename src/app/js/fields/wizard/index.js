import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { translate } from '../../i18n/I18NContext';

import { Box, Tab, Tabs } from '@mui/material';

import { FIELD_FORM_NAME, saveField as saveFieldAction } from '../';

import { withRouter } from 'react-router';
import { reduxForm } from 'redux-form';
import {
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
} from '../../../../common/scope';
import { toast } from '../../../../common/tools/toast';
import { URI_FIELD_NAME } from '../../../../common/uris';
import { hideAddColumns } from '../../admin/parsing';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import Actions from './Actions';
import TabDisplay from './TabDisplay';
import TabGeneral from './TabGeneral';
import { TabPanel } from './TabPanel';
import TabSemantics from './TabSemantics';
import Uri from './Uri';
import ValuePreviewConnected from './ValuePreview';

const ACTIONS_BAR_HEIGHT = 70;
const PREVIEW_WIDTH = 320;

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
    p: polyglot,
}) => {
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
            history.push(`/display/${filter}`);
            return;
        }

        if (isInitialized && !isFieldsLoading && !currentEditedField) {
            toast(polyglot.t('no_field', { fieldName }), {
                type: toast.TYPE.ERROR,
            });
            history.push(`/display/${filter}`);
        }
        if (
            currentEditedField &&
            !fieldsFromFilter.some((f) => f.name === currentEditedField.name)
        ) {
            toast(polyglot.t('no_field_in_scope', { fieldName, filter }), {
                type: toast.TYPE.ERROR,
            });
            history.push(`/display/${filter}`);
        }
    }, [fieldName, currentEditedField, filter]);

    const handleChange = (_, newValue) => {
        setTabValue(newValue);
    };

    const handleCancel = () => {
        handleHideExistingColumns();
        history.push(
            `/display/${filter}${
                filter === SCOPE_DOCUMENT && currentEditedField.subresourceId
                    ? `/subresource/${currentEditedField.subresourceId}`
                    : ''
            }`,
        );
    };

    const handleSave = () => {
        saveField({ field: currentEditedField, filter });
        handleHideExistingColumns();
    };

    if (!currentEditedField) return null;
    const tabs = [
        {
            label: 'field_wizard_tab_identity',
            id: 'tab-general',
            component: (
                <TabGeneral
                    currentEditedField={currentEditedField}
                    subresourceUri={currentEditedField.subresourceId}
                    arbitraryMode={[SCOPE_DATASET, SCOPE_GRAPHIC].includes(
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
                    filter={filter}
                    fields={fields}
                    subresourceId={currentEditedField.subresourceId}
                />
            ),
        },
        {
            label: 'field_wizard_tab_semantic',
            id: 'tab-semantics',
            component: <TabSemantics currentEditedField={currentEditedField} />,
        },
    ].filter((x) => x);

    return (
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
                        {currentEditedField.name !== URI_FIELD_NAME ? (
                            <>
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
                                            label={polyglot.t(tab.label)}
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
                            </>
                        ) : (
                            <Uri
                                currentEditedField={currentEditedField}
                                fields={fields}
                            />
                        )}
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
    );
};

FieldEditionWizardComponent.propTypes = {
    currentEditedField: fieldPropTypes,
    fields: PropTypes.arrayOf(fieldPropTypes),
    fieldsFromFilter: PropTypes.arrayOf(fieldPropTypes),
    filter: PropTypes.string,
    saveField: PropTypes.func.isRequired,
    handleHideExistingColumns: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    fieldName: PropTypes.string,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }),
    isFieldsLoading: PropTypes.bool.isRequired,
};

FieldEditionWizardComponent.defaultProps = {
    currentEditedField: null,
    fields: null,
};

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
    reduxForm({
        form: FIELD_FORM_NAME,
        enableReinitialize: true,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
    }),
    translate,
)(FieldEditionWizardComponent);
