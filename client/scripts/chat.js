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
        sendMessage(chatText.value)
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
