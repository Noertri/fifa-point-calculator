let selectBtn = document.querySelector("#match-categories");
let optItems = selectBtn.querySelectorAll("option");
let matchCoeffValue = document.getElementById("match-coeff-value");
let inputTeamA = document.getElementById("country-a");
let inputTeamB = document.getElementById("country-b");
let oldPointAElem = document.getElementById("old-point-team-a");
let oldPointBElem = document.getElementById("old-point-team-b");
let submitBtn = document.getElementById("submit-btn");
let matchResults = document.querySelectorAll("input[name='match-result']");

optItems[0].selected = true;
inputTeamA.value = "";
inputTeamB.value = "";
oldPointAElem.value = "";
oldPointBElem.value = "";

let data = {
  oldPointA: 0.0,
  oldPointB: 0.0,
  matchCoeff: 0,
  matchResult: "",
  ko: false,
  pso: false
};

selectBtn.addEventListener("change", (e) => {
  if (!e.target.disabled) {
    matchCoeffValue.innerText = `Koefisien pertandingan = ${e.target.value}`;
    data.matchCoeff = parseInt(e.target.value);
  }
});

let countryList = [];

let getMenRanking = async () => {
  let rawData = await fetch(
    "http://127.0.0.1:5506/fifa-point-calculator/api/ranking/men?periode=2023-06-29"
  );

  let jsonData = await rawData.json();

  for (let d of jsonData) {
    countryList.push(d);
  }
};

getMenRanking();

let ulTagA = document.querySelector("ul.team-a");
let ulTagB = document.querySelector("ul.team-b");

inputTeamA.addEventListener("keyup", (e) => {
  let result = [];

  if (e.target.value.length !== 0 && e.key !== "Enter") {
    let keyWord = e.target.value.toLowerCase();

    result = countryList.filter((obj) => {
      if (
        obj["name"].toLowerCase().includes(keyWord) ||
        obj["countryCode"].toLowerCase().includes(keyWord)
      ) {
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
        liTag.addEventListener("click", (e) => {
          inputTeamA.value = e.target.innerText;
          ulTagA.classList.remove("d-flex");
          ulTagA.classList.remove("flex-column");
          ulTagA.classList.remove("country-list");
          ulTagA.innerHTML = "";
          oldPointAElem.value = r["data"][0]["currentPoints"];
        });
        ulTagA.appendChild(liTag);
      }
    } else {
      ulTagA.classList.remove("d-flex");
      ulTagA.classList.remove("flex-column");
      ulTagA.classList.remove("country-list");
      oldPointAElem.value = "";
    }
  } else if (e.key === "Enter" || e.target.value.length === 0) {
    ulTagA.classList.remove("d-flex");
    ulTagA.classList.remove("flex-column");
    ulTagA.classList.remove("country-list");
    ulTagA.innerHTML = "";
  }
});

inputTeamB.addEventListener("keyup", (e) => {
  e.stopPropagation();

  let result = [];

  if (e.target.value.length !== 0 && e.key !== "Enter") {
    let keyWord = e.target.value.toLowerCase();

    result = countryList.filter((obj) => {
      if (
        obj["name"].toLowerCase().includes(keyWord) ||
        obj["countryCode"].toLowerCase().includes(keyWord)
      ) {
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
        liTag.addEventListener("click", (e) => {
          inputTeamB.value = e.target.innerText;
          ulTagB.classList.remove("d-flex");
          ulTagB.classList.remove("flex-column");
          ulTagB.classList.remove("country-list");
          ulTagB.innerHTML = "";
          oldPointBElem.value = r["data"][0]["currentPoints"];
        });
        ulTagB.appendChild(liTag);
      }
    } else {
      ulTagB.classList.remove("d-flex");
      ulTagB.classList.remove("flex-column");
      ulTagB.classList.remove("country-list");
      oldPointBElem.value = "";
    }
  } else if (e.key === "Enter" || e.target.value.length === 0) {
    ulTagB.classList.remove("d-flex");
    ulTagB.classList.remove("flex-column");
    ulTagB.classList.remove("country-list");
    ulTagB.innerHTML = "";
  }
});

document.addEventListener("click", (e) => {
  let countryWrapper = document.querySelectorAll(".country-wrapper");

  if (!countryWrapper[0].contains(e.target)) {
    ulTagA.classList.remove("d-flex");
  }

  if (!countryWrapper[1].contains(e.target)) {
    ulTagB.classList.remove("d-flex");
  }
});

// Hasil pertandingan
matchResults.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target.checked) {
      data.matchResult = e.target.value;
    }
  });
});

