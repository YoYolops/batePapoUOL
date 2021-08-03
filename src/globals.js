let GLOBAL = {
    logged: false,
    api: axios.create({
        baseURL: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol"
    })
};