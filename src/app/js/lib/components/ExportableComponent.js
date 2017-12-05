import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FileDownLoad from 'material-ui/svg-icons/file/file-download';

import convertHtmlToPng from '../convertHtmlToPng';

const styles = {
    button: {
        position: 'relative',
        top: '5px',
        right: '10px',
    },
    container: {
        position: 'relative',
    },
};

class ExportableComponent extends Component {
    exportElement = () => {
        convertHtmlToPng(this.element).then(uri => {
            const link = document.createElement('a');
            link.download = this.props.label;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    componentDidMount() {
        this.element = ReactDOM.findDOMNode(this).childNodes[0]; //eslint-disable-line
    }

    render() {
        const { children } = this.props;
        return (
            <div style={styles.container}>
                {children}
                <FloatingActionButton
                    style={styles.button}
                    onClick={this.exportElement}
                    mini
                >
                    <FileDownLoad />
                </FloatingActionButton>
            </div>
        );
    }
}

ExportableComponent.propTypes = {
    children: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
};

export default ExportableComponent;
