let optionItems = document.querySelectorAll("#match-categories>option");
let matchCoeffValue = document.getElementById("match-coeff-value");

optionItems[0].selected = true;

for (let item of optionItems) {
    if (!(item.disabled)){
        item.addEventListener("click", e => {
            matchCoeffValue.innerText = `Koefisien pertandingan = ${item.value}`
        });
    }
}