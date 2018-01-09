import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'fetch-with-proxy';
import translate from 'redux-polyglot/translate';
import commaNumber from 'comma-number';
import { field as fieldPropTypes } from '../../propTypes';
import Bigbold from './Bigbold';

const isURL = v =>
    (typeof v === 'string' &&
        (v.startsWith('http://') ||
            v.startsWith('https://') ||
            v.startsWith('/api/'))) ||
    false;
const getNumber = v => {
    if (!v || typeof v === 'number' || typeof v === 'string') {
        return v;
    }
    if (v.total) {
        return v.total;
    }
    return null;
};

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
        const data = literalsValues.concat(
            URLsValues.map(getNumber).filter(x => x),
        );
        this.setData(data);
    }

    setData(data) {
        this.setState({ data });
    }

    render() {
        const { data } = this.state;
        const { field, className } = this.props;
        const size =
            field.format && field.format.args && field.format.args.size
                ? field.format.args.size
                : 1;
        const { colors } = field.format.args || { colors: '' };
        const colorsSet = String(colors)
            .split(/[^\w]/)
            .filter(x => x.length > 0)
            .map(x => String('#').concat(x));
        return (
            <div className={className}>
                {data.map((entry, index) => {
                    const key = String(index).concat('EmphasedNumber');
                    const val = commaNumber(entry, ' ');
                    return (
                        <Bigbold
                            key={key}
                            value={val}
                            colorsSet={colorsSet}
                            size={size}
                        />
                    );
                })}
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
