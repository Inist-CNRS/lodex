import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';

import { uploadFile } from './homeActions';

export const UploadComponent = ({ onFileLoad }) => (
    <FlatButton
        containerElement="label"
    >
        <input
            type="file"
            onChange={e => onFileLoad(e.target.files[0])}
        />
    </FlatButton>
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
