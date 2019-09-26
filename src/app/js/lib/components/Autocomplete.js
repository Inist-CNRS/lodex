/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { TextField, Menu, MenuItem, Divider, Popover } from '@material-ui/core';

const ENTER = 13;
const ESC = 27;
const DOWN = 40;

function getStyles(props, context, state) {
    const { anchorEl } = state;
    const { fullWidth } = props;

    const styles = {
        root: {
            display: 'inline-block',
            position: 'relative',
            width: fullWidth ? '100%' : 256,
        },
        menu: {
            width: '100%',
        },
        list: {
            display: 'block',
            width: fullWidth ? '100%' : 256,
        },
        innerDiv: {
            overflow: 'hidden',
        },
    };

    if (anchorEl && fullWidth) {
        styles.popover = {
            width: anchorEl.clientWidth,
        };
    }

    return styles;
}

class Autocomplete extends Component {
    static defaultProps = {
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
        },
        animated: true,
        dataSourceConfig: {
            text: 'text',
            value: 'value',
        },
        disableFocusRipple: true,
        filter: (searchText, key) =>
            searchText !== '' && key.indexOf(searchText) !== -1,
        fullWidth: false,
        open: false,
        openOnFocus: false,
        onUpdateInput: () => {},
        onNewRequest: () => {},
        menuCloseDelay: 300,
        targetOrigin: {
            vertical: 'top',
            horizontal: 'left',
        },
    };

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    };

    state = {
        anchorEl: null,
        focusTextField: true,
        open: false,
        searchText: undefined,
    };

    UNSAFE_componentWillMount() {
        this.requestsList = [];
        this.setState({
            open: this.props.open,
            searchText: this.props.searchText || '',
        });
        this.timerClickCloseId = null;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.searchText !== nextProps.searchText) {
            this.setState({
                searchText: nextProps.searchText,
            });
        }
        if (this.props.open !== nextProps.open) {
            this.setState({
                open: nextProps.open,
                anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
            });
        }
    }

    UNSAFE_componentWillUnmount() {
        clearTimeout(this.timerClickCloseId);
        clearTimeout(this.timerBlurClose);
    }

    close() {
        this.setState({
            open: false,
            anchorEl: null,
        });

        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    handleRequestClose = () => {
        // Only take into account the Popover clickAway when we are
        // not focusing the TextField.
        if (!this.state.focusTextField) {
            this.close();
        }
    };

    handleMouseDown = event => {
        // Keep the TextField focused
        event.preventDefault();
    };

    handleItemClick = (event, child) => {
        const dataSource = this.props.dataSource;
        const index = parseInt(child.key, 10);
        const chosenRequest = dataSource[index];
        const searchText = this.chosenRequestText(chosenRequest);

        const updateInput = () =>
            this.props.onUpdateInput(searchText, this.props.dataSource, {
                source: 'click',
            });
        this.timerClickCloseId = () =>
            setTimeout(() => {
                this.timerClickCloseId = null;
                this.close();
                this.props.onNewRequest(chosenRequest, index);
            }, this.props.menuCloseDelay);

        if (typeof this.props.searchText !== 'undefined') {
            updateInput();
            this.timerClickCloseId();
        } else {
            this.setState(
                {
                    searchText: searchText,
                },
                () => {
                    updateInput();
                    this.timerClickCloseId();
                },
            );
        }
    };

    chosenRequestText = chosenRequest => {
        if (typeof chosenRequest === 'string') {
            return chosenRequest;
        } else {
            return chosenRequest[this.props.dataSourceConfig.text];
        }
    };

    handleEscKeyDown = () => {
        this.close();
    };

    handleKeyDown = event => {
        if (this.props.onKeyDown) this.props.onKeyDown(event);

        let key;
        if (event.key !== undefined) {
            key = event.key;
        } else if (event.keyCode !== undefined) {
            key = event.keyCode;
        } else {
            return;
        }

        switch (key) {
            case ENTER:
                this.close();
                const searchText = this.state.searchText;
                if (searchText !== '') {
                    this.props.onNewRequest(searchText, -1);
                }
                break;

            case ESC:
                this.close();
                break;

            case DOWN:
                event.preventDefault();
                this.setState({
                    open: true,
                    focusTextField: false,
                    anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
                });
                break;

            default:
                break;
        }
    };

    handleChange = event => {
        const searchText = event.target.value;

        // Make sure that we have a new searchText.
        // Fix an issue with a Cordova Webview
        if (searchText === this.state.searchText) {
            return;
        }

        const state = {
            open: true,
            anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
        };

        if (this.props.searchText === undefined) {
            state.searchText = searchText;
        }

        this.setState(state);

        this.props.onUpdateInput(searchText, this.props.dataSource, {
            source: 'change',
        });
    };

    handleBlur = event => {
        if (this.state.focusTextField && this.timerClickCloseId === null) {
            this.timerBlurClose = setTimeout(() => {
                this.close();
            }, 0);
        }

        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    };

    handleFocus = event => {
        if (!this.state.open && this.props.openOnFocus) {
            this.setState({
                open: true,
                anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
            });
        }

        this.setState({
            focusTextField: true,
        });

        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    };

    blur() {
        this.refs.searchTextField.blur();
    }

    focus() {
        this.refs.searchTextField.focus();
    }

    render() {
        const {
            anchorOrigin,
            animated,
            dataSource,
            dataSourceConfig,
            disableFocusRipple,
            errorStyle,
            label,
            filter,
            fullWidth,
            style,
            maxSearchResults,
            menuCloseDelay,
            textFieldStyle,
            menuStyle,
            menuProps,
            listStyle,
            targetOrigin,
            onBlur,
            onClose,
            onFocus,
            onKeyDown,
            onNewRequest,
            onUpdateInput,
            openOnFocus,
            popoverProps,
            searchText: searchTextProp,
            ...other
        } = this.props;

        const { style: popoverStyle, ...popoverOther } = popoverProps || {};

        const { open, anchorEl, searchText, focusTextField } = this.state;

        const { prepareStyles } = this.context.muiTheme;
        const styles = getStyles(this.props, this.context, this.state);

        const requestsList = [];

        dataSource.every((item, index) => {
            switch (typeof item) {
                case 'string':
                    if (filter(searchText, item, item)) {
                        requestsList.push({
                            text: item,
                            value: (
                                <MenuItem
                                    innerDivStyle={styles.innerDiv}
                                    value={item}
                                    disableFocusRipple={disableFocusRipple}
                                    key={index}
                                    >
                                    {item}
                                </MenuItem>
                            ),
                        });
                    }
                    break;

                case 'object':
                    if (
                        item &&
                        typeof item[this.props.dataSourceConfig.text] ===
                            'string'
                    ) {
                        const itemText = item[this.props.dataSourceConfig.text];
                        if (!this.props.filter(searchText, itemText, item))
                            break;

                        const itemValue =
                            item[this.props.dataSourceConfig.value];
                        if (
                            itemValue &&
                            itemValue.type &&
                            (itemValue.type.muiName === MenuItem.muiName ||
                                itemValue.type.muiName === Divider.muiName)
                        ) {
                            requestsList.push({
                                text: itemText,
                                value: React.cloneElement(itemValue, {
                                    key: index,
                                    disableFocusRipple: disableFocusRipple,
                                }),
                            });
                        } else {
                            requestsList.push({
                                text: itemText,
                                value: (
                                    <MenuItem
                                        innerDivStyle={styles.innerDiv}
                                        disableFocusRipple={disableFocusRipple}
                                        key={index}
                                        >
                                        {itemText}
                                        </MenuItem>

                                ),
                            });
                        }
                    }
                    break;

                default:
                // Do nothing
            }

            return !(
                maxSearchResults &&
                maxSearchResults > 0 &&
                requestsList.length === maxSearchResults
            );
        });

        this.requestsList = requestsList;

        const menu = open && requestsList.length > 0 && (
            <Menu
                ref="menu"
                autoWidth={false}
                disableAutoFocus={focusTextField}
                onEscKeyDown={this.handleEscKeyDown}
                initiallyKeyboardFocused={true}
                onItemClick={this.handleItemClick}
                onMouseDown={this.handleMouseDown}
                style={Object.assign(styles.menu, menuStyle)}
                listStyle={Object.assign(styles.list, listStyle)}
                {...menuProps}
            >
                {requestsList.map(i => i.value)}
            </Menu>
        );

        return (
            <div style={prepareStyles(Object.assign(styles.root, style))}>
                <TextField
                    ref="searchTextField"
                    autoComplete="off"
                    onBlur={this.handleBlur}
                    onFocus={this.handleFocus}
                    onKeyDown={this.handleKeyDown}
                    label={label}
                    fullWidth={fullWidth}
                    multiLine={false}
                    errorStyle={errorStyle}
                    style={textFieldStyle}
                    {...other}
                    // value and onChange are idiomatic properties often leaked.
                    // We prevent their overrides in order to reduce potential bugs.
                    value={searchText}
                    onChange={this.handleChange}
                />
                <Popover
                    style={Object.assign({}, styles.popover, popoverStyle)}
                    canAutoPosition={false}
                    anchorOrigin={anchorOrigin}
                    targetOrigin={targetOrigin}
                    open={open}
                    anchorEl={anchorEl}
                    useLayerForClickAway={false}
                    onRequestClose={this.handleRequestClose}
                    animated={animated}
                    {...popoverOther}
                >
                    {menu}
                </Popover>
            </div>
        );
    }
}

