import React from 'react';
import { shallow } from 'enzyme';

import { DetailComponent as Detail } from './Detail';
import Property from '../Property';
import ExportButton from '../ExportButton';

describe('Detail', () => {
    it('should render one Property per fields', () => {
        const props = {
            fields: [
                { name: 'field1', scheme: 'scheme1' },
                { name: 'field2', scheme: 'scheme2' },
                { name: 'contribution1', scheme: 'scheme3' },
            ],
            resource: {
                field1: 'value1',
                field2: 'value2',
                contribution1: 'value3',
            },
            p: {
                // @ts-expect-error TS7006
                t: (v) => v,
            },
        };

        // @ts-expect-error TS2322
        const wrapper = shallow(<Detail {...props} />);
        const properties = wrapper.find(Property);
        expect(properties).toHaveLength(3);
        properties.forEach((element, index) => {
            if (index === 2) {
                expect(element.prop('field')).toEqual({
                    name: 'contribution1',
                    scheme: 'scheme3',
                });

                expect(element.prop('resource')).toEqual({
                    field1: 'value1',
                    field2: 'value2',
                    contribution1: 'value3',
                });
                return;
            }

            expect(element.prop('field')).toEqual({
                name: `field${index + 1}`,
                scheme: `scheme${index + 1}`,
            });

            expect(element.prop('resource')).toEqual({
                field1: 'value1',
                field2: 'value2',
                contribution1: 'value3',
            });
        });
    });

    it('should render fields sorted by position', () => {
        const props = {
            fields: [
                { name: 'field1', scheme: 'scheme1', position: 3 },
                { name: 'field2', scheme: 'scheme2', position: 1 },
                { name: 'contribution1', scheme: 'scheme3', position: 2 },
            ],
            resource: {
                field1: 'value1',
                field2: 'value2',
                contribution1: 'value3',
            },
            p: {
                // @ts-expect-error TS7006
                t: (v) => v,
            },
        };

        // @ts-expect-error TS2322
        const wrapper = shallow(<Detail {...props} />);
        const properties = wrapper.find(Property);
        expect(properties).toHaveLength(3);

        const renderedFields = properties.map((element, index) => ({
            index,
            // @ts-expect-error TS2571
            name: element.prop('field').name,
        }));

        expect(renderedFields).toEqual([
            { index: 0, name: 'field2' },
            { index: 1, name: 'contribution1' },
            { index: 2, name: 'field1' },
        ]);
    });

    it('should render export button for ressource', () => {
        const props = {
            fields: [
                { name: 'field1', scheme: 'scheme1', position: 3 },
                { name: 'field2', scheme: 'scheme2', position: 1 },
                { name: 'contribution1', scheme: 'scheme3', position: 2 },
            ],
            resource: {
                field1: 'value1',
                field2: 'value2',
                contribution1: 'value3',
            },
            p: {
                // @ts-expect-error TS7006
                t: (v) => v,
            },
        };

        // @ts-expect-error TS2322
        const wrapper = shallow(<Detail {...props} />);
        const exportButton = wrapper.find(ExportButton);
        expect(exportButton.exists()).toBeTruthy();
    });

    it('should not render export button for subressource', () => {
        const props = {
            fields: [
                { name: 'field1', scheme: 'scheme1', position: 3 },
                { name: 'field2', scheme: 'scheme2', position: 1 },
                { name: 'contribution1', scheme: 'scheme3', position: 2 },
            ],
            resource: {
                field1: 'value1',
                field2: 'value2',
                contribution1: 'value3',
                subresourceId: 'value4',
            },
            p: {
                // @ts-expect-error TS7006
                t: (v) => v,
            },
        };

        // @ts-expect-error TS2322
        const wrapper = shallow(<Detail {...props} />);
        const exportButton = wrapper.find(ExportButton);
        expect(exportButton.exists()).not.toBeTruthy();
    });
});
