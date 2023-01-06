import React, { useState } from 'react';
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
import TabValue from './TabValue';
import Uri from './Uri';
import TabTransforms from './TabTransforms';
import TabIdentity from './TabIdentity';
import TabDisplay from './TabDisplay';
import TabSearch from './TabSearch';
import TabSemantics from './TabSemantics';
import FieldExcerpt from '../../admin/preview/field/FieldExcerpt';
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
import { useHistory } from 'react-router';

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
        borderRight: '1px solid rgb(224, 224, 224)',
        marginRight: '1rem',
        paddingRight: '1rem',
        flexGrow: 1,
        overflowY: 'auto',
    },
    column: {
        width: '20rem',
    },
    title: {
        padding: '16px 24px',
    },
});

const FieldEditionWizardComponent = ({
    field,
    fields,
    filter,
    saveField,
    handleHideExistingColumns,
    p: polyglot,
}) => {
    const classes = useStyles();
    const history = useHistory();
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (_, newValue) => {
        setTabValue(newValue);
    };

    const handleCancel = () => {
        handleHideExistingColumns();
        history.push(
            `/display/${filter}${
                filter === SCOPE_DOCUMENT && field.subresourceId
                    ? `/${field.subresourceId}`
                    : ''
            }`,
        );
    };

    const handleSave = () => {
        saveField({ field, filter });
        handleHideExistingColumns();
    };

    if (!field) return null;

    const tabs = [
        {
            label: 'field_wizard_tab_identity',
            id: 'tab-identity',
            component: <TabIdentity field={field} />,
        },
        {
            label: 'field_wizard_tab_value',
            id: 'tab-value',
            component: (
                <TabValue
                    subresourceUri={field.subresourceId}
                    arbitraryMode={[SCOPE_DATASET, SCOPE_GRAPHIC].includes(
                        filter,
                    )}
                />
            ),
        },
        {
            label: 'field_wizard_tab_tranforms',
            id: 'tab-transforms',
            component: (
                <TabTransforms isSubresourceField={!!field.subresourceId} />
            ),
        },
        {
            label: 'field_wizard_tab_display',
            id: 'tab-display',
            component: (
                <TabDisplay isSubresourceField={!!field.subresourceId} />
            ),
        },
        !field.subresourceId && {
            label: 'field_wizard_tab_semantic',
            id: 'tab-semantics',
            component: <TabSemantics fields={fields} />,
        },
        !field.subresourceId && {
            label: 'field_wizard_tab_search',
            id: 'tab-search',
            component: <TabSearch />,
        },
    ].filter(x => x);

    return (
        <Box className={classNames(classes.wizard, 'wizard')}>
            <Typography component="h2" variant="h6" className={classes.title}>
                {field ? field.label : ''}
            </Typography>
            {field && (
                <Box className={classes.container}>
                    <Box id="field_form" className={classes.form}>
                        {field.name !== URI_FIELD_NAME ? (
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
                            <Uri field={field} fields={fields} />
                        )}
                    </Box>
                    <Box className={classes.column}>
                        <FieldExcerpt
                            className="publication-excerpt-for-edition"
                            onHeaderClick={null}
                            isPreview
                        />
                    </Box>
                </Box>
            )}
            <Actions
                field={field}
                onCancel={handleCancel}
                onSave={handleSave}
            />
        </Box>
    );
};

FieldEditionWizardComponent.propTypes = {
    field: fieldPropTypes,
    fields: PropTypes.arrayOf(fieldPropTypes),
    filter: PropTypes.string,
    editField: PropTypes.func.isRequired,
    saveField: PropTypes.func.isRequired,
    handleHideExistingColumns: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

FieldEditionWizardComponent.defaultProps = {
    field: null,
    fields: null,
    editedField: null,
};

const mapStateToProps = state => {
    const field = fromFields.getEditedField(state);

    return {
        field,
        fields: field ? fromFields.getFieldsExceptEdited(state) : null,
    };
};

const mapDispatchToProps = {
    saveField: saveFieldAction,
    handleHideExistingColumns: hideAddColumns,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withProps(({ field, filter }) => {
        const fieldFilterAttributes = filter
            ? {
                  scope: filter,
                  display: field ? field.display : true,
              }
            : {};

        return { initialValues: { ...field, ...fieldFilterAttributes } };
    }),
    reduxForm({
        form: FIELD_FORM_NAME,
        enableReinitialize: true,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
    }),
    translate,
)(FieldEditionWizardComponent);
