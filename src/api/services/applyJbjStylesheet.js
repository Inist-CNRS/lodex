import { render } from 'jbj';

export default (value, stylesheet) => new Promise((resolve, reject) => {
    render(JSON.parse(stylesheet), value, (error, result) => {
        if (error) {
            return reject(error);
        }

        return resolve(result);
    });
});
