import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import translate from 'redux-polyglot/translate';
import commaNumber from 'comma-number';
import { field as fieldPropTypes } from '../../propTypes';
import Badge from './Badge';
import Ribbon from './Ribbon';
import Bigbold from './Bigbold';


const isURL = v => ((typeof v === 'string' && (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/api/'))) || false);

async function fetchURL(url) {
    const response = await fetch(url);
    const result = await response.json();
    return result;
}

async function fetchURLs(urls) {
    const promiseArray = urls.map(url => fetchURL(url));
    return Promise.all(promiseArray);
}

class EmphasedNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    async componentDidMount() {
        const { field, resource } = this.props;
        const value = resource[field.name];
        const values = Array.isArray(value) ? value : [value];
        const URLs = values.filter(v => isURL(v));
        const literals = values.filter(v => !isURL(v));
        const URLsValues = await fetchURLs(URLs);
        const literalsValues = literals.filter(x => x);
        const data = literalsValues.concat(URLsValues);
        this.setData(data);
    }

    setData(data) {
        this.setState({ data });
    }

    render() {
        const { data } = this.state;
        const { field, className } = this.props;
        const look = field.format && field.format.args && field.format.args.look ? field.format.args.look : 'badge';
        const { colors } = field.format.args || { colors: '' };
        const colorsSet = String(colors).split(/[^\w]/).filter(x => x.length > 0).map(x => String('#').concat(x));
        return (
            <div className={className}>
                {
                    data.map((entry, index) => {
                        const key = String(index).concat('EmphasedNumber');
                        const val = commaNumber(entry, ' ');
                        if (look === 'badge') {
                            return (<Badge key={key} value={val} colorsSet={colorsSet} />);
                        }
                        if (look === 'ribbon') {
                            return (<Ribbon key={key} value={val} colorsSet={colorsSet} />);
                        }
                        return (<Bigbold key={key} value={val} colorsSet={colorsSet} />);
                    })
                }
            </div>
        );
    }
}

EmphasedNumber.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
    className: PropTypes.string,
};

EmphasedNumber.defaultProps = {
    className: null,
};

export default translate(EmphasedNumber);

