import React, { Component, PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { grey400 } from 'material-ui/styles/colors';
import ParsingErrors from './ParsingErrors';
import ParsingExcerpt from './ParsingExcerpt';
import ParsingSummary from './ParsingSummary';

const styles = {
    list: {
        borderRight: `solid 1px ${grey400}`,
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        paddingRight: '1rem',
    },
    listItem: {
        whiteSpace: 'nowrap',
    },
    parsingContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    parsingRightSection: {
        flexGrow: 2,
    },
};

class ParsingResultComponent extends Component {
    constructor() {
        super();
        this.state = {
            showErrors: false,
        };
    }

    handleShowErrors = () => {
        this.setState({ showErrors: true });
    }

    handleShowExcerpt = () => {
        this.setState({ showErrors: false });
    }

    render() {
        const { excerptColumns, excerptLines, failedLines, totalLoadedLines, totalParsedLines } = this.props;
        const { showErrors } = this.state;

        return (
            <Card initiallyExpanded>
                <CardHeader
                    actAsExpander
                    showExpandableButton
                    title="Parsing summary"
                />
                <CardText style={styles.parsingContainer} expandable initiallyExpanded>
                    <ParsingSummary
                        onShowErrors={this.handleShowErrors}
                        onShowExcerpt={this.handleShowExcerpt}
                        showErrors={showErrors}
                        totalFailedLines={failedLines.length}
                        totalLoadedLines={totalLoadedLines}
                        totalParsedLines={totalParsedLines}
                    />
                    <div style={styles.parsingRightSection}>
                        {!showErrors &&
                            <ParsingExcerpt
                                columns={excerptColumns}
                                lines={excerptLines}
                            />
                        }
                        {showErrors &&
                            <ParsingErrors
                                lines={failedLines}
                            />
                        }
                    </div>
                </CardText>
                <CardActions>
                    <FlatButton label="Upload another file" />
                </CardActions>
            </Card>
        );
    }
}

ParsingResultComponent.propTypes = {
    excerptColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    excerptLines: PropTypes.arrayOf(PropTypes.object).isRequired,
    failedLines: PropTypes.arrayOf(PropTypes.string).isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
    totalParsedLines: PropTypes.number.isRequired,
};

export default ParsingResultComponent;
