import expect from 'expect';

import { validateField } from './validateFields';

describe('validateField', () => {
    it('should return invalid result if receiving an empty field', () => {
        const field = {};
        const result = validateField(field);

        expect(result).toEqual({
            isValid: false,
            name: undefined,
            properties: [
                {
                    error: 'required',
                    isValid: false,
                    name: 'name',
                },
                {
                    error: 'required',
                    isValid: false,
                    name: 'label',
                },
                {
                    error: 'required',
                    isValid: false,
                    name: 'cover',
                },
                {
                    error: 'required_or_composed_of_required',
                    isValid: false,
                    name: 'transformers',
                },
                {
                    error: 'required_or_transformers_required',
                    isValid: false,
                    name: 'composedOf',
                },
            ],
            propertiesAreValid: false,
            transformers: [],
            transformersAreValid: true,
        });
    });

    it('should return valid result if receiving valid field with transformers', () => {
        const field = {
            name: 'field name',
            label: 'field label',
            cover: 'field cover',
            transformers: [],
        };
        const result = validateField(field);

        expect(result).toEqual({
            isValid: false,
            name: undefined,
            properties: [
                {
                    error: 'required',
                    isValid: true,
                    name: 'name',
                },
                {
                    error: 'required',
                    isValid: true,
                    name: 'label',
                },
                {
                    error: 'required',
                    isValid: true,
                    name: 'cover',
                },
                {
                    error: 'required_or_composed_of_required',
                    isValid: true,
                    name: 'transformers',
                },
                {
                    error: 'required_or_transformers_required',
                    isValid: true,
                    name: 'composedOf',
                },
            ],
            propertiesAreValid: true,
            transformers: [],
            transformersAreValid: true,
        });
    });
});
