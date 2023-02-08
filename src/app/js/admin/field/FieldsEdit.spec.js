import React from 'react';
import { shallow } from 'enzyme';

import { FieldsEditComponent as FieldsEdit } from './FieldsEdit';
import { FieldGrid } from '../../fields/FieldGrid';
import PublicationPreview from '../preview/publication/PublicationPreview';
import { SCOPE_DOCUMENT } from '../../../../common/scope';
import FieldAddDropdownButton from './FieldAddDropdownButton';

jest.mock('../../admin/api/field', () => ({
    duplicateField: jest.fn(),
}));

describe('<FieldsEdit />', () => {
    it('should display page tab (FieldGrid) per default', () => {
        const wrapper = shallow(
            <FieldsEdit
                showAddFromColumn={false}
                fields={[]}
                filter={{}}
                p={{ t: () => {} }}
            />,
        );

        expect(wrapper.find(FieldGrid).exists()).toBeTruthy();
    });

    it('should display published tab (PublicationPreview) with published defaultTab prop', () => {
        const wrapper = shallow(
            <FieldsEdit
                showAddFromColumn={false}
                fields={[]}
                filter={SCOPE_DOCUMENT}
                addFieldButton={null}
                defaultTab="published"
                p={{ t: () => {} }}
            />,
        );

        expect(wrapper.find(PublicationPreview).exists()).toBeTruthy();
    });

    it('should display FieldAddDropdownButton in page tab if filter === SCOPE_DOCUMENT', () => {
        const wrapper = shallow(
            <FieldsEdit
                showAddFromColumn={false}
                fields={[]}
                filter={SCOPE_DOCUMENT}
                defaultTab="page"
                p={{ t: () => {} }}
            />,
        );

        expect(wrapper.find(FieldAddDropdownButton).exists()).toBeTruthy();
    });

    it('should display FieldGridComponent before statistic', () => {
        const wrapper = shallow(
            <FieldsEdit
                showAddFromColumn={true}
                fields={[]}
                filter={SCOPE_DOCUMENT}
                defaultTab="page"
                p={{ t: () => {} }}
            />,
        );

        expect(
            wrapper.find(
                'Translated(FieldGridComponent) + Connect(Translated(StatisticsComponent))',
            ),
        ).toHaveLength(1);
    });

    it('should display Statistics after PublicationPreview', () => {
        const wrapper = shallow(
            <FieldsEdit
                showAddFromColumn={false}
                fields={[]}
                filter={SCOPE_DOCUMENT}
                defaultTab="published"
                p={{ t: () => {} }}
            />,
        );

        expect(
            wrapper.find(
                'Connect(PublicationPreviewComponent) + Connect(Translated(StatisticsComponent))',
            ),
        ).toHaveLength(1);
    });
});
