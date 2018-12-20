import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
    previewDefaultColor: color => ({
        display: 'inline-block',
        backgroundColor: color,
        height: '1em',
        width: '1em',
        marginLeft: 5,
        border: 'solid 1px black',
    }),
};

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    specTemplate: '{}',
};

class VegaLiteAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            specTemplate: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setParams = params => {
        updateAdminArgs('params', params, this.props);
    };

    setNodeColor = (_, specTemplate) => {
        updateAdminArgs('specTemplate', specTemplate, this.props);
    };

    render() {
        const {
            p: polyglot,
            args: { params },
        } = this.props;
        const { specTemplate } = this.props.args;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={this.setParams}
                />
                <TextField
                    floatingLabelText={
                        <span>
                            {polyglot.t('node_color')}
                            <span
                                style={styles.previewDefaultColor(specTemplate)}
                            />
                        </span>
                    }
                    onChange={this.setNodeColor}
                    style={styles.input}
                    value={specTemplate}
                />
            </div>
        );
    }
}

export default translate(VegaLiteAdmin);
