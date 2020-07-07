import { Vega } from 'react-vega';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isAdmin } from '../../../../user';

function CustomActionVega(props) {
    let actions;
    if (isAdmin(props.user)) {
        actions = {
            export: {
                svg: true,
                png: true,
            },
            source: true,
            compiled: true,
            editor: true,
        };
    } else {
        actions = {
            export: {
                svg: true,
                png: true,
            },
            source: false,
            compiled: false,
            editor: false,
        };
    }

    const spec = props.spec;
    spec.data = props.data;

    return (
        <Vega
            spec={JSON.parse(JSON.stringify(spec))}
            actions={actions}
            mode="vega"
        />
    );
}

CustomActionVega.propTypes = {
    user: PropTypes.any,
    spec: PropTypes.any.isRequired,
    data: PropTypes.any,
};

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(CustomActionVega);
