const optionsBtn = document.querySelector(".options-button");
const optionsList = document.querySelectorAll(".option-item");
const optionsContainer = document.querySelector(".options-container");
const selectBox = document.querySelector(".select-box");


optionsBtn.addEventListener("click", () => {
    const isActivated = optionsContainer.classList.toggle("active");
    optionsContainer.classList.toggle("d-flex");
    optionsContainer.classList.toggle("flex-column");
    optionsContainer.classList.toggle("flex-shrink-1");
    
    optionsList.forEach(option => {
        option.addEventListener("click", (e) => {
            let optionsBtnElement = optionsBtn.querySelector("span");
            let optionLabelText = option.querySelector("label").innerText.trim();
            optionsBtnElement.innerText = optionLabelText;
            let optionItem = option.querySelector("input");
            optionsContainer.classList.remove("active");
            optionsContainer.classList.remove("d-flex");
            optionsContainer.classList.remove("flex-column");
            optionsContainer.classList.remove("flex-shrink-1");

            let coeffValue = document.querySelector(".match-coefficient-value");
            coeffValue.innerText = "Koefisien pertandingan: " + optionItem.value;
        })
    })
});

const matchResults = document.querySelectorAll("input[name='match-result']");
matchResults.forEach(btn => {
    btn.addEventListener("click", e => {
        console.log(btn.value)
    })
})