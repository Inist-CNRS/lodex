import React, { PropTypes } from 'react';
import { Timeline, TimelineEvent } from 'react-event-timeline/dist';
import TextSMS from 'material-ui/svg-icons/communication/textsms';
import Email from 'material-ui/svg-icons/communication/email';
import { field as fieldPropTypes } from '../../propTypes';

const LinkView = ({ resource, field }) => {
    const link = resource[field.name];
    const smallIcon = {
        width: 18,
        height: 18,
    };

    return (
        <Timeline>
            <TimelineEvent
                title={link}
                createdAt="2016-09-12 10:06 PM"
                icon={<TextSMS iconStyle={smallIcon} style={smallIcon} />}
            >
            I received the payment for $543. Should be shipping the item within a couple of hours.
            </TimelineEvent>
            <TimelineEvent
                title="You sent an email to John Doe"
                createdAt="2016-09-11 09:06 AM"
                icon={<Email iconStyle={smallIcon} style={smallIcon} />}
            >
            Like we talked, you said that you would share the shipment details? This is an urgent order and so I
            am losing patience. Can you expedite the process and pls do share the details asap. Consider this a
            gentle reminder if you are on track already!
            </TimelineEvent>
        </Timeline>
    );
};

LinkView.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

LinkView.defaultProps = {
    className: null,
};

export default LinkView;
