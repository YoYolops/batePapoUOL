let GLOBAL = {
    username: "",
    messageConfig: {
        to: "Todos",
        type: "message",
    },
    conectionIntervalID: "", //ID of the setInterval that keeps connection alive
    messagesIntervalID: "", // ID of the interval that updates messages data
    logged: false, // if the user's logged
    onlineUsers: [],
    messages: [],
    renderedMessages: [], //the last hundred messages displayed on screen
    api: axios.create({
        baseURL: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol"
    })
};