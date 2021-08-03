let GLOBAL = {
    logged: false,
};

void function loadStoragedData() {
    const data = localStorage.getItem("bpUolData");
    if(data) GLOBAL = JSON.parse(data);
}();

function storageData() {
    if(GLOBAL) localStorage.setItem("bpUolData", JSON.stringify(GLOBAL));
}

function clearStoragedData() {
    localStorage.removeItem("bpUolData");
}
