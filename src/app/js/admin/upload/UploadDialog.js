import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import Step from '@material-ui/core/Step';
import Stepper from '@material-ui/core/Stepper';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { uploadFile, changeUploadUrl, changeParserName, uploadUrl } from './';
import { fromUpload, fromLoaders } from '../selectors';

const styles = {
    button: {
        marginLeft: 4,
        marginRight: 4,
    },
    input: {
        display: 'none',
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
            <MenuItem key={pn} value={pn} primaryText={polyglot.t(pn)} />
        ));

    return (
        <div>
            <Stepper linear={false} orientation="vertical">
                <Step active>
                    <StepLabel>{polyglot.t('select_parser')}</StepLabel>
                    <StepContent>
                        <Select
                            name={polyglot.t('parser_name')}
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
                        <input
                            accept="*"
                            id="btn-upload-dataset"
                            type="file"
                            onChange={onFileLoad}
                            style={styles.input}
                        />
                        <label htmlFor="btn-upload-dataset">
                            <Button
                                variant="raised"
                                component="span"
                                style={styles.button}
                            >
                                {polyglot.t('upload_file')}
                            </Button>
                        </label>
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
                                errorText={
                                    url &&
                                    !isUrlValid &&
                                    polyglot.t('invalid_url')
                                }
                                hintText="URL"
                            />
                            <Button
                                onClick={onUrlUpload}
                                disabled={!isUrlValid}
                                className="btn-upload-url"
                                component="label"
                                variant="raised"
                                primary
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
    loaders: PropTypes.array,
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
    onChangeUrl: (_, value) => changeUploadUrl(value),
    onChangeParserName: (_, idx, val) => changeParserName(val),
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(UploadDialogComponent);
