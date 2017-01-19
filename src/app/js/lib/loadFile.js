export default (file) =>
new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onError = reject;
    reader.readAsText(file);
})
