function startChatApp() {
    keepConectionAlive();
    getMessages();
    getOnlineUsers();
};

function toggleMenu(event) {
    if(event.target.tagName === "ASIDE" || event.target.tagName === "IMG") {
        document.querySelector("#menu-container").classList.toggle("active");
        document.querySelector("#menu").classList.toggle("active");
    }
}

function keepConectionAlive() {
    console.log("keepConectionAlive()")
    GLOBAL.conectionIntervalID = setInterval(() => {
        console.log("keeping alive");
        GLOBAL.api.post("/status", { name: GLOBAL.username })
    }, 5000)
}

function getMessages() {
    console.log("getMessages()")
    GLOBAL.messagesIntervalID = setInterval(async () => {
        console.log("getting new messages")
        const response = await GLOBAL.api.get("/messages");
        console.log("data received: ")
        console.log(response.data)
        GLOBAL.messages = response.data;
    }, 3000)
}

async function getOnlineUsers() {
    console.log("getOnlineUsers()")
    try {
        const response = await GLOBAL.api.get("/participants");
        GLOBAL.onlineUsers = response.data;
        displayOnlineUsers();
    } catch (error) {
        console.log("error in getOnlineUsers()");
        console.log(error);
    }
}

function displayOnlineUsers() {
    const onlineUsers = document.querySelector(".online-users");
    GLOBAL.onlineUsers.map(user => {
        onlineUsers.appendChild(`
            <li><img src="../assets/icos/singleUser.png"><span>${user.name}</span><img src="../assets/icos/verify.png"></li>
        `)
    })
}