export default (file, token) =>
new Promise((resolve, reject) => {
    const oReq = new XMLHttpRequest();
    oReq.open('POST', 'http://localhost:3000/api/upload', true);
    oReq.withCredentials = true;
    oReq.setRequestHeader('Authorization', `Bearer ${token}`);
    oReq.onload = resolve;
    oReq.onerror = reject;

    oReq.send(file);
});
