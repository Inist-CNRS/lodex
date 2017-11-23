import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import ActionDescription from 'material-ui/svg-icons/action/description';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';

import FloatingActionButton from '../lib/components/FloatingActionButton';
import { fromFields } from '../sharedSelectors';
import { polyglot as polyglotPropTypes } from '../propTypes';

const styles = {
    actionButton: onBack => ({
        marginRight: 16,
        zIndex: onBack ? 0 : 2400,
    }),
    popover: {
        background: 'none',
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 8,
    },
    button: {
        marginBottom: 8,
    },
    icon: {
        color: 'white',
        height: 56,
        lineHeight: 56,
    },
};

export class ActionButtonComponent extends Component {
    static propTypes = {
        editedColumn: PropTypes.object, // eslint-disable-line
        onAddNewColumn: PropTypes.func.isRequired,
        onHideExistingColumns: PropTypes.func.isRequired,
        onShowExistingColumns: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            showPopover: false,
            showCancel: false,
            showExistingColumns: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editedColumn) {
            const currentEditedColumnName = this.props.editedColumn
                ? this.props.editedColumn.name
                : undefined;
            if (nextProps.editedColumn.name !== currentEditedColumnName) {
                this.setState(
                    {
                        showPopover: false,
                        showCancel: false,
                        showExistingColumns: false,
                    },
                    () => {
                        this.props.onHideExistingColumns();
                    },
                );
            }
        }
    }

    storeAnchorRef = node => {
        this.anchor = node;
    };

    handleAddNewColumn = () => {
        this.setState(
            {
                showPopover: false,
                showCancel: false,
            },
            () => {
                this.props.onHideExistingColumns();
                this.props.onAddNewColumn();
            },
        );
    };

    handleShowExistingColumns = () => {
        this.setState(
            {
                showPopover: !this.state.showPopover,
                showCancel: true,
                showExistingColumns: true,
            },
            () => {
                this.props.onShowExistingColumns();
            },
        );
    };

    handleClick = () => {
        this.setState(
            {
                showPopover: this.state.showExistingColumns
                    ? false
                    : !this.state.showPopover,
                showCancel: this.state.showExistingColumns
                    ? false
                    : !this.state.showCancel,
            },
            () => {
                if (!this.state.showPopover) {
                    this.setState({ showExistingColumns: false });
                    this.props.onHideExistingColumns();
                }
            },
        );
    };

    render() {
        const { p: polyglot } = this.props;
        const { showPopover, showCancel } = this.state;

        const tooltip = showCancel ? 'Cancel' : 'Add a column';
        return (
            <FloatingActionButton
                className="btn-add-column"
                tooltip={tooltip}
                onClick={this.handleClick}
                style={styles.actionButton(!showPopover)}
            >
                <Popover
                    open={showPopover}
                    animation={PopoverAnimationVertical}
                    anchorEl={this.anchor}
                    anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
                    autoCloseWhenOffScreen={false}
                    targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
                    onRequestClose={this.handleClick}
                    style={styles.popover}
                >
                    <FloatingActionButton
                        className="btn-add-column-from-dataset"
                        onClick={this.handleShowExistingColumns}
                        style={styles.button}
                        tooltip={polyglot.t('add_column_from_original_dataset')}
                    >
                        <ActionDescription />
                    </FloatingActionButton>

                    <FloatingActionButton
                        className="btn-add-free-column"
                        label={polyglot.t('add_column')}
                        onClick={this.handleAddNewColumn}
                        style={styles.button}
                        tooltip="Add a new column"
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                </Popover>
                <div ref={this.storeAnchorRef}>
                    {!showCancel && <ContentAdd style={styles.icon} />}
                    {showCancel && <ContentClear style={styles.icon} />}
                </div>
            </FloatingActionButton>
        );
    }
}

const mapStateToProps = state => ({
    editedColumn: fromFields.getEditedField(state),
});

export default compose(connect(mapStateToProps), translate)(
    ActionButtonComponent,
);
