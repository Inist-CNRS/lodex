import jbj from 'jbj';
import parse from 'jbj-parse';
import template from 'jbj-template';
import array from 'jbj-array';
import rdfa from 'jbj-rdfa';
import nlp from 'jbj-nlp';
import numerical from 'jbj-numerical';
import jsonld from 'jbj-jsonld';

export const applyJbjStylesheetFactory = renderWithJbj => (value, stylesheet) =>
    new Promise((resolve, reject) => {
        renderWithJbj(JSON.parse(stylesheet), value, (error, result) => {
            if (error) {
                return reject(error);
            }

            return resolve(result);
        });
    });

export default (value, stylesheet) => {
    jbj.use(parse);
    jbj.use(template);
    jbj.use(array);
    jbj.use(rdfa);
    jbj.use(nlp);
    jbj.use(numerical);
    jbj.use(jsonld);

    return applyJbjStylesheetFactory(jbj.render)(value, stylesheet);
};
