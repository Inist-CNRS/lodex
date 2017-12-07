import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';
import UriView from '../formats/uri/Component';

import { FormatComponent as Format } from './Format';

describe('<Format />', () => {
    const className = 'a_css_class';
    const field = { name: 'a_name', label: 'Foo', format: { name: 'uri' } };
    const fields = [field, { name: 'another_name', label: 'Foo2' }];

    const resource = {
        a_name: 'a_value',
        linked: 'referenced_resource',
    };

    const rawLinkedResource = {
        versions: [resource],
    };

    const fetchLinkedResource = createSpy();

    it('calls fetchLinkedResource on mount if column has a LINK transformer', () => {
        const linkedField = {
            name: 'linked',
            label: 'Linked',
            transformers: [
                {
                    operation: 'LINK',
                    args: [],
                },
            ],
        };
        shallow(
            <Format
                field={linkedField}
                fieldStatus={null}
                fields={fields.concat(linkedField)}
                resource={resource}
                fetchLinkedResource={fetchLinkedResource}
            />,
        );

        expect(fetchLinkedResource).toHaveBeenCalledWith('referenced_resource');
    });

    const linkedResource = { linked: true };
    const wrapper = shallow(
        <Format
            className={className}
            field={field}
            fieldStatus={null}
            fields={fields}
            fetchLinkedResource={fetchLinkedResource}
            linkedResource={linkedResource}
            rawLinkedResource={rawLinkedResource}
            resource={resource}
        />,
    );

    it('renders an UriView with correct props when no linkedResource is supplied', () => {
        const element = wrapper.find(UriView);

        expect(element.props()).toEqual({
            className,
            field,
            fieldStatus: null,
            fields,
            resource,
            linkedResource,
            rawLinkedResource,
            shrink: false,
            facets: undefined,
            filter: undefined,
            toggleFacetValue: undefined,
            chartData: undefined,
        });
    });
});
