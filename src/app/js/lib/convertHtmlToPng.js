import html2Canvas from 'html2canvas';

const convertHtmlToPng = element =>
    html2Canvas(element).then(canvas => canvas.toDataURL());

export default convertHtmlToPng;
