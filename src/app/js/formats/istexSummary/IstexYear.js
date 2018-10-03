import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import Folder from 'material-ui/svg-icons/file/folder';
import translate from 'redux-polyglot/translate';

import { ISTEX_API_URL } from '../../../../common/externals';
import fetch from '../../lib/fetch';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const getVolumeUrl = ({ issn, year }) => {
    return `${ISTEX_API_URL}/?q=(${encodeURIComponent(
        `host.issn="${issn}" AND publicationDate:"${year}"`,
    )})&facet=host.volume[*-*:1]&size=0&output=*`;
};

const styles = {
    li: {
        listStyleType: 'none',
    },
};

export class IstexYearComponent extends Component {
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
            const url = getVolumeUrl(this.props);
            this.setState({ isLoading: true });
            await fetch({ url }).then(({ response, error }) => {
                if (error) {
                    throw error;
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
        const { year, p: polyglot } = this.props;
        const { data, isOpen, isLoading } = this.state;

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
                                <li key={key} style={styles.li}>
                                    {polyglot.t('volume')}: {key}
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
    formatData: PropTypes.shape({}),
    p: polyglotPropTypes.isRequired,
};

IstexYearComponent.defaultProps = {
    className: null,
    data: null,
};

export default translate(IstexYearComponent);
