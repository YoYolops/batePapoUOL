
/** 
 * Sets GLOBAL.username to the param value. Global object can be found on globals.js
 * @param {String} username the inserted username
 */
function setGlobalUsername(username) {
    GLOBAL.username = username;
    GLOBAL.logged = true;
}

async function isValidUserName(username) {
    if(username !== "") {
        const response = await GLOBAL.api.post("/participants", {
            name: username
        })
        if(response.status === 200) return true
    }
    return false
}

/** 
 * Search the inserted value to be used as username
 * @return {String} username the inserted name 
 */
function getUserName() {
    username = document.querySelector("#username").value;
    return username;
}

/** 
 * Changes the input style, asking for a valid username
 */
function askValidUsername() {
    const usernameInput = document.querySelector("#username")
    usernameInput.style.border = "2px solid red";
    usernameInput.placeholder = "Insira um nome válido"
}

/** 
 * Finishes the login process if a valid username was inserted
 */
function login() {
    const username = getUserName();

    if(isValidUserName(username)) {
        setGlobalUsername(username);
        hideEntryScreen();
        startChatApp();
    } else {
        askValidUsername();
    }
}

/** 
 * Shows the chat itself and hides the entry screen
 */
function hideEntryScreen() {
    document.querySelector("#entry-screen").className = "hidden";
    document.querySelector("#main-content-container").className = "";
}