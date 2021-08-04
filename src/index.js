/** 
 * Start all functions that collect and keep conection with server
 */
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

/** 
 * Keeps sending connection signals to backend, so it will know the user's still online
 */
function keepConectionAlive() {
    console.log("keepConectionAlive()")
    GLOBAL.conectionIntervalID = setInterval(() => {
        console.log("keeping alive");
        GLOBAL.api.post("/status", { name: GLOBAL.username })
    }, 5000)
}

/** 
 * Gets all the messages sended to the backend every three seconds and sends its data to GLOBAL object
 */
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

function updateDisplayedMessagesManager() {
    const alreadyDisplayedMessages = GLOBAL.renderedMessages;
    const messagesReceivedFromBackend = GLOBAL.messages.length;

    if(alreadyDisplayedMessages < messagesReceivedFromBackend) {
        const messages = GLOBAL.messages.slice(alreadyDisplayedMessages);
        messages.map(message => {
            const htmlMessage = generateMessageHTML(message);
            displayMessage(htmlMessage);
        })
    }
}

/** 
 * Gets all the active users when its called and sends its data to GLOBAL object
 */
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

/** 
 * Inserts the online users data into DOM
 */
function displayOnlineUsers() {
    const onlineUsers = document.querySelector(".online-users");
    GLOBAL.onlineUsers.map(user => {
        onlineUsers.appendChild(`
            <li><img src="../assets/icos/singleUser.png"><span>${user.name}</span><img src="../assets/icos/verify.png"></li>
        `)
    })
}

/** 
 * creates a HTML string that represents the message.
 * @param {Object} messageJSON the JSON that comes from the backend, representing a single message data
 * @return {String} the HTML template string that can be used to display the message on the screen
 */
function generateMessageHTML(messageJSON) {
    const { from, to, text, type, time } = message;
    const messageTemplate = (
        `<div class="${type}">
            <span class="message-time">${time}</span>
            <span class="message-from-to"><strong>${from}</strong> para <strong>${to}</strong>:</span>
            <p class="message-text">${text}</p>
        </div>`
    )
    return messageTemplate;
}

function displayMessage(messageHTML) {
    const messageContainer = document.querySelector(".messages-container");
    messageContainer.insertAdjacentHTML("beforeend", messageHTML);
}

