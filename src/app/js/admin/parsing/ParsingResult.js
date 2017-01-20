import React, { PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';

const ParsingResultHeader = ({ hasErrors }) => (
    <h2>
        Parsing summary
    </h2>
)
const ParsingResultComponent = ({ failedLines, totalLoadedLines, totalParsedLines }) => (
    <Card initiallyExpanded={failedLines.length > 0}>
        <CardHeader
            title={<ParsingResultHeader hasErrors={failedLines.length > 0} />}
            actAsExpander
            showExpandableButton
        />
        <CardText expandable>
            <List>
                <ListItem primaryText={<span><b>{totalLoadedLines}</b> lines</span>} />
                <ListItem primaryText={<span><b>{totalParsedLines}</b> successfully parsed</span>} />
                <ListItem primaryText={<span><b>{failedLines.length}</b> with errors</span>} />
            </List>
        </CardText>
        <CardActions>
            <FlatButton label="Upload another file" />
        </CardActions>
    </Card>
);

ParsingResultComponent.propTypes = {
    failedLines: PropTypes.array.isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
    totalParsedLines: PropTypes.number.isRequired,
};

export default ParsingResultComponent;
