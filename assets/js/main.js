let selectBtn = document.querySelector("#match-categories");
let optItems = selectBtn.querySelectorAll("option");
let matchCoeffValue = document.getElementById("match-coeff-value");

optItems[0].selected = true;

selectBtn.addEventListener("change", (e) => {
    if (!(e.target.disabled)){
        matchCoeffValue.innerText = `Koefisien pertandingan = ${e.target.value}`
    }
});
