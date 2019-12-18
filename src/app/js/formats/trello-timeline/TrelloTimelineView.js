import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Timeline, TimelineEvent } from 'react-event-timeline/dist';
import { milestones } from 'inist-roadmap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt,
    faClock,
    faBookmark,
    faPhoneVolume,
    faBullseye,
} from '@fortawesome/free-solid-svg-icons';

const smallIcon = {
    width: 18,
    height: 18,
};

import { field as fieldPropTypes } from '../../propTypes';
import Link from '../../lib/components/Link';

function getIconFromLabel(labels) {
    if (labels.indexOf('sprint-review') !== -1) {
        return (
            <FontAwesomeIcon
                icon={faClock}
                iconStyle={smallIcon}
                style={smallIcon}
            />
        );
    }
    if (labels.indexOf('communication') !== -1) {
        return (
            <FontAwesomeIcon
                icon={faPhoneVolume}
                iconStyle={smallIcon}
                style={smallIcon}
            />
        );
    }
    if (labels.indexOf('objectif') !== -1) {
        return (
            <FontAwesomeIcon
                icon={faBullseye}
                iconStyle={smallIcon}
                style={smallIcon}
            />
        );
    }
    if (labels.indexOf('reunion') !== -1) {
        return (
            <FontAwesomeIcon
                icon={faCalendarAlt}
                iconStyle={smallIcon}
                style={smallIcon}
            />
        );
    }
    return (
        <FontAwesomeIcon
            icon={faBookmark}
            iconStyle={smallIcon}
            style={smallIcon}
        />
    );
}

const SeeMoreStyle = {
    float: 'right',
};

export default class Roadmap extends Component {
    constructor(props) {
        super(props);
        this.state = { milestones: [] };
    }

    componentDidMount() {
        const { resource, field, trelloToken, trelloKey } = this.props;
        const trelloURL = resource[field.name];
        const options = {
            token: trelloToken,
            key: trelloKey,
        };
        milestones(trelloURL, options)
            .then(values => {
                this.setState({ milestones: values });
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        return (
            <Timeline>
                {this.state.milestones.map((milestone, index) => (
                    <TimelineEvent
                        key={index}
                        title=""
                        createdAt={milestone.rangeLabel}
                        icon={getIconFromLabel(milestone.labels)}
                    >
                        <div style={SeeMoreStyle}>
                            <Link href={milestone.trelloLink}>See more</Link>
                        </div>
                        {milestone.title}
                    </TimelineEvent>
                ))}
            </Timeline>
        );
    }
}

Roadmap.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    trelloToken: PropTypes.string.isRequired,
    trelloKey: PropTypes.string.isRequired,
};

Roadmap.defaultProps = {
    className: null,
};
