import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { CardText } from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';

import { fromExport, fromPublication } from './selectors';
import { loadExporters as loadExportersAction } from '../public/export';
import WidgetExportItem from './WidgetExportItem';
import WidgetsSelectFields from './WidgetsSelectFields';
import { polyglot as polyglotPropTypes } from '../propTypes';

export class WidgetsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { exportedFields: [] };
    }

    componentDidMount() {
        this.props.loadExporters();
    }

    handleSelectedFieldsChange = (exportedFields) => {
        this.setState({ exportedFields });
    }

    render() {
        const { fields, uri, widgets, p: polyglot } = this.props;
        const { exportedFields } = this.state;

        return (
            <div>
                <Subheader>{polyglot.t('embed_widget')}</Subheader>

                <CardText>
                    <WidgetsSelectFields
                        fields={fields}
                        value={exportedFields}
                        onChange={this.handleSelectedFieldsChange}
                    />
                    {
                        widgets.map(({ name, type }) => (
                            <WidgetExportItem
                                key={name}
                                type={type}
                                label={name}
                                uri={uri}
                                fields={exportedFields.map(field => field.value)}
                            />
                        ))
                    }
                </CardText>
            </div>
        );
    }
}

WidgetsComponent.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    widgets: PropTypes.arrayOf(PropTypes.object),
    loadExporters: PropTypes.func.isRequired,
    uri: PropTypes.string,
    p: polyglotPropTypes.isRequired,
};

WidgetsComponent.defaultProps = {
    widgets: [],
    uri: null,
};

const mapStateToProps = state => ({
    fields: fromPublication.getFields(state),
    widgets: fromExport.getWidgets(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    loadExporters: loadExportersAction,
}, dispatch);

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(WidgetsComponent);