// babak knockout dan tendangan penalti
let addRule1 = document.getElementById("ko-round");
let addRule2 = document.getElementById("pso-round");

addRule1.addEventListener("click", (e) => {
  if (e.target.checked) {
    data.ko = Boolean(e.target.value);
  } else {
    data.ko = false;
  }
});

addRule2.addEventListener("click", (e) => {
  if (e.target.checked) {
    data.pso = Boolean(e.target.value);
  } else {
    data.pso = false;
  }
});

// fungsi untuk menghitung ekspetasi kemenangan (we)
function matchExpect(point1, point2) {
  let dr = point1 - point2;
  let we = 1 / (10 ** (-1 * (dr / 600)) + 1);

  return Number(we.toFixed(2));
}

// fungsi untuk menghitung poin yang diperoleh
function calcPoints({
  oldPointA,
  oldPointB,
  matchResult,
  ko,
  pso,
  matchCoeff
}) {
  let matchData = {
    oldPointA: oldPointA,
    oldPointB: oldPointB,
    matchResult: matchResult,
    matchCoeff: matchCoeff,
    ko: ko,
    pso: pso
  };

  let weA = matchExpect(oldPointA, oldPointB);
  let weB = matchExpect(oldPointB, oldPointA);

  matchData.weA = weA;
  matchData.weB = weB;

  let deltaA;
  let deltaB;

  switch (matchResult) {
    case "win":
      if (ko && pso) {
        deltaA = matchCoeff * (0.75 - weA);
        deltaB = 0.0;
      } else if (ko && !pso) {
        deltaA = matchCoeff * (1 - weA);
        deltaB = 0.0;
      } else if (pso && !ko) {
        deltaA = matchCoeff * (0.75 - weA);
        deltaB = matchCoeff * (0.5 - weB);
      } else {
        deltaA = matchCoeff * (1 - weA);
        deltaB = matchCoeff * (0 - weB);
      }
      break;
    case "draw":
      deltaA = matchCoeff * (0.5 - weA);
      deltaB = matchCoeff * (0.5 - weB);
      break;
    case "lose":
      if (ko && pso) {
        deltaA = 0.0;
        deltaB = matchCoeff * (0.75 - weB);
      } else if (ko && !pso) {
        deltaA = 0.0;
        deltaB = matchCoeff * (1 - weB);
      } else if (pso && !ko) {
        deltaA = matchCoeff * (0.5 - weA);
        deltaB = matchCoeff * (0.75 - weB);
      } else {
        deltaA = matchCoeff * (0 - weA);
        deltaB = matchCoeff * (1 - weB);
      }
      break;
    default:
      deltaA = 0.0;
      deltaB = 0.0;
      break;
  }

  matchData.newPointA = oldPointA + Number(deltaA.toFixed(2));
  matchData.newPointB = oldPointB + Number(deltaB.toFixed(2));
  matchData.deltaA = deltaA;
  matchData.deltaB = deltaB;

  return matchData;
}

submitBtn.addEventListener("click", (e) => {
  if (oldPointAElem.value && oldPointBElem.value) {
    data.oldPointA = parseFloat(oldPointAElem.value);
    data.oldPointB = parseFloat(oldPointBElem.value);
  }

  let {newPointA, newPointB, deltaA, deltaB} = calcPoints(data);

  let spanA = document.querySelector(".new-point.team-a");
  let spanB = document.querySelector(".new-point.team-b");
  let diffA = document.querySelector(".diff-point.team-a");
  let diffB = document.querySelector(".diff-point.team-b");

  spanA.innerText = `${newPointA.toFixed(2)}`;
  diffA.innerText = `${deltaA.toFixed(2)}`;
  spanB.innerText = `${newPointB.toFixed(2)}`;
  diffB.innerText = `${deltaB.toFixed(2)}`;
});
