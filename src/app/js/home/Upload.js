import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { uploadFile } from './homeActions';

import FlatButton from 'material-ui/FlatButton';

export const Upload = ({ onFileLoad }) => (
    <FlatButton
        containerElement='label'
    >
        <input
            type="file"
            onChange={(e) => onFileLoad(e.target.files[0])}
            ref="file-input"
        />
    </FlatButton>
);

const mapsStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) =>
bindActionCreators({
    onFileLoad: uploadFile,
}, dispatch);

export default connect(mapsStateToProps, mapDispatchToProps)(Upload);
