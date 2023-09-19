import { mapping } from './MAPPING';

describe('MAPPING', () => {
    it('should return mapped value', () => {
        expect(mapping('hello', '{hello:\'bonjour\'}')).toEqual('bonjour');
    });
    it('should return mapped value', () => {
        expect(mapping('hello', 'hello:\'bonjour\',hi:"salut"')).toEqual('bonjour');
    });
    it('should return mapped value', () => {
        expect(mapping('hello', '"hello":"bonjour","hi":"salut"')).toEqual('bonjour');
    });
    it('should return mapped value', () => {
        expect(mapping('hello', '[hello:"bonjour",hi:"salut"]')).toEqual('bonjour');
    });
    it('should return mapped value', () => {
        expect(mapping(' hello ', '[hello:"bonjour",hi:"salut"]')).toEqual(' bonjour ');
    });
    it('should return mapped value', () => {
        expect(mapping('hello world', '[hello:"",hi:"salut",world:"les gens"]')).toEqual(' les gens');
    });
});
