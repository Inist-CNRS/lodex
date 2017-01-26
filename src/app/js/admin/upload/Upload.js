import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import ArchiveIcon from 'material-ui/svg-icons/content/archive';
import Alert from '../../lib/Alert';

import { uploadFile } from './';

const styles = {
    div: {
        position: 'relative',
        margin: 100,
    },
    RaisedButton: {
        width: 500,
        height: 200,
        color: 'white',
    },
    input: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        width: '100%',
        cursor: 'pointer',
    },
};

export const UploadComponent = ({ onFileLoad, error }) => (
    <div
        className="upload"
        style={styles.div}
    >
        { error ? <Alert>
            <p>Error uploading given file: </p>
            <p>{error}</p>
        </Alert> : <span />}
        <RaisedButton
            containerElement="label"
            secondary
            style={styles.RaisedButton}
            icon={<ArchiveIcon />}
        >
            <input
                name="file"
                type="file"
                onChange={e => onFileLoad(e.target.files[0])}
                style={styles.input}
            />
            Import file
        </RaisedButton>
    </div>
);

UploadComponent.propTypes = {
    error: PropTypes.string.isRequired,
    onFileLoad: PropTypes.func.isRequired,
};

const mapsStateToProps = ({ upload }) => upload;

const mapDispatchToProps = {
    onFileLoad: uploadFile,
};

export default connect(mapsStateToProps, mapDispatchToProps)(UploadComponent);
