import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { CardTitle, CardActions } from 'material-ui/Card';
import { grey500, red500 } from 'material-ui/styles/colors';

import convertHtmlToPng from '../convertHtmlToPng';

const styles = {
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    label: {
        color: grey500,
        flexGrow: 2,
        fontWeight: 'bold',
        fontSize: '2rem',
        textDecoration: 'none',
    },
    error: {
        color: red500,
        alignSelf: 'flex-end',
    },
};

class ExportableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    exportElement = () => {
        this.setState({ error: null });
        convertHtmlToPng(this.element)
            .then(uri => {
                const link = document.createElement('a');
                link.download = this.props.label;
                link.href = uri;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                this.setState({
                    error:
                        'We encountered an error while trying to export this chart.',
                });
                console.error(error.message);
            });
    };

    render() {
        const { children, label } = this.props;
        const { error } = this.state;
        return (
            <div>
                <CardTitle title={<span style={styles.label}>{label}</span>} />
                <div
                    ref={element => {
                        this.element = element;
                    }}
                >
                    {children}
                </div>
                <CardActions style={styles.actions}>
                    {error && <p style={styles.error}>{error}</p>}
                    <FlatButton
                        primary
                        style={styles.button}
                        onClick={this.exportElement}
                    >
                        SAVE AS PNG
                    </FlatButton>
                </CardActions>
            </div>
        );
    }
}

ExportableComponent.propTypes = {
    children: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
};

export default ExportableComponent;
