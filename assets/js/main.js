let selectBtn = document.querySelector("#match-categories");
let optItems = selectBtn.querySelectorAll("option");
let matchCoeffValue = document.getElementById("match-coeff-value");
let inputTeamA = document.getElementById("country-a");
let inputTeamB = document.getElementById("country-b");

optItems[0].selected = true;
inputTeamA.value = "";
inputTeamB.value = "";

selectBtn.addEventListener("change", e => {
  if (!e.target.disabled) {
    matchCoeffValue.innerText = `Koefisien pertandingan = ${e.target.value}`;
  }
});


let countryList = [];


async function getMenRanking() {
  let rawData = await fetch("http://127.0.0.1:5506/fifa-point-calculator/api/ranking/men?periode=2023-06-29");
  let jsonData = await rawData.json();

  for (let d of jsonData) {
    countryList.push(d);
  }
}

getMenRanking();

let ulTagA = document.querySelector("ul.team-a");
let ulTagB = document.querySelector("ul.team-b");

function showCountries(ulTag, contents, inputTag=null) {
  ulTag.innerHTML = "";

  if (contents.length !== 0) {
    ulTag.classList.add("d-flex");
    ulTag.classList.add("flex-column");
    ulTag.classList.add("country-list");

    for (let r of contents) {
      let liTag = document.createElement("li");
      liTag.innerText = `${r["countryCode"]} - ${r["name"]}`;
      liTag.addEventListener("click", e => {
        inputTag.value = e.target.innerText;
        ulTag.classList.remove("d-flex");
        ulTag.classList.remove("flex-column");
        ulTag.classList.remove("country-list");
        ulTag.innerHTML = "";
        console.log(r["data"][0]["currentPoints"]);
      });
      ulTag.appendChild(liTag);
    }

  } else {
    ulTag.classList.remove("d-flex");
    ulTag.classList.remove("flex-column");
    ulTag.classList.remove("country-list");
  }
}

inputTeamA.addEventListener("keyup", e => {
  let result = [];

  if (e.target.value.length !== 0 && e.key !== "Enter") {
    let keyWord = e.target.value.toLowerCase();

    result = countryList.filter(obj => {
      if (obj["name"].toLowerCase().includes(keyWord) || obj["countryCode"].toLowerCase().includes(keyWord)) {
        return obj;
      }
    });

    showCountries(ulTagA, result, inputTag=inputTeamA);
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

    showCountries(ulTagB, result, inputTag=inputTeamB);
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
