import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, TextField } from 'material-ui';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    input: {
        width: '100%',
    },
};

/**
 * React component use for edit the tooltip
 */
class ToolTips extends Component {
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
    constructor(props) {
        super(props);
        this.onCheck = this.onCheck.bind(this);
        this.state = {
            checked: this.props.checked,
            categoryTitle: this.props.categoryTitle,
            valueTitle: this.props.valueTitle,
            thirdValueTitle:
                this.props.thirdValueTitle === undefined
                    ? ''
                    : this.props.thirdValueTitle,
        };
    }

    /**
     * Update the view and the states when the checkbox change
     * @param e event of the checkbox
     */
    onCheck(e) {
        const target = e.target;
        this.setState({
            checked: target.checked,
            categoryTitle: this.state.categoryTitle,
            valueTitle: this.state.valueTitle,
            thirdValueTitle: this.state.thirdValueTitle,
        });
        this.props.onChange(target.checked);
    }

    /**
     * Update the view and the states when the text field corresponding to the category change
     * @param e event of the text field
     */
    onCategoryTitleChange(e) {
        const target = e.target;
        this.setState({
            checked: this.state.checked,
            categoryTitle: target.value,
            valueTitle: this.state.valueTitle,
            thirdValueTitle: this.state.thirdValueTitle,
        });
        this.props.onCategoryTitleChange(target.value);
    }

    /**
     * Update the view and the states when the text field corresponding to the value change
     * @param e event of the text field
     */
    onValueTitleChange(e) {
        const target = e.target;
        this.setState({
            checked: this.state.checked,
            categoryTitle: this.state.categoryTitle,
            valueTitle: target.value,
            thirdValueTitle: this.state.thirdValueTitle,
        });
        this.props.onValueTitleChange(target.value);
    }

    /**
     * Update the view and the states when the text field corresponding to the ThirdValue change
     * @param e event of the text field
     */
    onThirdValueChange(e) {
        const target = e.target;
        this.setState({
            checked: this.state.checked,
            categoryTitle: this.state.categoryTitle,
            valueTitle: this.state.valueTitle,
            thirdValueTitle: target.value,
        });
        this.props.onThirdValueChange(target.value);
    }

    /**
     * Function use to make the view more dynamic (if checkbox is checked then display the text field)
     * @returns {*} Html corresponding to the text field
     */
    createUserInterface() {
        const checked = this.state.checked;

        const thirdValue = () => {
            if (this.props.thirdValue) {
                return (
                    <TextField
                        floatingLabelText={this.props.polyglot.t(
                            'tooltip_third_3',
                        )}
                        value={this.state.thirdValueTitle}
                        onChange={this.onThirdValueChange.bind(this)}
                        style={styles.input}
                    />
                );
            }
        };

        if (checked) {
            return (
                <div>
                    <TextField
                        floatingLabelText={this.props.polyglot.t(
                            this.props.thirdValue
                                ? 'tooltip_third_1'
                                : 'tooltip_category',
                        )}
                        value={this.state.categoryTitle}
                        onChange={this.onCategoryTitleChange.bind(this)}
                        style={styles.input}
                    />
                    <TextField
                        floatingLabelText={this.props.polyglot.t(
                            this.props.thirdValue
                                ? 'tooltip_third_2'
                                : 'tooltip_value',
                        )}
                        value={this.state.valueTitle}
                        onChange={this.onValueTitleChange.bind(this)}
                        style={styles.input}
                    />
                    {thirdValue()}
                </div>
            );
        }
    }

    /**
     * Return the html need to display by this component
     */
    render() {
        return (
            <>
                <Checkbox
                    label={this.props.polyglot.t('toggle_tooltip')}
                    onCheck={this.onCheck}
                    checked={this.props.checked}
                />
                {this.createUserInterface()}
            </>
        );
    }
}

export default ToolTips;
