import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { LinearProgress } from '@material-ui/core';

import { loadParsingResult as loadParsingResultAction } from './parsing';
import { loadPublication as loadPublicationAction } from './publication';
import { loadSubresources as loadSubresourcesAction } from './subresource';
import { fromParsing, fromPublication, fromSubresources } from './selectors';

export const withInitialDataHoc = BaseComponent =>
    class HocComponent extends Component {
        static propTypes = {
            loadParsingResult: PropTypes.func.isRequired,
            loadPublication: PropTypes.func.isRequired,
            loadSubresources: PropTypes.func.isRequired,
            isLoading: PropTypes.bool.isRequired,
        };

        UNSAFE_componentWillMount() {
            this.props.loadPublication();
            this.props.loadParsingResult();
            this.props.loadSubresources();
        }

        render() {
            const {
                loadPublication,
                loadParsingResult,
                isLoading,
                ...props
            } = this.props;

            if (isLoading) {
                return <LinearProgress />;
            }

            return <BaseComponent {...props} />;
        }
    };

export default BaseComponent => {
    const mapDispatchToProps = {
        loadParsingResult: loadParsingResultAction,
        loadPublication: loadPublicationAction,
        loadSubresources: loadSubresourcesAction,
    };

    const mapStateToProps = state => ({
        isLoading:
            fromParsing.isParsingLoading(state) ||
            fromPublication.isPublicationLoading(state) ||
            fromSubresources.isLoading(state),
    });

    return compose(
        connect(mapStateToProps, mapDispatchToProps),
        translate,
    )(withInitialDataHoc(BaseComponent));
};
