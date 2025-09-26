import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CardHeader, Card, CardContent } from '@mui/material';
import moment from 'moment';
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';

import { fromResource } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        marginRight: '1rem',
    },
    reason: {
        marginRight: '1rem',
        fontWeight: 'bold',
    },
};

// @ts-expect-error TS7031
export const RemovedDetailComponent = ({ reason, removedAt, p: polyglot }) => (
    <Card className="removed-detail" sx={{ marginTop: '0.5rem' }}>
        <CardHeader
            title={polyglot.t('removed_resource_at', {
                date: moment(removedAt).format('ll'),
            })}
        />
        <CardContent>
            <dl style={styles.container}>
                <dt style={styles.reason}>{polyglot.t('reason')}</dt>
                <dd className="reason">
                    {/*
                     // @ts-expect-error TS7006 */}
                    {reason.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </dd>
            </dl>
        </CardContent>
    </Card>
);

RemovedDetailComponent.defaultProps = {
    reason: '',
    removedAt: null,
};

RemovedDetailComponent.propTypes = {
    reason: PropTypes.string,
    removedAt: PropTypes.string,
    p: polyglotPropTypes.isRequired,
};

// @ts-expect-error TS2339
const mapStateToProps = fromResource.getRemovedData;

const mapDispatchToProps = {};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(RemovedDetailComponent);
