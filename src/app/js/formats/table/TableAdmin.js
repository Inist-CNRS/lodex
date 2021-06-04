import React, { Component } from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';
import { TextField } from '@material-ui/core';

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
};

export const defaultArgs = {
    pageSize: 6,
    params: {
        maxSize: 6,
        orderBy: 'value/asc',
    },
};

class TableAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            pageSize: PropTypes.number,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setParams = params => updateAdminArgs('params', params, this.props);

    setPageSize = e => {
        this.props.onChange({
            ...this.props.args,
            pageSize: parseInt(e.target.value, 10),
        });
    };

    render() {
        const {
            p: polyglot,
            args: { params, pageSize },
        } = this.props;
        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={this.setParams}
                    polyglot={polyglot}
                    showMaxSize={true}
                    showMaxValue={false}
                    showMinValue={false}
                    showOrderBy={false}
                />
                <TextField
                    label={polyglot.t('items_per_page')}
                    onChange={this.setPageSize}
                    style={styles.input}
                    value={pageSize}
                    type="number"
                />
            </div>
        );
    }
}

export default translate(TableAdmin);
