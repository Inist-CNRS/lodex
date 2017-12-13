import expect from 'expect';

import { valueToBoolean } from './BOOLEAN';

describe('BOOLEAN', () => {
    it('should return true if given a string with true', () => {
        expect(valueToBoolean('true')).toBe(true);
        expect(valueToBoolean(' true ')).toBe(true);
    });

    it('should return true if given a string with 1', () => {
        expect(valueToBoolean('1')).toBe(true);
        expect(valueToBoolean(' 1 ')).toBe(true);
    });

    it('should return true if given a string with ok', () => {
        expect(valueToBoolean('ok')).toBe(true);
        expect(valueToBoolean(' ok ')).toBe(true);
    });

    it('should return true if given a string with on', () => {
        expect(valueToBoolean('on')).toBe(true);
        expect(valueToBoolean(' on ')).toBe(true);
    });

    it('should return true if given a string with oui', () => {
        expect(valueToBoolean('oui')).toBe(true);
        expect(valueToBoolean(' oui ')).toBe(true);
    });

    it('should return true if given a string with yes', () => {
        expect(valueToBoolean('yes')).toBe(true);
        expect(valueToBoolean(' yes ')).toBe(true);
    });

    it('should return false if given other string', () => {
        expect(valueToBoolean('yes 1 ok on oui')).toBe(false);
        expect(valueToBoolean('whatever')).toBe(false);
    });

    it('should return true if value is true', () => {
        expect(valueToBoolean(true)).toEqual(true);
    });

    it('should return true if value is 1', () => {
        expect(valueToBoolean(1)).toEqual(true);
    });

    it('should return false otherwise', () => {
        expect(valueToBoolean(0)).toEqual(false);
        expect(valueToBoolean(2)).toEqual(false);
        expect(valueToBoolean(false)).toEqual(false);
        expect(valueToBoolean([])).toEqual(false);
        expect(valueToBoolean({})).toEqual(false);
        expect(valueToBoolean(undefined)).toEqual(false);
        expect(valueToBoolean(null)).toEqual(false);
        expect(valueToBoolean(new Date())).toEqual(false);
    });
});
