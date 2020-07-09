import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, TextField } from 'material-ui';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const styles = {
    input: {
        width: '100%',
    },
};

class ToolTips extends Component {
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
