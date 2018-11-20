import React from 'react';
import { shallow } from 'enzyme';

import ListView, { UL, OL } from './ListView';
import TitleView from '../title/TitleView';
import DefaultEdition from '../DefaultFormat/DefaultEdition';

describe('list format view <ListView />', () => {
    const polyglot = {
        t: v => v,
    };
    it('should render list of value', () => {
        const props = {
            className: 'class',
            field: {
                name: 'name',
                format: {
                    name: 'list',
                    args: {
                        subFormat: 'none',
                        subFormatOptions: {},
                    },
                },
            },
            subFormat: 'none',
            subFormatOptions: {},
            resource: {
                name: ['value1', 'value2', 'value3'],
            },
            p: polyglot,
        };

        const component = shallow(<ListView {...props} />);
        const subFormat = component.find('Translated(CheckedComponent)');
        expect(subFormat.length).toBe(3);
        subFormat.forEach((t, index) => {
            expect(t.props().resource).toEqual(['value1', 'value2', 'value3']);
            expect(t.props().field.name).toBe(index.toString());
            expect(t.props().field.format.name).toBe('none');
        });
    });

    it('should render list of subFormat if subformat is provided', () => {
        const props = {
            className: 'class',
            field: {
                name: 'name',
                format: {
                    name: 'list',
                    args: {
                        subFormat: 'title',
                        subFormatOptions: {
                            level: 2,
                        },
                    },
                },
            },
            subFormat: 'title',
            subFormatOptions: {
                level: 2,
            },
            resource: {
                name: ['value1', 'value2', 'value3'],
            },
            p: polyglot,
        };
        const component = shallow(<ListView {...props} />);
        const title = component.find('Translated(CheckedComponent)');
        expect(title.length).toBe(3);
        title.forEach((t, index) => {
            expect(t.props().resource).toEqual(['value1', 'value2', 'value3']);
            expect(t.props().field.name).toBe(index.toString());
            expect(t.props().field.format.name).toBe('title');
            expect(t.props().field.format.args).toEqual({ level: 2 });
        });
    });

    it('should wrap list in UL if no format type provided', () => {
        const props = {
            className: 'class',
            field: {
                name: 'name',
                format: {
                    name: 'list',
                    args: {
                        subFormat: 'none',
                        subFormatOptions: {},
                    },
                },
            },
            subFormat: 'none',
            subFormatOptions: {},
            resource: {
                name: ['value1', 'value2', 'value3'],
            },
            p: polyglot,
        };
        const component = shallow(<ListView {...props} />);
        const ul = component.find(UL);
        expect(ul.length).toBe(1);
        const ol = component.find(OL);
        expect(ol.length).toBe(0);
    });

    it('should wrap list in OL if format type is ordered', () => {
        const props = {
            className: 'class',
            field: {
                name: 'name',
                format: {
                    name: 'list',
                    args: {
                        type: 'ordered',
                        subFormat: 'none',
                        subFormatOptions: {},
                    },
                },
            },
            type: 'ordered',
            subFormat: 'none',
            subFormatOptions: {},
            resource: {
                name: ['value1', 'value2', 'value3'],
            },
            p: polyglot,
        };
        const component = shallow(<ListView {...props} />);
        const ul = component.find(UL);
        expect(ul.length).toBe(0);
        const ol = component.find(OL);
        expect(ol.length).toBe(1);
    });
});
