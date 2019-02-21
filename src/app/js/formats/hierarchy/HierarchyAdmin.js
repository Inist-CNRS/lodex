import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

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
};

export const defaultArgs = {
    params: {
        maxSize: 5000,
    },
};

class HierarchyAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            maxSize: PropTypes.number,
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

    render() {
        const { p: polyglot, args: { params } } = this.props;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={this.setParams}
                />
            </div>
        );
    }
}

export default translate(HierarchyAdmin);
