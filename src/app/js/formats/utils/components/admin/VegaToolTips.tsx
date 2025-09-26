// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, TextField, FormControlLabel, Box } from '@mui/material';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';

/**
 * React component use for edit the tooltip
 */
class VegaToolTips extends Component {
    /**
     * Default args taken by the component
     */
    static propTypes = {
        checked: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onCategoryTitleChange: PropTypes.func.isRequired,
        categoryTitle: PropTypes.string.isRequired,
        onValueTitleChange: PropTypes.func.isRequired,
        valueTitle: PropTypes.string.isRequired,
        polyglot: polyglotPropTypes.isRequired,
        thirdValue: PropTypes.bool.isRequired,
        thirdValueTitle: PropTypes.string,
        onThirdValueChange: PropTypes.func,
    };

    /**
     * Default constructor
     * @param props Args taken by the component
     */
    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        this.onCheck = this.onCheck.bind(this);
        this.state = {
            // @ts-expect-error TS2339
            checked: this.props.checked,
            // @ts-expect-error TS2339
            categoryTitle: this.props.categoryTitle,
            // @ts-expect-error TS2339
            valueTitle: this.props.valueTitle,
            thirdValueTitle:
                // @ts-expect-error TS2339
                this.props.thirdValueTitle === undefined
                    ? ''
                    : // @ts-expect-error TS2339
                      this.props.thirdValueTitle,
        };
    }

    /**
     * Update the view and the states when the checkbox change
     * @param e event of the checkbox
     */
    // @ts-expect-error TS7006
    onCheck(e) {
        const target = e.target;
        this.setState({
            checked: target.checked,
            // @ts-expect-error TS2339
            categoryTitle: this.state.categoryTitle,
            // @ts-expect-error TS2339
            valueTitle: this.state.valueTitle,
            // @ts-expect-error TS2339
            thirdValueTitle: this.state.thirdValueTitle,
        });
        // @ts-expect-error TS2339
        this.props.onChange(target.checked);
    }

    /**
     * Update the view and the states when the text field corresponding to the category change
     * @param e event of the text field
     */
    // @ts-expect-error TS7006
    onCategoryTitleChange(e) {
        const target = e.target;
        this.setState({
            // @ts-expect-error TS2339
            checked: this.state.checked,
            categoryTitle: target.value,
            // @ts-expect-error TS2339
            valueTitle: this.state.valueTitle,
            // @ts-expect-error TS2339
            thirdValueTitle: this.state.thirdValueTitle,
        });
        // @ts-expect-error TS2339
        this.props.onCategoryTitleChange(target.value);
    }

    /**
     * Update the view and the states when the text field corresponding to the value change
     * @param e event of the text field
     */
    // @ts-expect-error TS7006
    onValueTitleChange(e) {
        const target = e.target;
        this.setState({
            // @ts-expect-error TS2339
            checked: this.state.checked,
            // @ts-expect-error TS2339
            categoryTitle: this.state.categoryTitle,
            valueTitle: target.value,
            // @ts-expect-error TS2339
            thirdValueTitle: this.state.thirdValueTitle,
        });
        // @ts-expect-error TS2339
        this.props.onValueTitleChange(target.value);
    }

    /**
     * Update the view and the states when the text field corresponding to the ThirdValue change
     * @param e event of the text field
     */
    // @ts-expect-error TS7006
    onThirdValueChange(e) {
        const target = e.target;
        this.setState({
            // @ts-expect-error TS2339
            checked: this.state.checked,
            // @ts-expect-error TS2339
            categoryTitle: this.state.categoryTitle,
            // @ts-expect-error TS2339
            valueTitle: this.state.valueTitle,
            thirdValueTitle: target.value,
        });
        // @ts-expect-error TS2339
        this.props.onThirdValueChange(target.value);
    }

    /**
     * Function use to make the view more dynamic (if checkbox is checked then display the text field)
     * @returns {*} Html corresponding to the text field
     */
    createUserInterface() {
        // @ts-expect-error TS2339
        const checked = this.state.checked;

        const thirdValue = () => {
            // @ts-expect-error TS2339
            if (this.props.thirdValue) {
                return (
                    <TextField
                        // @ts-expect-error TS2339
                        label={this.props.polyglot.t('tooltip_third_3')}
                        // @ts-expect-error TS2339
                        value={this.state.thirdValueTitle}
                        onChange={this.onThirdValueChange.bind(this)}
                        fullWidth
                    />
                );
            }
        };

        if (checked) {
            return (
                <Box display="flex" flexDirection="column" flexGrow={1} gap={2}>
                    <TextField
                        // @ts-expect-error TS2339
                        label={this.props.polyglot.t(
                            // @ts-expect-error TS2339
                            this.props.thirdValue
                                ? 'tooltip_third_1'
                                : 'tooltip_category',
                        )}
                        // @ts-expect-error TS2339
                        value={this.state.categoryTitle}
                        onChange={this.onCategoryTitleChange.bind(this)}
                        fullWidth
                    />
                    <TextField
                        // @ts-expect-error TS2339
                        label={this.props.polyglot.t(
                            // @ts-expect-error TS2339
                            this.props.thirdValue
                                ? 'tooltip_third_2'
                                : 'tooltip_value',
                        )}
                        // @ts-expect-error TS2339
                        value={this.state.valueTitle}
                        onChange={this.onValueTitleChange.bind(this)}
                        fullWidth
                    />
                    {thirdValue()}
                </Box>
            );
        }
    }

    /**
     * Return the html need to display by this component
     */
    render() {
        return (
            <Box mb={2} display="flex" width="100%">
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={this.onCheck}
                            // @ts-expect-error TS2339
                            checked={this.props.checked}
                        />
                    }
                    // @ts-expect-error TS2339
                    label={this.props.polyglot.t('toggle_tooltip')}
                />
                {this.createUserInterface()}
            </Box>
        );
    }
}

export default VegaToolTips;
