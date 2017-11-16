import { fork } from 'redux-saga/effects';
import loadFields from './loadFields';
import removeField from './removeField';
import saveField from './saveField';
import validation from './validation';
import changeOperation from './changeOperation';
import changePosition from './changePosition';
import loadPublication from './loadPublication';
import configureField from './configureField';

export default [
    loadFields,
    removeField,
    saveField,
    validation,
    changeOperation,
    changePosition,
    loadPublication,
    configureField,
];
