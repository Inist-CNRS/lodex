import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import ListView, { UL, OL } from './ListView';

describe('list format view <ListView />', () => {
    const polyglot = {
        t: (v) => v,
    };

    const defaultProps = {
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

    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should render nothing if the list of value is not an array', () => {
        const wrongValues = [undefined, null, '', 'covfefe', 0, 42, {}];

        wrongValues.forEach((value) => {
            const component = shallow(
                <ListView {...defaultProps} resource={{ name: value }} />,
            );
            const listComponent = component.find(UL);
            expect(listComponent).toHaveLength(0);
        });
    });

    it('should render list of value', () => {
        const component = shallow(<ListView {...defaultProps} />);

        const listComponent = component.find(UL);
        expect(listComponent).toHaveLength(1);

        const subFormat = component.find('Translated(CheckedComponent)');
        expect(subFormat).toHaveLength(3);
        subFormat.forEach((t, index) => {
            expect(t.props().resource).toEqual(['value1', 'value2', 'value3']);
            expect(t.props().field.name).toBe(index.toString());
            expect(t.props().field.format.name).toBe('none');
        });
    });

    it('should render list of subFormat if subformat is provided', () => {
        const props = {
            ...defaultProps,
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
        };
        const component = shallow(<ListView {...props} />);
        const title = component.find('Translated(CheckedComponent)');
        expect(title).toHaveLength(3);
        title.forEach((t, index) => {
            expect(t.props().resource).toEqual(['value1', 'value2', 'value3']);
            expect(t.props().field.name).toBe(index.toString());
            expect(t.props().field.format.name).toBe('title');
            expect(t.props().field.format.args).toEqual({ level: 2 });
        });
    });

    it('should wrap list in UL if no format type provided', () => {
        const component = shallow(<ListView {...defaultProps} />);
        const ul = component.find(UL);
        expect(ul).toHaveLength(1);
        const ol = component.find(OL);
        expect(ol).toHaveLength(0);
    });

    it('should wrap list in OL if format type is ordered', () => {
        const props = {
            ...defaultProps,
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
        };
        const component = shallow(<ListView {...props} />);
        const ul = component.find(UL);
        expect(ul).toHaveLength(0);
        const ol = component.find(OL);
        expect(ol).toHaveLength(1);
    });

    it('should wrap list in UL if format type is unordered_without_bullet', () => {
        const props = {
            ...defaultProps,
            field: {
                name: 'name',
                format: {
                    name: 'list',
                    args: {
                        type: 'unordered_without_bullet',
                        subFormat: 'none',
                        subFormatOptions: {},
                    },
                },
            },
            type: 'unordered_without_bullet',
        };
        const component = shallow(<ListView {...props} />);
        const ul = component.find(UL);
        expect(ul).toHaveLength(1);
        const ol = component.find(OL);
        expect(ol).toHaveLength(0);
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
