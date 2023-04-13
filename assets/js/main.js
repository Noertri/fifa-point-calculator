const optionsBtn = document.querySelector(".options-button");
const optionsList = document.querySelectorAll(".option-item");
const optionsContainer = document.querySelector(".options-container");
const selectBox = document.querySelector(".select-box");
const matchResults = document.querySelectorAll("input[name='match-result']");
const oldPointA = document.querySelector("#old-point-team-a");
const oldPointB = document.querySelector("#old-point-team-b");
const additionalRules1 = document.getElementById("ko-round");
const additionalRules2 = document.getElementById("penalty-shoot");
const submitBtn = document.querySelector("#submit-btn");
const optionItems = document.querySelectorAll("input[name='option-match']");

// inisialisasi
oldPointA.value = "";
oldPointB.value = "";
additionalRules1.checked = false;
additionalRules2.checked = false;

matchResults.forEach(btn => {
    btn.checked = false;
});

optionItems.forEach(option => {
    option.checked = false;
});

let data = {};

optionsBtn.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
    optionsContainer.classList.toggle("d-flex");
    optionsContainer.classList.toggle("flex-column");
    optionsContainer.classList.toggle("flex-shrink-1");
    
    optionsList.forEach(option => {
        option.addEventListener("click", (e) => {
            let optionsBtnElement = optionsBtn.querySelector("span");
            let optionLabelText = option.querySelector("label").innerText.trim();
            optionsBtnElement.innerText = optionLabelText;
            let optionItem = option.querySelector("input");

            if (optionItem.checked) {
                data["matchCoeff"] = Number(optionItem.value);
                let coeffValue = document.querySelector(".match-coefficient-value");
                coeffValue.innerText = "Koefisien pertandingan: " + optionItem.value;
            }
            
            optionsContainer.classList.remove("active");
            optionsContainer.classList.remove("d-flex");
            optionsContainer.classList.remove("flex-column");
            optionsContainer.classList.remove("flex-shrink-1");
        })
    })

});


matchResults.forEach(btn => {
    btn.addEventListener("click", e => {
        if (btn.checked) {
            data["matchResult"] = Number(btn.value);
        }
    })
})

additionalRules1.addEventListener("click", (e) => {
    if (additionalRules1.checked) {
        data["kickOffRound"] = Boolean(additionalRules1.value)
    }
})


additionalRules2.addEventListener("click", (e) => {
    if (additionalRules2.checked) {
        data["pso"] = Boolean(additionalRules2.value)
    }
})


submitBtn.addEventListener("click", e =>{
    if (oldPointA.value && oldPointB.value){
        data["oldPointTeamA"] = Number(oldPointA.value);
        data["oldPointTeamB"] = Number(oldPointB.value);
    }

    if (data) {
        console.log(data);
    }
    
})