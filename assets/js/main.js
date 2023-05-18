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
const resultWrapper = document.querySelector(".result-wrapper");

// inisialisasi
oldPointA.value = "";
oldPointB.value = "";
additionalRules1.checked = false;
additionalRules2.checked = false;

matchResults.forEach(btn => {
    btn.checked = false;
});

optionsList.forEach(option => {
    let optionRadioBtn = option.querySelector("input");
    optionRadioBtn.checked = false;
})

// resultWrapper.classList.add("off");

let data = {
    oldPointTeamA: 0.0,
    oldPointTeamB: 0.0,
    matchResult: -1,
    kickOffRound: false,
    pso: false,
    matchCoeff: 0
};


// mulai kode program
optionsBtn.addEventListener("click", () => {
    let toggleClassItems = ["active", "d-flex", "flex-column", "flex-shrink-1"];
    toggleClassItems.map(v => optionsContainer.classList.toggle(v));
});

optionsList.forEach(option => {
    option.addEventListener("click", (e) => {
        let optionsBtnElement = optionsBtn.querySelector("span");
        let optionLabelText = option.querySelector("label").innerText.trim();
        optionsBtnElement.innerText = optionLabelText;

        let optionRadioBtn = option.querySelector("input");

        if (optionRadioBtn.checked) {
            data["matchCoeff"] = parseFloat(optionRadioBtn.value);

            optionRadioBtn.addEventListener(
                "click", (e) => {
                    let optionsBtnElement = optionsBtn.querySelector("span");
                    let optionLabelText = option.querySelector("label").innerText.trim();
                    optionsBtnElement.innerText = optionLabelText;
    
                    let toggleClassItems = ["active", "d-flex", "flex-column", "flex-shrink-1"];
                    toggleClassItems.map(v => optionsContainer.classList.remove(v));
                }
            );
        }

        let toggleClassItems = ["active", "d-flex", "flex-column", "flex-shrink-1"];
        toggleClassItems.map(v => optionsContainer.classList.remove(v));
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
        data["oldPointTeamA"] = parseFloat(oldPointA.value);
        data["oldPointTeamB"] = parseFloat(oldPointB.value);
    }

    calcPoints(data);
})


function calcPoints(matchData) {
    let drA = matchData.oldPointTeamA - matchData.oldPointTeamB;
    let drB = matchData.oldPointTeamB - matchData.oldPointTeamA;

    let weA = 1/(10**(-1*(drA/600))+1);
    let weB = 1/(10**(-1*(drB/600))+1);

    matchData.weA = parseFloat(weA.toFixed(2));
    matchData.weB = parseFloat(weB.toFixed(2));
    
    switch (matchData.matchResult) {
        case "win":
            if (matchData.kickOffRound && matchData.pso) {
                matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(0.75-matchData.weA);
                matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(0.5-matchData.weB);
            } else if (matchData.kickOffRound) {
                matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(1-matchData.weA);
                matchData.newPointTeamB = matchData.oldPointTeamB;
            } else {
                matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(1-matchData.weA);
                matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(0-matchData.weB);
            }
            break
        case "draw":
            matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(0.5-matchData.weA);
            matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(0.5-matchData.weB);
            break
        case "lose":
            if (matchData.kickOffRound && matchData.pso) {
                matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(0.5-matchData.weA);
                matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(0.75-matchData.weB);
            } else if (matchData.kickOffRound) {
                matchData.newPointTeamA = matchData.oldPointTeamA;
                matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(1-matchData.weB);
            } else {
                matchData.newPointTeamA = matchData.oldPointTeamA + matchData.matchCoeff*(0-matchData.weA);
                matchData.newPointTeamB = matchData.oldPointTeamB + matchData.matchCoeff*(1-matchData.weB);
            }
            break
    }
    
    resultWrapper.classList.remove("off");
    let pTag = document.querySelector("p");
    pTag.innerText = `Nilai koefisien pertandingan = ${matchData.matchCoeff}`;
    
}