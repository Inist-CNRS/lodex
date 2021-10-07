import React from 'react';
import { shallow } from 'enzyme';

import { FieldsEditComponent as FieldsEdit } from './FieldsEdit';
import { FieldGrid } from '../fields/FieldGrid';
import PublicationPreview from './preview/publication/PublicationPreview';
import { SCOPE_DOCUMENT } from '../../../common/scope';
import AddFieldFromColumnButton from './Appbar/AddFieldFromColumnButton';
import { AddFieldButton } from './Appbar/AddFieldButton';
import ParsingResult from './parsing/ParsingResult';
import Statistics from './Statistics';

describe('<FieldsEdit />', () => {
    it('should display page tab (FieldGrid) per default', () => {
        const wrapper = shallow(
            <FieldsEdit showAddColumns={false} fields={[]} filter={{}} />,
        );

        expect(wrapper.find(FieldGrid).exists()).toBeTruthy();
    });

    it('should display published tab (PublicationPreview) with published defaultTab prop', () => {
        const wrapper = shallow(
            <FieldsEdit
                showAddColumns={false}
                fields={[]}
                filter={{}}
                defaultTab="published"
            />,
        );

        expect(wrapper.find(PublicationPreview).exists()).toBeTruthy();
        expect(wrapper.find(AddFieldButton).exists()).toBeTruthy();
        expect(wrapper.find(ParsingResult).exists()).toBeTruthy();
    });

    it('should display AddFieldFromColumnButton in published tab if filter === SCOPE_DOCUMENT', () => {
        const wrapper = shallow(
            <FieldsEdit
                showAddColumns={false}
                fields={[]}
                filter={SCOPE_DOCUMENT}
                defaultTab="published"
            />,
        );

        expect(wrapper.find(AddFieldFromColumnButton).exists()).toBeTruthy();
    });

    it('should display Statistics before PublicationPreview if showAddColumns is true', () => {
        const wrapper = shallow(
            <FieldsEdit
                showAddColumns={true}
                fields={[]}
                filter={SCOPE_DOCUMENT}
                defaultTab="published"
            />,
        );

        expect(
            wrapper.find(
                'Connect(Translated(StatisticsComponent)) + Connect(Translated(PublicationPreviewComponent))',
            ).length,
        ).toBe(1);
    });

    it('should display Statistics after PublicationPreview if showAddColumns is false', () => {
        const wrapper = shallow(
            <FieldsEdit
                showAddColumns={false}
                fields={[]}
                filter={SCOPE_DOCUMENT}
                defaultTab="published"
            />,
        );
        console.log(wrapper.debug());
        expect(
            wrapper.find(
                'Connect(Translated(PublicationPreviewComponent)) + Connect(Translated(StatisticsComponent))',
            ).length,
        ).toBe(1);
    });
});
