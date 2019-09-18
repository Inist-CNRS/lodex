import React from 'react';
import { shallow } from 'enzyme';
import { TableHeaderColumn } from '@material-ui/core/Table';
import ExcerptLine from './ExcerptLine';

import { ExcerptComponent as Excerpt } from './Excerpt';

describe('<Excerpt />', () => {
    const defaultProps = {
        columns: [
            { name: 'foo', label: 'foo' },
            { name: 'bar', label: 'Super Bar' },
        ],
        lines: [{ foo: 'foo1', bar: 'bar1' }, { foo: 'foo2', bar: 'bar2' }],
        p: { t: key => key },
    };

    it('should render headers', () => {
        const wrapper = shallow(<Excerpt {...defaultProps} />);
        const headers = wrapper.find(TableHeaderColumn);
        expect(
            headers
                .at(0)
                .children()
                .at(0)
                .prop('field'),
        ).toEqual({ name: 'foo', label: 'foo' });
        expect(
            headers
                .at(1)
                .children()
                .at(0)
                .prop('field'),
        ).toEqual({ name: 'bar', label: 'Super Bar' });
    });

    it('should render lines', () => {
        const wrapper = shallow(<Excerpt {...defaultProps} />);

        const excerptLines = wrapper.find(ExcerptLine);
        expect(excerptLines.at(0).props()).toEqual({
            line: { foo: 'foo1', bar: 'bar1' },
            columns: [
                { name: 'foo', label: 'foo' },
                { name: 'bar', label: 'Super Bar' },
            ],
        });
        expect(excerptLines.at(1).props()).toEqual({
            line: { foo: 'foo2', bar: 'bar2' },
            columns: [
                { name: 'foo', label: 'foo' },
                { name: 'bar', label: 'Super Bar' },
            ],
        });
    });
});
