import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import translate from 'redux-polyglot/translate';

import { Box, Typography, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { FIELD_FORM_NAME, saveField as saveFieldAction } from '../';

import { hideAddColumns } from '../../admin/parsing';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import Uri from './Uri';
import TabGeneral from './TabGeneral';
import TabDisplay from './TabDisplay';
import TabSearch from './TabSearch';
import TabSemantics from './TabSemantics';
import Actions from './Actions';
import {
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
} from '../../../../common/scope';
import { URI_FIELD_NAME } from '../../../../common/uris';
import classNames from 'classnames';
import { TabPanel } from './TabPanel';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import ValuePreviewConnected from './ValuePreview';

const useStyles = makeStyles({
    wizard: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    container: {
        display: 'flex',
        paddingBottom: '1rem',
        width: '100%',
        flexGrow: 1,
    },
    form: {
        marginRight: '1rem',
        paddingRight: '1rem',
        flexGrow: 1,
        overflowY: 'auto',
    },
    column: {
        width: '25rem',
    },
    title: {
        padding: '16px 24px',
    },
});

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
    const classes = useStyles();
    const [tabValue, setTabValue] = useState(0);
    useEffect(() => {
        if (!fieldName) {
            history.push(`/display/${filter}`);
            return;
        }
        if (!isFieldsLoading && !currentEditedField) {
            toast(polyglot.t('no_field', { fieldName }), {
                type: toast.TYPE.ERROR,
            });
            history.push(`/display/${filter}`);
        }
        if (
            currentEditedField &&
            !fieldsFromFilter.some(f => f.name === currentEditedField.name)
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
                    ? `/${currentEditedField.subresourceId}`
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
                    isSubresourceField={!!currentEditedField.subresourceId}
                    filter={filter}
                />
            ),
        },
        !currentEditedField.subresourceId && {
            label: 'field_wizard_tab_semantic',
            id: 'tab-semantics',
            component: (
                <TabSemantics
                    fields={fields}
                    currentEditedField={currentEditedField}
                />
            ),
        },
        !currentEditedField.subresourceId && {
            label: 'field_wizard_tab_search',
            id: 'tab-search',
            component: <TabSearch />,
        },
    ].filter(x => x);

    return (
        <Box className={classNames(classes.wizard, 'wizard')}>
            <Typography component="h2" variant="h6" className={classes.title}>
                {currentEditedField ? currentEditedField.label : ''}
            </Typography>
            {currentEditedField && (
                <Box className={classes.container}>
                    <Box id="field_form" className={classes.form}>
                        {currentEditedField.name !== URI_FIELD_NAME ? (
                            <>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
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
                                {tabs.map((tab, index) => (
                                    <TabPanel
                                        value={tabValue}
                                        index={index}
                                        key={index}
                                    >
                                        {tab.component}
                                    </TabPanel>
                                ))}
                            </>
                        ) : (
                            <Uri
                                currentEditedField={currentEditedField}
                                fields={fields}
                            />
                        )}
                    </Box>
                    <Box className={classes.column}>
                        <ValuePreviewConnected scope={filter} />
                    </Box>
                </Box>
            )}
            <Actions
                currentEditedField={currentEditedField}
                onCancel={handleCancel}
                onSave={handleSave}
            />
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
            ? fromFields.getFieldsExceptField(state, currentEditedField)
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
            initialValues: { ...currentEditedField, ...fieldFilterAttributes },
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
