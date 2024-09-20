import { mapping } from './MAPPING';

describe('MAPPING', () => {
    test('should return mapped value', () => {
        expect(mapping('hello', '{hello:\'bonjour\'}')).toEqual('bonjour');
    });
    test('should return mapped value', () => {
        expect(mapping('hello', 'hello:\'bonjour\',hi:"salut"')).toEqual('bonjour');
    });
    test('should return mapped value', () => {
        expect(mapping('hello', '"hello":"bonjour","hi":"salut"')).toEqual('bonjour');
    });
    test('should return mapped value', () => {
        expect(mapping('hello', '[hello:"bonjour",hi:"salut"]')).toEqual('bonjour');
    });
    test('should return mapped value', () => {
        expect(mapping(' hello ', '[hello:"bonjour",hi:"salut"]')).toEqual('bonjour');
    });
    test('should return mapped value', () => {
        expect(mapping('hello world', '[hello:"",world:"salut", "hello world":"bonjour"]')).toEqual('bonjour');
    });
    test('should not be recurcive', () => {
        expect(mapping('BD', '["BD":"BGD","BG":"BGR","GR":"GRC"]')).toEqual('BGD');
    });
});