Autocomplete.levenshteinDistance = (searchText, key) => {
    const current = [];
    let prev;
    let value;

    for (let i = 0; i <= key.length; i++) {
        for (let j = 0; j <= searchText.length; j++) {
            if (i && j) {
                if (searchText.charAt(j - 1) === key.charAt(i - 1))
                    value = prev;
                else value = Math.min(current[j], current[j - 1], prev) + 1;
            } else {
                value = i + j;
            }
            prev = current[j];
            current[j] = value;
        }
    }
    return current.pop();
};

Autocomplete.noFilter = () => true;

Autocomplete.defaultFilter = Autocomplete.caseSensitiveFilter = (
    searchText,
    key,
) => {
    return searchText !== '' && key.indexOf(searchText) !== -1;
};

Autocomplete.caseInsensitiveFilter = (searchText, key) => {
    return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
};

Autocomplete.levenshteinDistanceFilter = distanceLessThan => {
    if (distanceLessThan === undefined) {
        return Autocomplete.levenshteinDistance;
    } else if (typeof distanceLessThan !== 'number') {
        throw 'Error: Autocomplete.levenshteinDistanceFilter is a filter generator, not a filter!';
    }

    return (s, k) => Autocomplete.levenshteinDistance(s, k) < distanceLessThan;
};

Autocomplete.fuzzyFilter = (searchText, key) => {
    const compareString = key.toLowerCase();
    searchText = searchText.toLowerCase();

    let searchTextIndex = 0;
    for (let index = 0; index < key.length; index++) {
        if (compareString[index] === searchText[searchTextIndex]) {
            searchTextIndex += 1;
        }
    }

    return searchTextIndex === searchText.length;
};

Autocomplete.Item = MenuItem;
Autocomplete.Divider = Divider;

export default Autocomplete;
