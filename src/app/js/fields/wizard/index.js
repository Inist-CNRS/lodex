import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import translate from 'redux-polyglot/translate';

import { Stepper, Box, Typography, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {
    editField as editFieldAction,
    saveField as saveFieldAction,
} from '../';

import { hideAddColumns } from '../../admin/parsing';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import StepValue from './StepValue';
import StepUri from './StepUri';
import StepTransforms from './StepTransforms';
import StepIdentity from './StepIdentity';
import StepDisplay from './StepDisplay';
import StepSearch from './StepSearch';
import StepSemantics from './StepSemantics';
import FieldExcerpt from '../../admin/preview/field/FieldExcerpt';
import Actions from './Actions';
import { SCOPE_DATASET, SCOPE_GRAPHIC } from '../../../../common/scope';
import { URI_FIELD_NAME } from '../../../../common/uris';
import classNames from 'classnames';
import { TabPanel } from './TabPanel';

const useStyles = makeStyles({
    wizard: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    container: {
        display: 'flex',
        paddingBottom: '1rem',
        width: 1000,
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
    editField,
    saveField,
    handleHideExistingColumns,
    p: polyglot,
}) => {
    const classes = useStyles();
    const [tabValue, setTabValue] = useState(0);
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (!field || !field.name) {
            setTabValue(0);
        }
    }, [field]);

    const handleChange = (_, newValue) => {
        setTabValue(newValue);
    };
    const handleSelectStep = step => setStep(step);

    const handleCancel = () => {
        editField(undefined);
        handleHideExistingColumns();
    };

    const handleSave = () => {
        saveField();
        handleHideExistingColumns();
    };

    if (!field) return null;

    const tabs = [
        {
            label: 'field_wizard_step_identity',
            component: (
                // <StepIdentity
                //     key="identity"
                //     id="step-identity"
                //     isSubresourceField={!!field.subresourceId}
                // />
                <span>Toto</span>
            ),
        },
        // {
        //     label: 'field_wizard_step_value',
        //     component: (
        //         <StepValue
        //             key="value"
        //             subresourceUri={field.subresourceId}
        //             arbitraryMode={[SCOPE_DATASET, SCOPE_GRAPHIC].includes(
        //                 filter,
        //             )}
        //         />
        //     ),
        // },
        // {
        //     label: 'field_wizard_step_tranforms',
        //     component: (
        //         <StepTransforms
        //             key="transformers"
        //             isSubresourceField={!!field.subresourceId}
        //         />
        //     ),
        // },
        // {
        //     label: 'field_wizard_step_display',
        //     component: (
        //         <StepDisplay
        //             isSubresourceField={!!field.subresourceId}
        //             key="display"
        //         />
        //     ),
        // },
        // !field.subresourceId && {
        //     label: 'field_wizard_step_semantic',
        //     component: (
        //         <StepSemantics fields={fields} field={field} key="semantics" />
        //     ),
        // },
        // !field.subresourceId && {
        //     label: 'field_wizard_step_search',
        //     component: <StepSearch key="search" />,
        // },
    ].filter(x => x);

    let steps = [];
    if (field && field.name !== URI_FIELD_NAME) {
        steps = [
            <StepIdentity
                key="identity"
                id="step-identity"
                isSubresourceField={!!field.subresourceId}
            />,
            <StepValue
                key="value"
                subresourceUri={field.subresourceId}
                arbitraryMode={[SCOPE_DATASET, SCOPE_GRAPHIC].includes(filter)}
            />,
            <StepTransforms
                key="transformers"
                isSubresourceField={!!field.subresourceId}
            />,
            !field.subresourceId && (
                <StepSemantics fields={fields} field={field} key="semantics" />
            ),
            <StepDisplay
                isSubresourceField={!!field.subresourceId}
                key="display"
            />,
            !field.subresourceId && <StepSearch key="search" />,
        ]
            .filter(x => x)
            .map((el, index) =>
                React.cloneElement(el, {
                    index,
                    active: step === index,
                    fields,
                    field,
                    filter,
                    onSelectStep: handleSelectStep,
                }),
            );
    }

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
                                <Tabs value={tabValue} onChange={handleChange}>
                                    {tabs.map((tab, index) => (
                                        <Tab
                                            label={polyglot.t(tab.label)}
                                            value={index}
                                            key={index}
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
                                <Stepper
                                    nonLinear
                                    activeStep={step}
                                    orientation="vertical"
                                >
                                    {steps}
                                </Stepper>
                            </>
                        ) : (
                            <StepUri field={field} fields={fields} />
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
    editField: editFieldAction,
    saveField: saveFieldAction,
    handleHideExistingColumns: hideAddColumns,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(FieldEditionWizardComponent);
