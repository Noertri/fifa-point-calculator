let selectBtn = document.querySelector("#match-categories");
let optItems = selectBtn.querySelectorAll("option");
let matchCoeffValue = document.getElementById("match-coeff-value");
let inputTeamA = document.getElementById("old-point-team-a");
let inputTeamB = document.getElementById("old-point-team-b");

optItems[0].selected = true;

selectBtn.addEventListener("change", (e) => {
    if (!(e.target.disabled)){
        matchCoeffValue.innerText = `Koefisien pertandingan = ${e.target.value}`
    }
});

let countryList = ["BRA - Brazil", "FRA - France", "IDN - Indonesia", "TKM - Turkmenistan", "IND - India", "BRU - Brunei Darussalam"];

let ulTagA = document.querySelector("ul.team-a");
let ulTagB = document.querySelector("ul.team-b");

function showCountries(ulTag, contents) {
    ulTag.innerHTML = "";

    if (contents.length !== 0) {
        ulTag.classList.add("d-flex");
        ulTag.classList.add("flex-column");
        ulTag.classList.add("country-list");

        for (let r of contents) {
            let liTag = `<li> ${r.toString()} </li>`;

            ulTag.innerHTML += liTag;
        }
    } else {
        ulTag.classList.remove("d-flex");
        ulTag.classList.remove("flex-column");
        ulTag.classList.remove("country-list");
    }
}

inputTeamA.addEventListener("keyup", (e) => {
    let result = [];

    if (e.target.value.length !== 0 && e.key !== "Enter") {
        let keyWord = e.target.value.toLowerCase();

        result = countryList.filter((keyword) => {
            return keyword.toLowerCase().includes(keyWord);
        });

        showCountries(ulTagA, result);
    } else if (e.key === "Enter" || e.target.value.length === 0) {
        ulTagA.classList.remove("d-flex");
        ulTagA.classList.remove("flex-column");
        ulTagA.classList.remove("country-list");
    }
});

inputTeamA.addEventListener("focusin", (e) => {
    if (e.target.value.length !== 0) {
        ulTagA.classList.add("d-flex");
        ulTagA.classList.add("flex-column");
        ulTagA.classList.add("country-list");
    }
})

inputTeamA.addEventListener("focusout", (e) => {
    ulTagA.classList.remove("d-flex");
    ulTagA.classList.remove("flex-column");
    ulTagA.classList.remove("country-list");
})

inputTeamB.addEventListener("keyup", (e) => {
    e.stopPropagation();

    let result = [];

    if (e.target.value.length !== 0 && e.key !== "Enter") {
        let keyWord = e.target.value.toLowerCase();

        result = countryList.filter((keyword) => {
            return keyword.toLowerCase().includes(keyWord);
        });

        showCountries(ulTagB, result);
    } else if (e.key === "Enter" || e.target.value.length === 0) {
        ulTagB.classList.remove("d-flex");
        ulTagB.classList.remove("flex-column");
        ulTagB.classList.remove("country-list");
    }
});

inputTeamB.addEventListener("focusin", (e) => {
    if (e.target.value.length !== 0) {
        ulTagB.classList.add("d-flex");
        ulTagB.classList.add("flex-column");
        ulTagB.classList.add("country-list");
    }
})

inputTeamB.addEventListener("focusout", (e) => {
    ulTagB.classList.remove("d-flex");
    ulTagB.classList.remove("flex-column");
    ulTagB.classList.remove("country-list");
})