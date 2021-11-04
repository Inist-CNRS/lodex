import React from 'react';
import { shallow } from 'enzyme';

import ParsingExcerptColumn from './ParsingExcerptColumn';
import ParsingExcerptHeaderColumn from './ParsingExcerptHeaderColumn';

import {
    ParsingExcerptComponent as ParsingExcerpt,
    getEnrichmentsNames,
    getColumnStyle,
} from './ParsingExcerpt';
import theme from '../../theme';

describe('<ParsingExcerpt />', () => {
    it('should return an empty array of enrichments name', () => {
        const enrichments = [];
        const enrichmentsName = getEnrichmentsNames(enrichments);
        expect(enrichmentsName).toEqual([]);
    });

    it('should return array of enrichments name', () => {
        const enrichments = [
            { name: 'enrichment1', rules: {} },
            { name: 'enrichment2', rules: {} },
        ];
        const enrichmentsName = getEnrichmentsNames(enrichments);
        expect(enrichmentsName).toEqual(['enrichment1', 'enrichment2']);
    });

    it('should return a style for enriched column', () => {
        const column = 'enrichment1';
        const enrichments = [
            { name: 'enrichment1', rules: {} },
            { name: 'enrichment2', rules: {} },
        ];
        const enrichmentsName = getEnrichmentsNames(enrichments);
        const style = getColumnStyle(enrichmentsName, column);
        expect(style).toEqual({ backgroundColor: theme.green.light });
    });

    it('should return a empty style for basic column', () => {
        const column = 'basicColumn';
        const enrichments = [
            { name: 'enrichment1', rules: {} },
            { name: 'enrichment2', rules: {} },
        ];
        const enrichmentsName = getEnrichmentsNames(enrichments);
        const style = getColumnStyle(enrichmentsName, column);
        expect(style).toEqual({});
    });

    it('should render headers', () => {
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const wrapper = shallow(
            <ParsingExcerpt columns={columns} lines={lines} />,
        );
        expect(
            wrapper
                .find(ParsingExcerptHeaderColumn)
                .at(0)
                .prop('column'),
        ).toEqual('foo');
        expect(
            wrapper
                .find(ParsingExcerptHeaderColumn)
                .at(1)
                .prop('column'),
        ).toEqual('bar');
    });

    it('should render lines', () => {
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const wrapper = shallow(
            <ParsingExcerpt columns={columns} lines={lines} />,
        );
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(0)
                .prop('value'),
        ).toEqual('foo1');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(1)
                .prop('value'),
        ).toEqual('bar1');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(2)
                .prop('value'),
        ).toEqual('foo2');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(3)
                .prop('value'),
        ).toEqual('bar2');
    });

    it('should render line with enrichment column hidden', () => {
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const enrichments = [{ name: 'foo' }];
        const wrapper = shallow(
            <ParsingExcerpt
                columns={columns}
                lines={lines}
                enrichments={enrichments}
                isHiddenEnrichedColumn={true}
            />,
        );
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(0)
                .prop('value'),
        ).not.toEqual('foo1');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(0)
                .prop('value'),
        ).toEqual('bar1');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(1)
                .prop('value'),
        ).not.toEqual('foo2');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(1)
                .prop('value'),
        ).toEqual('bar2');
    });

    it('should render line with loaded column hidden', () => {
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const enrichments = [{ name: 'foo' }];
        const wrapper = shallow(
            <ParsingExcerpt
                columns={columns}
                lines={lines}
                enrichments={enrichments}
                isHiddenLoadedColumn={true}
            />,
        );
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(0)
                .prop('value'),
        ).toEqual('foo1');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(0)
                .prop('value'),
        ).not.toEqual('bar1');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(1)
                .prop('value'),
        ).toEqual('foo2');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(1)
                .prop('value'),
        ).not.toEqual('bar2');
    });
});
