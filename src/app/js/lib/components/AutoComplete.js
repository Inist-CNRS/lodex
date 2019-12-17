// Source https://raw.githubusercontent.com/mui-org/material-ui/v0.20.2/src/AutoComplete/AutoComplete.js
/*
  eslint-disable
    react/prop-types,
    react/no-find-dom-node,
    react/no-string-refs,
    no-case-declarations
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import keycode from 'keycode';
import TextField from '@material-ui/core/TextField';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover/Popover';

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

class AutoComplete extends Component {
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

        switch (keycode(event)) {
            case 'enter':
                this.close();
                const searchText = this.state.searchText;
                if (searchText !== '') {
                    this.props.onNewRequest(searchText, -1);
                }
                break;

            case 'esc':
                this.close();
                break;

            case 'down':
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
            animation,
            dataSource,
            dataSourceConfig, // eslint-disable-line no-unused-vars
            disableFocusRipple,
            errorStyle,
            floatingLabelText,
            filter,
            fullWidth,
            style,
            hintText,
            maxSearchResults,
            menuCloseDelay, // eslint-disable-line no-unused-vars
            textFieldStyle,
            menuStyle,
            menuProps,
            listStyle,
            targetOrigin,
            onBlur, // eslint-disable-line no-unused-vars
            onClose, // eslint-disable-line no-unused-vars
            onFocus, // eslint-disable-line no-unused-vars
            onKeyDown, // eslint-disable-line no-unused-vars
            onNewRequest, // eslint-disable-line no-unused-vars
            onUpdateInput, // eslint-disable-line no-unused-vars
            openOnFocus, // eslint-disable-line no-unused-vars
            popoverProps,
            searchText: searchTextProp, // eslint-disable-line no-unused-vars
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
                                    primaryText={item}
                                    disableFocusRipple={disableFocusRipple}
                                    key={index}
                                />
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
                                        primaryText={itemText}
                                        disableFocusRipple={disableFocusRipple}
                                        key={index}
                                    />
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
                    floatingLabelText={floatingLabelText}
                    hintText={hintText}
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
                    animation={animation}
                    {...popoverOther}
                >
                    {menu}
                </Popover>
            </div>
        );
    }
}

AutoComplete.levenshteinDistance = (searchText, key) => {
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

AutoComplete.noFilter = () => true;

AutoComplete.defaultFilter = AutoComplete.caseSensitiveFilter = (
    searchText,
    key,
) => {
    return searchText !== '' && key.indexOf(searchText) !== -1;
};

AutoComplete.caseInsensitiveFilter = (searchText, key) => {
    return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
};

AutoComplete.levenshteinDistanceFilter = distanceLessThan => {
    if (distanceLessThan === undefined) {
        return AutoComplete.levenshteinDistance;
    } else if (typeof distanceLessThan !== 'number') {
        throw 'Error: AutoComplete.levenshteinDistanceFilter is a filter generator, not a filter!';
    }

    return (s, k) => AutoComplete.levenshteinDistance(s, k) < distanceLessThan;
};

AutoComplete.fuzzyFilter = (searchText, key) => {
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

AutoComplete.Item = MenuItem;
AutoComplete.Divider = Divider;

export default AutoComplete;
