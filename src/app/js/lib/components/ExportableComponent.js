import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { CardTitle, CardActions } from 'material-ui/Card';
import { grey500 } from 'material-ui/styles/colors';

import convertHtmlToPng from '../convertHtmlToPng';

const styles = {
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    label: {
        color: grey500,
        flexGrow: 2,
        fontWeight: 'bold',
        fontSize: '2rem',
        textDecoration: 'none',
    },
};

class ExportableComponent extends Component {
    exportElement = () => {
        const element = ReactDOM.findDOMNode(this).childNodes[1]; //eslint-disable-line
        convertHtmlToPng(element).then(uri => {
            const link = document.createElement('a');
            link.download = this.props.label;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    render() {
        const { children, label } = this.props;
        return (
            <div>
                <CardTitle title={<span style={styles.label}>{label}</span>} />
                {children}
                <CardActions style={styles.actions}>
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
