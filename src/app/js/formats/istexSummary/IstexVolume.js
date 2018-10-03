import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import Folder from 'material-ui/svg-icons/file/folder';
import translate from 'redux-polyglot/translate';

import { ISTEX_API_URL } from '../../../../common/externals';
import fetch from '../../lib/fetch';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Alert from '../../lib/components/Alert';

export const getIssueUrl = ({ issn, year, volume }) => {
    return `${ISTEX_API_URL}/?q=(${encodeURIComponent(
        `host.issn="${issn}" AND publicationDate:"${year}" AND host.volume:"${
            volume
        }"`,
    )})&facet=host.issue[*-*:1]&size=0&output=*`;
};

const styles = {
    li: {
        listStyleType: 'none',
    },
};

export class IstexVolumeComponent extends Component {
    state = {
        data: null,
        error: null,
        isLoading: false,
        isOpen: false,
    };

    open = async () => {
        this.setState({
            isOpen: true,
        });

        if (!this.state.data) {
            const url = getIssueUrl(this.props);
            this.setState({ isLoading: true });
            await fetch({ url }).then(({ response, error }) => {
                if (error) {
                    console.error(error);
                    this.setState({
                        isLoading: false,
                        error: true,
                    });
                    return;
                }

                this.setState({
                    data: response,
                    isLoading: false,
                });
            });
        }
    };

    close = () => {
        this.setState({ isOpen: false });
    };

    render() {
        const { volume, p: polyglot } = this.props;
        const { error, data, isOpen, isLoading } = this.state;

        if (error) {
            return <Alert>{polyglot.t('istex_error')}</Alert>;
        }

        return (
            <div className="istex-volume">
                {isOpen ? (
                    <div>
                        <ButtonWithStatus
                            label={`${polyglot.t('volume')} ${volume}`}
                            labelPosition="after"
                            icon={<Folder />}
                            onClick={this.close}
                            loading={isLoading}
                        />
                        <ul>
                            {get(
                                data,
                                ['aggregations', 'host.issue', 'buckets'],
                                [],
                            ).map(({ key }) => (
                                <li key={key} style={styles.li}>
                                    {polyglot.t('issue')}: {key}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <ButtonWithStatus
                        label={`${polyglot.t('volume')} ${volume}`}
                        labelPosition="after"
                        icon={<Folder />}
                        onClick={this.open}
                        loading={isLoading}
                    />
                )}
            </div>
        );
    }
}

IstexVolumeComponent.propTypes = {
    issn: PropTypes.string.isRequired,
    volume: PropTypes.string.isRequired,
    formatData: PropTypes.shape({}),
    p: polyglotPropTypes.isRequired,
};

IstexVolumeComponent.defaultProps = {
    className: null,
    data: null,
};

export default translate(IstexVolumeComponent);
