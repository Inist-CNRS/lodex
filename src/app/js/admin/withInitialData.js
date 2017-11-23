import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { loadField as loadFieldAction } from '../fields';
import { loadParsingResult as loadParsingResultAction } from './parsing';
import { loadPublication as loadPublicationAction } from './publication';

export const withInitialDataHoc = BaseComponent =>
    class HocComponent extends Component {
        static propTypes = {
            loadParsingResult: PropTypes.func.isRequired,
            loadPublication: PropTypes.func.isRequired,
            loadField: PropTypes.func.isRequired,
        };

        componentWillMount() {
            this.props.loadPublication();
            this.props.loadParsingResult();
            this.props.loadField();
        }

        render() {
            const { loadPublication, loadParsingResult, ...props } = this.props;

            return <BaseComponent {...props} />;
        }
    };

export default BaseComponent => {
    const mapDispatchToProps = {
        loadParsingResult: loadParsingResultAction,
        loadPublication: loadPublicationAction,
        loadField: loadFieldAction,
    };

    return compose(connect(undefined, mapDispatchToProps), translate)(
        withInitialDataHoc(BaseComponent),
    );
};
