import React, { Component, PropTypes } from 'react';
import { Timeline, TimelineEvent } from 'react-event-timeline/dist';
import { ActionDateRange, ActionAlarm, ActionBookmark, ActionRecordVoiceOver, ActionTrendingUp } from 'material-ui/svg-icons';
import { milestones } from 'inist-roadmap';
import { field as fieldPropTypes } from '../../propTypes';


function getIconFromLabel(labels) {
    const smallIcon = {
        width: 18,
        height: 18,
    };
    if (labels.indexOf('sprint-review') !== -1) {
        return <ActionAlarm iconStyle={smallIcon} style={smallIcon} />;
    } else if (labels.indexOf('communication') !== -1) {
        return <ActionRecordVoiceOver iconStyle={smallIcon} style={smallIcon} />;
    } else if (labels.indexOf('objectif') !== -1) {
        return <ActionTrendingUp iconStyle={smallIcon} style={smallIcon} />;
    } else if (labels.indexOf('reunion') !== -1) {
        return <ActionDateRange iconStyle={smallIcon} style={smallIcon} />;
    }
    return <ActionBookmark iconStyle={smallIcon} style={smallIcon} />;
}

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
        const SeeMoreStyle = {
            float: 'right',
        };
        return (
            <Timeline>
                {
                        this.state.milestones.map(milestone => (
                            <TimelineEvent
                                createdAt={milestone.rangeLabel}
                                icon={getIconFromLabel(milestone.labels)}
                            >
                                <div style={SeeMoreStyle}>
                                    <a href={milestone.trelloLink}>See more</a>
                                </div>
                                {milestone.title}
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
