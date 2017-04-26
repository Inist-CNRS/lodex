import React, { Component, PropTypes } from 'react';
import { Timeline, TimelineEvent } from 'react-event-timeline/dist';
import TextSMS from 'material-ui/svg-icons/communication/textsms';
// import Email from 'material-ui/svg-icons/communication/email';
import { milestones } from 'inist-roadmap';
import { field as fieldPropTypes } from '../../propTypes';

export default class Roadmap extends Component {
    constructor(props) {
        super(props);
        this.state = { milestones: [] };
    }

    componentDidMount() {
        // const { resource, field } = this.props;
        // const link = resource[field.name];
        const options = {
            token: 'bb675decf284b0f774584b9b96cf91e23615c4b26b8f3c92988bfa986baebe0b',
            key: '7fa507c389612aa4ca03f781cf2a8242',
        };
        milestones('https://trello.com/b/VlDBeVjL/lodex-roadmap', options).then((values) => {
            this.setState({ milestones: values });
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        const smallIcon = {
            width: 18,
            height: 18,
        };

        return (
            <Timeline>
                {
                        this.state.milestones.map(milestone => (
                            <TimelineEvent
                                title={milestone.title}
                                createdAt={milestone.rangeLabel}
                                icon={<TextSMS iconStyle={smallIcon} style={smallIcon} />}
                            >
                            ...
                            </TimelineEvent>
                        ))
                 }
            </Timeline>
        );
    }
}


Roadmap.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

Roadmap.defaultProps = {
    className: null,
};
