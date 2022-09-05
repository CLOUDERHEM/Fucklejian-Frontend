function downloadFile(filename, data) {
    let str = JSON.stringify(data)
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," +
        encodeURIComponent(str));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export default {
    downloadFile
}
