import { connect } from 'react-redux';
import { CardHeader, Card, CardContent } from '@mui/material';
import moment from 'moment';
import compose from 'recompose/compose';

import { fromResource } from '../selectors';
import { useTranslate } from '../../i18n/I18NContext';

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

interface RemovedDetailComponentProps {
    reason?: string;
    removedAt?: string;
}

export const RemovedDetailComponent = ({
    reason,
    removedAt,
}: RemovedDetailComponentProps) => {
    const { translate } = useTranslate();
    return (
        <Card className="removed-detail" sx={{ marginTop: '0.5rem' }}>
            <CardHeader
                title={translate('removed_resource_at', {
                    date: moment(removedAt).format('ll'),
                })}
            />
            <CardContent>
                <dl style={styles.container}>
                    <dt style={styles.reason}>{translate('reason')}</dt>
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
};

RemovedDetailComponent.defaultProps = {
    reason: '',
    removedAt: null,
};

const mapStateToProps = fromResource.getRemovedData;

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(RemovedDetailComponent);
