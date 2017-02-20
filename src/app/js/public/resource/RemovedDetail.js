import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardHeader, CardText } from 'material-ui/Card';
import moment from 'moment';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    fromResource,
} from '../../selectors';
import Card from '../../lib/Card';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        marginRight: '1rem',
    },
    reason: {
        fontWeight: 'bold',
    },
};

export const RemovedDetailComponent = ({ reason, removedAt, p: polyglot }) => (
    <Card className="removed-detail">
        <CardHeader>
            {polyglot.t('removed_resource_at', { date: moment(removedAt).format('ll') })}
        </CardHeader>
        <CardText>
            <dl style={styles.container}>
                <dt style={styles.reason}>reason</dt>
                <dd className="reason">
                    {reason.split('\n').map(line => <p>{line}</p>)}
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

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(RemovedDetailComponent);
