import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import Folder from 'material-ui/svg-icons/file/folder';
import translate from 'redux-polyglot/translate';
import { StyleSheet, css } from 'aphrodite/no-important';

import { ISTEX_API_URL } from '../../../../common/externals';
import fetch from '../../lib/fetch';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Alert from '../../lib/components/Alert';
import IstexVolume from './IstexVolume';

export const getVolumeUrl = ({ issn, year }) => {
    return `${ISTEX_API_URL}/?q=(${encodeURIComponent(
        `host.issn="${issn}" AND publicationDate:"${year}"`,
    )})&facet=host.volume[*-*:1]&size=0&output=*`;
};

const styles = StyleSheet.create({
    li: {
        listStyleType: 'none',
    },
});

export class IstexYearComponent extends Component {
    state = {
        data: null,
        error: null,
        isLoading: false,
        isOpen: false,
    };

    open = () => {
        this.setState({
            isOpen: true,
        });

        if (!this.state.data) {
            const url = getVolumeUrl(this.props);
            this.setState({ isLoading: true }, () => {
                fetch({ url }).then(({ response, error }) => {
                    if (error) {
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
            });
        }
    };

    close = () => {
        this.setState({ isOpen: false });
    };

    render() {
        const { issn, year, p: polyglot } = this.props;
        const { error, data, isOpen, isLoading } = this.state;

        if (error) {
            return <Alert>{polyglot.t('istex_error')}</Alert>;
        }

        return (
            <div className="istex-year">
                {isOpen ? (
                    <div>
                        <ButtonWithStatus
                            label={year}
                            labelPosition="after"
                            icon={<Folder />}
                            onClick={this.close}
                            loading={isLoading}
                        />
                        <ul>
                            {get(
                                data,
                                ['aggregations', 'host.volume', 'buckets'],
                                [],
                            ).map(({ key }) => (
                                <li key={key} className={css(styles.li)}>
                                    <IstexVolume
                                        issn={issn}
                                        year={year}
                                        volume={key}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <ButtonWithStatus
                        label={year}
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

IstexYearComponent.propTypes = {
    issn: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(IstexYearComponent);
