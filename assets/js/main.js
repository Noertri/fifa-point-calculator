const optionsBtn = document.querySelector(".select-box .options-button");
const optionsList = document.querySelectorAll(".option-item");
const optionsContainer = document.querySelector(".options-container");


optionsBtn.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
});
