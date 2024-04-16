const chatText = document.querySelector(".chat-input")
const sendChatButton = document.querySelector(".send-chat")

document.querySelector(".chat-exit").addEventListener("click", () => {
    document.querySelector(".chat").classList.add("chat-close")
    document.querySelector(".chat").classList.remove("chat-open")
})

document.querySelector(".chat-main-phase").addEventListener("click", () => {
    document.querySelector(".chat").classList.remove("chat-close")
    document.querySelector(".chat").classList.add("chat-open")
    document.querySelector(".chat-notification").classList.add("hidden")
    document.querySelector(".chat-notification").innerHTML = 0;
})

function sendChat(){
    if(chatText.value.replaceAll(" ", "").replaceAll("\n", "") !== ""){
        let player = (player1) ? "Player 1" : "Player 2"
        socket.emit("sendMessage", {roomID: roomID, player: player, message: chatText.value})
    }
    setTimeout(() => {
        chatText.value = ""
    }, 1)
}
sendChatButton.addEventListener("click", () => {
    sendChat()
})

chatText.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendChat()
    }
});

socket.on("updateChat", (data) => {
    switch(data.code) {
        case "send":
            let ampm = (new Date().getHours() < 12) ? "AM" : "PM"
            let hour = (new Date().getHours() % 12 === 0) ? 12 : new Date().getHours() % 12
            document.querySelector(".chat-inner").innerHTML += `<div class="message">
                <div class="message-inner">
                <h3 class="message-header">${data.player}
                <span class="message-time">${hour + ":" + String(new Date().getMinutes()).padStart(2, '0') + " " + ampm}</span>
                </h3>
                    <p class="message-content">${data.message}<span class="message-edited hidden"> (edited)</span></p>
                </div>
                </div>`
            document.querySelector(".chat-inner").scrollTo(0, document.querySelector(".chat-inner").scrollHeight)
            if(document.querySelector(".chat").classList.contains("chat-close")){
                document.querySelector(".chat-notification").classList.remove("hidden")
                document.querySelector(".chat-notification").innerHTML = parseInt(document.querySelector(".chat-notification").innerHTML) + 1;
            }
            break;
    }
})
