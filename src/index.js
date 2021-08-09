/** 
 * Start all functions that collect and keep conection with server
 */
function startChatApp() {
    keepConectionAlive();
    getMessagesEveryThreeSeconds();
    getOnlineUsers();
    addEventListeners();
};

function addEventListeners() {
    document.querySelector(".footer-top-section > textarea").addEventListener("keypress", event => {
        if(event.key === "Enter") sendMessage();
    })
}

function toggleMenu(event) {
    event.stopPropagation();
    if(event.target.tagName === "ASIDE" || event.target.className === "users-icon") {
        document.querySelector("#menu-container").classList.toggle("active");
        document.querySelector("#menu").classList.toggle("active");
    }
}


/** 
 * Keeps sending connection signals to backend, so it will know the user's still online
 */
function keepConectionAlive() {
    GLOBAL.conectionIntervalID = setInterval(() => {
        GLOBAL.api.post("/status", { name: GLOBAL.username }).catch(error => {
            console.log("Falha na conexão");
            console.log(error.toJSON());
            history.go();
        })
    }, 5000)
}


function getMessagesEveryThreeSeconds() {
    GLOBAL.messagesIntervalID = setInterval(getMessages, 3000)
}

/** 
 * Get and stores messages data from server
 */
async function getMessages() {
    const response = await GLOBAL.api.get("/messages");
    GLOBAL.messages = response.data;
    updateDisplayedMessagesManager();
}


/** 
 * Makes a deepest comparation between two objects than "===" operator, wich is a shallow compare
 * @param {object} objOne
 * @param {object} objTwo
 * @return {boolean} true if both objects have the same keys and values in those keys, false otherwise
 */
function areTheseObjectsEqual(objOne, objTwo) {
    if(Object.keys(objOne).length > Object.keys(objTwo).length) {
        for(let key in objOne) {
            if(objOne[key] !== objTwo[key]) {
                return false;
            }
        }
    } else {
        for(let key in objTwo) {
            if(objOne[key] !== objTwo[key]) {
                return false;
            }
        }
    }
    return true;
}


/** 
 * Manages the functions that checks the new messages and, if there is any new messages, renders
 * them on screen and updates the apps cache (GLOBAL object).
 */
function updateDisplayedMessagesManager() {
    const newMessages = wichMessagesShouldBeAddedInHtml();
    newMessages.map(message => {
        message.type === "private_message" &&
        message.from !== GLOBAL.username &&
        message.to !== GLOBAL.username
        ? void(0)
        : displayMessage(generateMessageHTML(message))
    })
    GLOBAL.renderedMessages = Array.from(GLOBAL.messages);
}


/** 
 * Iterates over the messages received from server and checks wich ones are new, and should be shown,
 * private messages to other people are not rendered.
 * @return {Array<object>} array of objects that represents the messages data that were not diplayed yet
 */
function wichMessagesShouldBeAddedInHtml() {
    if(GLOBAL.renderedMessages.length === 0) {
        GLOBAL.renderedMessages = Array.from(GLOBAL.messages);
        return GLOBAL.messages;
    }

    const onlineUsersThatShouldBeUpdated = [];
    const newMessages = [];
    const lastRenderedMessage = GLOBAL.renderedMessages[GLOBAL.renderedMessages.length - 1];
    for(let i=GLOBAL.messages.length-1; i>=0; i--) {
        if(!areTheseObjectsEqual(GLOBAL.messages[i], lastRenderedMessage)) {
            GLOBAL.messages[i].type === "private_message" &&
            GLOBAL.messages[i].to !== GLOBAL.username &&
            GLOBAL.messages[i].to !== "Todos" &&
            GLOBAL.messages[i].from !== GLOBAL.username
                ? void(0)
                : newMessages.push(GLOBAL.messages[i]);

            GLOBAL.messages[i].type === "status"
                ? onlineUsersThatShouldBeUpdated.push(GLOBAL.messages[i])
                : void(0);
        } else {
            break;
        }
    }
    //this approach prevents the need of making another request to /participants end point
    updateOnlineUsersBasedOnStatusMessages(onlineUsersThatShouldBeUpdated);
    return newMessages;
}


/** 
 * creates a HTML string that represents the message.
 * @param {Object} messageJSON the JSON that comes from the backend, representing a single message data
 * @return {String} the HTML template string that can be used to display the message on the screen
 */
 function generateMessageHTML(messageJSON) {
    const { from, to, text, type, time } = messageJSON;
    const messageTemplate = (
        `<div class="message-box ${type}">
            <p class="message-content">
                <strong class="message-time">(${time})</strong> <strong>${from}</strong> para <strong>${to}</strong>: ${text}
            </p>
        </div>`
    )
    return messageTemplate;
}


/** 
 * Append messages on .messages-container
 */
function displayMessage(messageHTML) {
    const messageContainer = document.querySelector(".messages-container");
    messageContainer.insertAdjacentHTML("beforeend", messageHTML);

    if(window.pageYOffset >= messageContainer.scrollHeight - window.innerHeight - 160) {
        document.querySelector(".message-box:last-child").scrollIntoView();
    }
}


