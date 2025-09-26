import React from 'react';
// @ts-expect-error TS7016
import { shallow } from 'enzyme';
import { TableCell, TableContainer } from '@mui/material';
import ExcerptLine from './ExcerptLine';

import { ExcerptComponent as Excerpt } from './Excerpt';

describe('<Excerpt />', () => {
    const defaultProps = {
        columns: [
            { name: 'foo', label: 'foo' },
            { name: 'bar', label: 'Super Bar' },
        ],
        lines: [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ],
        readonly: true,
        // @ts-expect-error TS7006
        p: { t: (key) => key },
    };

    it('should render Table container', () => {
        // @ts-expect-error TS2739
        const wrapper = shallow(<Excerpt {...defaultProps} />);
        const tableContainer = wrapper.find(TableContainer);
        expect(tableContainer.exists()).toBeTruthy();
    });

    it('should render headers', () => {
        // @ts-expect-error TS2739
        const wrapper = shallow(<Excerpt {...defaultProps} />);
        const headers = wrapper.find(TableCell);
        expect(headers.at(0).children().at(0).prop('field')).toEqual({
            name: 'foo',
            label: 'foo',
        });
        expect(headers.at(1).children().at(0).prop('field')).toEqual({
            name: 'bar',
            label: 'Super Bar',
        });
    });

    it('should render lines', () => {
        // @ts-expect-error TS2739
        const wrapper = shallow(<Excerpt {...defaultProps} />);

        const excerptLines = wrapper.find(ExcerptLine);
        expect(excerptLines.at(0).props()).toEqual({
            line: { foo: 'foo1', bar: 'bar1' },
            readonly: true,
            columns: [
                { name: 'foo', label: 'foo' },
                { name: 'bar', label: 'Super Bar' },
            ],
        });
        expect(excerptLines.at(1).props()).toEqual({
            readonly: true,
            line: { foo: 'foo2', bar: 'bar2' },
            columns: [
                { name: 'foo', label: 'foo' },
                { name: 'bar', label: 'Super Bar' },
            ],
        });
    });
});
