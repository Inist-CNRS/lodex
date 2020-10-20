import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
    Select,
    MenuItem,
    Button,
    TextField,
} from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { uploadFile, changeUploadUrl, changeParserName, uploadUrl } from './';
import { fromUpload, fromLoaders } from '../selectors';

const styles = {
    button: {
        marginLeft: 4,
        marginRight: 4,
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
    divider: {
        display: 'flex',
        margin: '10px',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dividerLabel: {
        margin: '1rem',
    },
    dividerHr: {
        flexGrow: 2,
        marginLeft: '1rem',
        marginRight: '1rem',
    },
};

export const UploadDialogComponent = ({
    url,
    parserName,
    isUrlValid,
    onChangeUrl,
    onChangeParserName,
    onFileLoad,
    onUrlUpload,
    p: polyglot,
    loaders,
}) => {
    const parserNames = loaders
        .map(loader => loader.name)
        .sort((x, y) => polyglot.t(x).localeCompare(polyglot.t(y)))
        .map(pn => (
            <MenuItem key={pn} value={pn}>
                {polyglot.t(pn)}
            </MenuItem>
        ));

    return (
        <div>
            <Stepper linear={false} orientation="vertical">
                <Step active>
                    <StepLabel>{polyglot.t('select_parser')}</StepLabel>
                    <StepContent>
                        <Select
                            label={polyglot.t('parser_name')}
                            value={parserName}
                            onChange={onChangeParserName}
                            fullWidth
                        >
                            <MenuItem key={'automatic'} value={'automatic'}>
                                {polyglot.t('automatic-parser')}
                            </MenuItem>
                            {parserNames}
                        </Select>
                    </StepContent>
                </Step>
                <Step active>
                    <StepLabel>{polyglot.t('select_file')}</StepLabel>
                    <StepContent>
                        <Button
                            variant="contained"
                            className="btn-upload-dataset"
                            component="label"
                            color="primary"
                            fullWidth
                            style={styles.button}
                        >
                            {polyglot.t('upload_file')}
                            <input
                                name="file"
                                type="file"
                                onChange={onFileLoad}
                                style={styles.input}
                            />
                        </Button>
                        <div style={styles.divider}>
                            <hr style={styles.dividerHr} />
                            <div style={styles.dividerLabel}>
                                {polyglot.t('or')}
                            </div>
                            <hr style={styles.dividerHr} />
                        </div>
                        <div>
                            <TextField
                                fullWidth
                                value={url}
                                onChange={onChangeUrl}
                                error={
                                    url &&
                                    !isUrlValid &&
                                    polyglot.t('invalid_url')
                                }
                                placeholder="URL"
                            />
                            <Button
                                variant="contained"
                                onClick={onUrlUpload}
                                disabled={!isUrlValid}
                                className="btn-upload-url"
                                component="label"
                                color="primary"
                                fullWidth
                                style={styles.button}
                            >
                                {polyglot.t('upload_url')}
                            </Button>
                        </div>
                    </StepContent>
                </Step>
            </Stepper>
        </div>
    );
};

UploadDialogComponent.propTypes = {
    url: PropTypes.string.isRequired,
    parserName: PropTypes.string.isRequired,
    isUrlValid: PropTypes.bool,
    onChangeUrl: PropTypes.func.isRequired,
    onFileLoad: PropTypes.func.isRequired,
    onUrlUpload: PropTypes.func.isRequired,
    onChangeParserName: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

UploadDialogComponent.defaultProps = {
    isUrlValid: true,
};

const mapStateToProps = state => ({
    url: fromUpload.getUrl(state),
    isUrlValid: fromUpload.isUrlValid(state),
    parserName: fromUpload.getParserName(state),
    loaders: fromLoaders.getLoaders(state),
});

const mapDispatchToProps = {
    onUrlUpload: uploadUrl,
    onFileLoad: e => uploadFile(e.target.files[0]),
    onChangeUrl: e => changeUploadUrl(e.target.value),
    onChangeParserName: (_, idx, val) => changeParserName(val),
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(UploadDialogComponent);