/** 
 * Gets all the active users when its called and sends its data to GLOBAL object. This function
 * only runs a single time, when the app is first started
 */
async function getOnlineUsers() {
    try {
        const response = await GLOBAL.api.get("/participants");
        GLOBAL.onlineUsers = response.data;
        displayOnlineUsers();
    } catch (error) {
        console.log("error in getOnlineUsers()");
        console.log(error);
    }
}

function generateOnlineUserHtmlTemplate(usernameInput) {
    const username = usernameInput.replace(/\s/g, '') // Erase all blank spaces
    const onlineUserHtmlTemplate = (
        `<li class="online-user" id="usr-${username}" onclick="changeMessageReceiver(this, event)">
            <div class="menu-left-section">
                <img class="menu-left-ico" src="../assets/icos/singleUser.png">
                <span>${usernameInput}</span>
            </div>
            <img class="menu-right-ico" src="../assets/icos/verify.png">
        </li>`
    )
    return onlineUserHtmlTemplate;
}


/** 
 * Inserts the online users data into DOM, only runs a single time, when app is started.
 * Afterwards, updates are inserted through updateOnlineUsersBasedOnStatusMessages()
 */
 function displayOnlineUsers() {
    const onlineUsers = document.querySelector(".online-users");
    GLOBAL.onlineUsers.map(user => {
        if(user.name !== GLOBAL.username) {
            const onlineUserHtmlTemplate = generateOnlineUserHtmlTemplate(user.name);
            onlineUsers.insertAdjacentHTML("beforeend", onlineUserHtmlTemplate);
        }
    })
}


/** 
 * Receive the status messages sent from server and, based on them, see wich users should be
 * removed from ul.online-users and wich should be added.
 * @param {Array<object>} messagesInput the array of new status messages
 */
function updateOnlineUsersBasedOnStatusMessages(messages) {
    const onlineUsersContainer = document.querySelector(".online-users");

    for(let i = 0; i < messages.length; i++) {
        let cleanedFromUsername = messages[i].from.replace(/\s/g, '');
        if(messages[i].text === "sai da sala...") {
            const elementToRemove = document.querySelector(`li[id="usr-${cleanedFromUsername}"]`)
            elementToRemove
            ? elementToRemove.remove()
            : void(0)  
        } else if(messages[i].text === "entra na sala..."){
            const onlineUserHtmlTemplate = generateOnlineUserHtmlTemplate(messages[i].from);
            onlineUsersContainer.insertAdjacentHTML("beforeend", onlineUserHtmlTemplate);
        }
    }
}

async function sendMessage() {
    const typedMessage = document.querySelector(".footer-top-section > textarea").value;
    
    if(typedMessage === "") return;

    const messageJSON = {
        from: GLOBAL.username,
        to: GLOBAL.messageConfig.to ?? "Todos" ,
        text: typedMessage,
        type: GLOBAL.messageConfig.type
    }
    await GLOBAL.api.post("/messages", messageJSON);
    getMessages();
    document.querySelector(".footer-top-section > textarea").value = "";
}


/** 
 * Changes the visibility of the messages sent from now on.
 */
function changeVisibility(element, event) {
    event.stopPropagation();
    const text = document.querySelector("#sending-to").textContent;

    if(element.id === "public-option") {
        document.querySelector("#reserved-option > .menu-right-ico").style.visibility = "hidden";
        document.querySelector("#public-option > .menu-right-ico").style.visibility = "visible";
        GLOBAL.messageConfig.type = "message";
        document.querySelector("#sending-to").textContent = text.replace(" (reservadamente)", "")
    } else {
        document.querySelector("#public-option > .menu-right-ico").style.visibility = "hidden";
        document.querySelector("#reserved-option > .menu-right-ico").style.visibility = "visible";
        GLOBAL.messageConfig.type = "private_message";
        document.querySelector("#sending-to").textContent += (" (reservadamente)");
    }
}

function changeMessageReceiver(element, event) {
    event.stopPropagation();
    const newReceiver = element.querySelector(".menu-left-section > span")?.textContent;

    unselectAllOnlineUsers();
    element.querySelector(".menu-right-ico").style.visibility = "visible";
    GLOBAL.messageConfig.to = element.id.split("-")[1];

    GLOBAL.messageConfig.type === "private_message"
        ? document.querySelector("#sending-to").textContent = `Enviando para ${newReceiver ?? "Todos"} (reservadamente)`
        : document.querySelector("#sending-to").textContent = `Enviando para ${newReceiver ?? "Todos"}`;
}

function unselectAllOnlineUsers() {
    document.querySelectorAll(".online-user").forEach(element => {
        element.querySelector(".menu-right-ico").style.visibility = "hidden";
    })
    document.querySelector("#Todos > .menu-right-ico").style.visibility = "hidden";
}