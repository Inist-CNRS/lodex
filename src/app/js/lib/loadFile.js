export default file =>
new Promise((resolve, reject) => {
    const oReq = new XMLHttpRequest();
    oReq.open('POST', 'http://localhost:3000/api/upload', true);
    oReq.onload = (oEvent) => {
        resolve(oEvent);
    };

    oReq.send(file);
});
