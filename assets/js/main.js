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

// inisialisasi
oldPointA.value = "";
oldPointB.value = "";
additionalRules1.checked = false;
additionalRules2.checked = false;

matchResults.forEach(btn => {
    btn.checked = false;
});

optionsList.forEach(option => {
    let optionItem = option.querySelector("input");
    optionItem.checked = false;
})


let data = {
    oldPointTeamA: 0.0,
    oldPointTeamB: 0.0,
    matchResult: -1,
    kickOffRound: false,
    pso: false,
    matchCoeff: 0
};

optionsBtn.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
    optionsContainer.classList.toggle("d-flex");
    optionsContainer.classList.toggle("flex-column");
    optionsContainer.classList.toggle("flex-shrink-1");
});

optionsList.forEach(option => {
    option.addEventListener("click", (e) => {
        let optionsBtnElement = optionsBtn.querySelector("span");
        let optionLabelText = option.querySelector("label").innerText.trim();
        optionsBtnElement.innerText = optionLabelText;
        let optionItem = option.querySelector("input");
            
        if (optionItem.checked) {
            data["matchCoeff"] = Number(optionItem.value);
            let coeffValue = document.querySelector(".match-coefficient-value");
            coeffValue.innerText = `Koefisien pertandingan: ${optionItem.value}`;
        }
        
        optionsContainer.classList.remove("active");
        optionsContainer.classList.remove("d-flex");
        optionsContainer.classList.remove("flex-column");
        optionsContainer.classList.remove("flex-shrink-1");
    })
})

matchResults.forEach(radioBtn => {
    radioBtn.addEventListener("click", e => {
        if (radioBtn.checked) {
            data["matchResult"] = radioBtn.value;
        }
    })
})

additionalRules1.addEventListener("click", (e) => {
    if (additionalRules1.checked) {
        data["kickOffRound"] = Boolean(additionalRules1.value);
    } else {
        data["kickOffRound"] = false;
    }
})

additionalRules2.addEventListener("click", (e) => {
    if (additionalRules2.checked) {
        data["pso"] = Boolean(additionalRules2.value);
    } else {
        data["pso"] = false;
    }
})

submitBtn.addEventListener("click", e =>{
    if (oldPointA.value && oldPointB.value){
        data["oldPointTeamA"] = Number(oldPointA.value);
        data["oldPointTeamB"] = Number(oldPointB.value);
    }

    calcPoints(data);
})


function calcPoints(matchData) {
    let drA = matchData.oldPointTeamA - matchData.oldPointTeamB;
    let drB = matchData.oldPointTeamB - matchData.oldPointTeamA;

    let weA = 1/(10**(-1*(drA/600))+1);
    let weB = 1/(10**(-1*(drB/600))+1);

    matchData.weA = weA;
    matchData.weB = weB;
    
    switch (matchData.matchResult) {
        case "win":
            if (matchData.kickOffRound && matchData.pso) {
                matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(0.75-weA);
                matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(0.5-weB);
            } else if (matchData.kickOffRound) {
                matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(1-weA);
                matchData.newPointTeamB = matchData.oldPointTeamB;
            } else {
                matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(1-weA);
                matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(0-weB);
            }
            break
        case "draw":
            matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(0.5-weA);
            matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(0.5-weB);
            break
        case "lose":
            if (matchData.kickOffRound && matchData.pso) {
                matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(0.5-weA);
                matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(0.75-weB);
            } else if (matchData.kickOffRound) {
                matchData.newPointTeamA = matchData.oldPointTeamA;
                matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(1-weB);
            } else {
                matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(0-weA);
                matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(1-weB);
            }
            break
    }
    
    console.log(matchData);
}