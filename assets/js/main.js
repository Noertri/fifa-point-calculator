let selectBtn = document.querySelector("#match-categories");
let optItems = selectBtn.querySelectorAll("option");
let matchCoeffValue = document.getElementById("match-coeff-value");
let inputTeamA = document.getElementById("country-a");
let inputTeamB = document.getElementById("country-b");
let oldPointA = document.getElementById("old-point-team-a");
let oldPointB = document.getElementById("old-point-team-b");
let submitBtn = document.getElementById("submit-btn");

optItems[0].selected = true;
inputTeamA.value = "";
inputTeamB.value = "";
oldPointA.value = "";
oldPointB.value = "";

let data = {
  oldPointTeamA: 0.0,
  oldPointTeamB: 0.0,
  matchCoeff: 0,
  matchResult: 0,
  knockout: false,
  penalty: false,
  newPointTeamA: 0.0,
  newPointTeamB: 0.0
}

selectBtn.addEventListener("change", e => {
  if (!e.target.disabled) {
    matchCoeffValue.innerText = `Koefisien pertandingan = ${e.target.value}`;
    data.matchCoeff = parseInt(e.target.value);
  }
});


let countryList = [];


let getMenRanking = async () => {
  let rawData = await fetch("http://127.0.0.1:5506/fifa-point-calculator/api/ranking/men?periode=2023-06-29");
  let jsonData = await rawData.json();

  for (let d of jsonData) {
    countryList.push(d);
  }
}

getMenRanking();

let ulTagA = document.querySelector("ul.team-a");
let ulTagB = document.querySelector("ul.team-b");

inputTeamA.addEventListener("keyup", e => {
  let result = [];

  if (e.target.value.length !== 0 && e.key !== "Enter") {
    let keyWord = e.target.value.toLowerCase();

    result = countryList.filter(obj => {
      if (obj["name"].toLowerCase().includes(keyWord) || obj["countryCode"].toLowerCase().includes(keyWord)) {
        return obj;
      }
    });

    ulTagA.innerHTML = "";

    if (result.length !== 0) {
      ulTagA.classList.add("d-flex");
      ulTagA.classList.add("flex-column");
      ulTagA.classList.add("country-list");

      for (let r of result) {
        let liTag = document.createElement("li");
        liTag.innerText = `${r["countryCode"]} - ${r["name"]}`;
        liTag.addEventListener("click", e => {
          inputTeamA.value = e.target.innerText;
          ulTagA.classList.remove("d-flex");
          ulTagA.classList.remove("flex-column");
          ulTagA.classList.remove("country-list");
          ulTagA.innerHTML = "";
          oldPointA.value = r["data"][0]["currentPoints"];
        });
        ulTagA.appendChild(liTag);
      }
    } else {
      ulTagA.classList.remove("d-flex");
      ulTagA.classList.remove("flex-column");
      ulTagA.classList.remove("country-list");
      oldPointA.value = "";
    }
  } else if (e.key === "Enter" || e.target.value.length === 0) {
    ulTagA.classList.remove("d-flex");
    ulTagA.classList.remove("flex-column");
    ulTagA.classList.remove("country-list");
    ulTagA.innerHTML = "";
  }
});

inputTeamB.addEventListener("keyup", e => {
  e.stopPropagation();

  let result = [];

  if (e.target.value.length !== 0 && e.key !== "Enter") {
    let keyWord = e.target.value.toLowerCase();

    result = countryList.filter(obj => {
      if (obj["name"].toLowerCase().includes(keyWord) || obj["countryCode"].toLowerCase().includes(keyWord)) {
        return obj;
      }
    });

    ulTagB.innerHTML = "";

    if (result.length !== 0) {
      ulTagB.classList.add("d-flex");
      ulTagB.classList.add("flex-column");
      ulTagB.classList.add("country-list");

      for (let r of result) {
        let liTag = document.createElement("li");
        liTag.innerText = `${r["countryCode"]} - ${r["name"]}`;
        liTag.addEventListener("click", e => {
          inputTeamB.value = e.target.innerText;
          ulTagB.classList.remove("d-flex");
          ulTagB.classList.remove("flex-column");
          ulTagB.classList.remove("country-list");
          ulTagB.innerHTML = "";
          oldPointB.value = r["data"][0]["currentPoints"];
        });
        ulTagB.appendChild(liTag);
      }
    } else {
      ulTagB.classList.remove("d-flex");
      ulTagB.classList.remove("flex-column");
      ulTagB.classList.remove("country-list");
      oldPointB.value = "";
    }
  } else if (e.key === "Enter" || e.target.value.length === 0) {
    ulTagB.classList.remove("d-flex");
    ulTagB.classList.remove("flex-column");
    ulTagB.classList.remove("country-list");
    ulTagB.innerHTML = "";
  }
});

document.addEventListener("click", e => {
  let countryWrapper = document.querySelectorAll(".country-wrapper");

  if (!countryWrapper[0].contains(e.target)) {
    ulTagA.classList.remove("d-flex");
  }

  if (!countryWrapper[1].contains(e.target)) {
    ulTagB.classList.remove("d-flex");
  }
});

submitBtn.addEventListener("click", e => {
  data.oldPointTeamA = parseFloat(oldPointA.value);
  data.oldPointTeamB = parseFloat(oldPointB.value);
  console.log(data);
})
