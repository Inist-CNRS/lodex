import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Button, Drawer } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Clear';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    close: {
        alignSelf: 'flex-end',
    },
};

class LodexDrawer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    toggleOpen = () => this.setState({ open: !this.state.open });

    close = () => this.setState({ open: false });

    render() {
        const { children, label } = this.props;
        const { open } = this.state;
        return (
            <div>
                <Button variant="text" onClick={this.toggleOpen}>
                    {label}
                </Button>
                <Drawer open={open}>
                    {
                        <div style={styles.container}>
                            <IconButton
                                style={styles.close}
                                onClick={this.close}
                            >
                                <CloseIcon />
                            </IconButton>
                            {children}
                        </div>
                    }
                </Drawer>
            </div>
        );
    }
}

LodexDrawer.propTypes = {
    children: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
};

export default LodexDrawer;
