import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CardHeader, CardText } from 'material-ui/Card';
import moment from 'moment';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { fromResource } from '../selectors';
import Card from '../../lib/components/Card';
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

export const RemovedDetailComponent = ({ reason, removedAt, p: polyglot }) => (
    <Card className="removed-detail">
        <CardHeader
            title={polyglot.t('removed_resource_at', {
                date: moment(removedAt).format('ll'),
            })}
        />
        <CardText>
            <dl style={styles.container}>
                <dt style={styles.reason}>{polyglot.t('reason')}</dt>
                <dd className="reason">
                    {reason
                        .split('\n')
                        .map((line, index) => <p key={index}>{line}</p>)}
                </dd>
            </dl>
        </CardText>
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

const mapStateToProps = fromResource.getRemovedData;

const mapDispatchToProps = {};

export default compose(translate, connect(mapStateToProps, mapDispatchToProps))(
    RemovedDetailComponent,
);
