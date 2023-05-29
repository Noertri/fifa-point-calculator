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
const matchExpectWrapper = document.querySelector(".match-expect-wrapper");
const matchCoeffWrapper = document.querySelector(".match-coeff-wrapper");

// inisialisasi
oldPointA.value = 1840.93;
oldPointB.value = 1838.45;
additionalRules1.checked = false;
additionalRules2.checked = false;

matchResults.forEach(btn => {
    btn.checked = false;
});

optionsList.forEach(option => {
    let optionRadioBtn = option.querySelector("input");
    optionRadioBtn.checked = false;
})

let data = {
    oldPointTeamA: 1840.93,
    oldPointTeamB: 1838.45,
    matchResult: -1,
    kickOffRound: false,
    pso: false,
    matchCoeff: 0,
    weA: 0.0,
    weB: 0.0,
    newPointTeamA: 0.0,
    newPointTeamB: 0.0,
    diffPointTeamA: 0.0,
    diffPointTeamB: 0.0
};

updateNewPoints(data);

// mulai kode program
oldPointA.addEventListener("change", (e) => {
    if (oldPointA.value && oldPointB.value) {
        data["oldPointTeamA"] = parseFloat(oldPointA.value);
        data["oldPointTeamB"] = parseFloat(oldPointB.value);
        updateMatchExpect(data);
    }
});

oldPointB.addEventListener("change", (e) => {
    if (oldPointA.value && oldPointB.value) {
        data["oldPointTeamA"] = parseFloat(oldPointA.value);
        data["oldPointTeamB"] = parseFloat(oldPointB.value);
        updateMatchExpect(data);
    }
});

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

            if (oldPointA.value && oldPointB.value){
                data["oldPointTeamA"] = parseFloat(oldPointA.value);
                data["oldPointTeamB"] = parseFloat(oldPointB.value);
            }

            updateMatchExpect(data);

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

function updateMatchExpect(data) {
    let weA = matchExpectation(data.oldPointTeamA, data.oldPointTeamB);
    let weB = matchExpectation(data.oldPointTeamB, data.oldPointTeamA);
    
    data["weA"] = parseFloat(weA.toFixed(5));
    data["weB"] = parseFloat(weB.toFixed(5));

    let coeffTag = matchExpectWrapper.querySelector("#match-coeff-value");
    let weATag = matchExpectWrapper.querySelector(".we-a");
    let weBTag = matchExpectWrapper.querySelector(".we-b");
    
    coeffTag.innerText = `Koefisien pertandingan = ${data.matchCoeff}`;
    weATag.innerText = `We tim A = ${weA.toFixed(5)}`;
    weBTag.innerText = `We tim B = ${weB.toFixed(5)}`; 
}

function matchExpectation(point1, point2){
    let dr = point1 - point2;
    let we = 1/(10**(-1*(dr/600))+1);

    return we
}

function calcPoints(matchData) {
    let weA = matchData.weA;
    let weB = matchData.weB;

    let diffPointTeamA;
    let diffPointTeamB;

    switch (matchData.matchResult) {
        case "win":
            if (matchData.kickOffRound && matchData.pso) {
                diffPointTeamA = matchData.matchCoeff*(0.75-weA);
                diffPointTeamB = matchData.matchCoeff*(0.5-weB);
            } else if (matchData.kickOffRound) {
                diffPointTeamA = matchData.matchCoeff*(1-weA);
                diffPointTeamB = 0.00;
            } else {
                diffPointTeamA = matchData.matchCoeff*(1-weA);
                diffPointTeamB = matchData.matchCoeff*(0-weB);
            }
            break
        case "draw":
            diffPointTeamA = matchData.matchCoeff*(0.5-weA);
            diffPointTeamB = matchData.matchCoeff*(0.5-weB);
            break
        case "lose":
            if (matchData.kickOffRound && matchData.pso) {
                diffPointTeamA = matchData.matchCoeff*(0.5-weA);
                diffPointTeamB = matchData.matchCoeff*(0.75-weB);
            } else if (matchData.kickOffRound) {
                diffPointTeamA = 0.00;
                diffPointTeamB = matchData.matchCoeff*(1-weB);
            } else {
                diffPointTeamA = matchData.matchCoeff*(0-weA);
                diffPointTeamB = matchData.matchCoeff*(1-weB);
            }
            break
        default:
            diffPointTeamA = 0.0;
            diffPointTeamB = 0.0;
            break
    }
    
    matchData.newPointTeamA = matchData.oldPointTeamA + parseFloat(diffPointTeamA.toFixed(2));
    matchData.newPointTeamB = matchData.oldPointTeamB + parseFloat(diffPointTeamB.toFixed(2));
    matchData.diffPointTeamA = diffPointTeamA;
    matchData.diffPointTeamB = diffPointTeamB;

    updateNewPoints(matchData);
}

function updateNewPoints(matchData){
    let newPointTeamAElem = resultWrapper.querySelector(".new-point.team-a");
    let newPointTeamBElem = resultWrapper.querySelector(".new-point.team-b");
    let diffPointTeamAElem = resultWrapper.querySelector(".diff-point.team-a");
    let diffPointTeamBElem = resultWrapper.querySelector(".diff-point.team-b");

    newPointTeamAElem.innerText = `${matchData.newPointTeamA.toFixed(2)}`;
    newPointTeamBElem.innerText = `${matchData.newPointTeamB.toFixed(2)}`;

    if (matchData.diffPointTeamA >= 0 && matchData.diffPointTeamB < 0) {
        diffPointTeamAElem.innerText = `+${matchData.diffPointTeamA.toFixed(2)}`;
        diffPointTeamBElem.innerText = `${matchData.diffPointTeamB.toFixed(2)}`;
        newPointTeamAElem.style.color = "rgb(7, 177, 7)";
        diffPointTeamAElem.style.color = "rgb(7, 177, 7)";
        newPointTeamBElem.style.color = "red";
        diffPointTeamBElem.style.color = "red";
    } else if (matchData.diffPointTeamA < 0 && matchData.diffPointTeamB >= 0){
        diffPointTeamAElem.innerText = `${matchData.diffPointTeamA.toFixed(2)}`;
        diffPointTeamBElem.innerText = `+${matchData.diffPointTeamB.toFixed(2)}`;
        newPointTeamAElem.style.color = "red";
        diffPointTeamAElem.style.color = "red";
        newPointTeamBElem.style.color = "rgb(7, 177, 7)";
        diffPointTeamBElem.style.color = "rgb(7, 177, 7)";
    } else if (matchData.diffPointTeamA >= 0 && matchData.diffPointTeamB >= 0) {
        diffPointTeamAElem.innerText = `+${matchData.diffPointTeamA.toFixed(2)}`;
        diffPointTeamBElem.innerText = `+${matchData.diffPointTeamB.toFixed(2)}`;
        newPointTeamAElem.style.color = "rgb(7, 177, 7)";
        diffPointTeamAElem.style.color = "rgb(7, 177, 7)";
        newPointTeamBElem.style.color = "rgb(7, 177, 7)";
        diffPointTeamBElem.style.color = "rgb(7, 177, 7)";
    }
}