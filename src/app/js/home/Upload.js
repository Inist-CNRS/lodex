import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import ArchiveIcon from 'material-ui/svg-icons/content/archive';

import { uploadFile } from './homeActions';

export const UploadComponent = ({ onFileLoad }) => (
    <div
        style={{
            position: 'relative',
            margin: 100,
        }}
    >
        <RaisedButton
            containerElement="label"
            secondary
            style={{
                width: 500,
                height: 200,
                color: 'white',
            }}
            icon={<ArchiveIcon />}
        >
            <input
                type="file"
                onChange={e => onFileLoad(e.target.files[0])}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                    width: '100%',
                    cursor: 'pointer',
                }}
            />
            Import file
        </RaisedButton>
    </div>
);

UploadComponent.propTypes = {
    onFileLoad: PropTypes.func.isRequired,
};

const mapsStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
bindActionCreators({
    onFileLoad: uploadFile,
}, dispatch);

export default connect(mapsStateToProps, mapDispatchToProps)(UploadComponent);
