import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import { Link } from 'react-router-dom';

import LodexResource from './LodexResource';

describe('LodexResource', () => {
    it('should render Link with to=id if id is of type uid', () => {
        const wrapper = shallow(
            <LodexResource
                id="uid:/id"
                url="http://localhost:3000/uid:/id"
                title="title"
                summary="summary"
            />,
        );

        const link = wrapper.find(Link);

        expect(link.prop('to')).toBe('uid:/id');
    });

    it('should render Link with to=id if id is of type ark', () => {
        const wrapper = shallow(
            <LodexResource
                id="ark:/id"
                url="http://localhost:3000/ark:/uid"
                title="title"
                summary="summary"
            />,
        );

        const link = wrapper.find(Link);

        expect(link.prop('to')).toBe('ark:/id');
    });

    it('should render Link with to=id if id starts with /api', () => {
        const wrapper = shallow(
            <LodexResource
                id="/api/id"
                url="http://localhost:3000/api/id"
                title="title"
                summary="summary"
            />,
        );

        const link = wrapper.find(Link);

        expect(link.prop('to')).toBe('/api/id');
    });

    it('should render a with href=url if id is not local', () => {
        const wrapper = shallow(
            <LodexResource
                id="id"
                url="http://otherSiteUrl"
                title="title"
                summary="summary"
            />,
        );

        const link = wrapper.find('a');

        expect(link.prop('href')).toBe('http://otherSiteUrl');
    });
});
