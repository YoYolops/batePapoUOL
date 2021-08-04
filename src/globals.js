let GLOBAL = {
    conectionIntervalID: "", //ID of the setInterval that keeps connection alive
    messagesIntervalID: "", // ID of the interval that updates messages data
    logged: false, // if the user's logged
    onlineUsers: [],
    messages: [],
    renderedMessages: 0, //the ammount of messages being displayed on screen
    api: axios.create({
        baseURL: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol"
    })
};