const entryScreenTemplate = (`
    <main id="entry-screen">
        <header>
            <img src="../assets/img/logo.jpg" alt="logo uol">
        </header>
        <input id="username"  type="text" placeholder="Digite seu nome" required><br>
        <button onclick="setGlobalUsername()">Entrar</button>
    </main>
`)

/** 
 * Inserts a template to the entry screen layout if the user is not logged already
 */
void function displayEntryScreen() {
    if(!GLOBAL.logged) {
        const body = document.querySelector("body");
        body.innerHTML = entryScreenTemplate;
    }
}();


/** 
 * Colects and veryfies if the input value is valid, setting the inserted username
 * in global variables. If an invalid name is inserted, the interface requires another
 */
function setGlobalUsername() {
    const username = document.querySelector("#username");

    if(username.value !== "") {
        GLOBAL.username = username.value;
        GLOBAL.logged = true;
        displayMainContent();
    } else {
        username.style.border = "2px solid red";
        username.placeholder = "Insira um nome válido";
    }
}

/** 
 * Shows the chat itself and hides the entry screen
 */
function displayMainContent() {
    document.querySelector("#entry-screen").style.display = "none";
}