export default (file, token) =>
new Promise((resolve, reject) => {
    console.log({ file });
    const extension = file.name.split('.').pop();
    const oReq = new XMLHttpRequest();
    oReq.open('POST', `/api/upload/${extension}`, true);
    oReq.withCredentials = true;
    oReq.setRequestHeader('Authorization', `Bearer ${token}`);
    oReq.onload = (event) => {
        if (event.currentTarget.status !== 200) {
            reject(new Error(event.currentTarget.responseText));
            return;
        }
        resolve();
    };
    oReq.onerror = reject;

    oReq.send(file);
});
