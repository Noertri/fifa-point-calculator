let selectBtn = document.getElementById("select-btn");
let optionList = document.querySelector(".option-list");
let optionItems = optionList.querySelectorAll("li");
let matchCoeffValue = document.getElementById("match-coeff-value");

selectBtn.addEventListener("click", e => {
    optionList.classList.toggle("active");
});

for (let item of optionItems) {
    item.addEventListener("click", e => {
        if (item.dataset.value) {
            selectBtn.innerText = item.innerText;
            matchCoeffValue.innerText = `Koefisien pertandingan = ${item.dataset.value}`;
        }
        
        optionList.classList.remove("active");
    })
}
