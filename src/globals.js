let GLOBAL = {
    conectionIntervalID: "",
    messagesIntervalID: "",
    logged: false,
    onlineUsers: [],
    messages: [],
    api: axios.create({
        baseURL: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol"
    })
};