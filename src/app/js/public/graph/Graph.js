import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardMedia } from 'material-ui/Card';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { field as fieldPropTypes } from '../../propTypes.js';
import Format from '../Format';
import { fromCharacteristic } from '../selectors';

const styles = {
    media: { minHeight: 200, margin: '10px 0px' },
};

const PureGraph = ({ field, resource }) => (
    <Link to="/g">
        <Card className="graph">
            <CardMedia
                style={styles.media}
                overlay={<CardHeader title={field.label} />}
            >
                <Format field={field} resource={resource} />
            </CardMedia>
        </Card>
    </Link>
);

PureGraph.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
});

export default connect(mapStateToProps)(PureGraph);
