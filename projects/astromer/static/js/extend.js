document.getElementById("unlabeledButton").addEventListener("click", function () {
  const extraButtons = document.getElementById("extraButtons");
  
  if (extraButtons.classList.contains("hidden")) {
    extraButtons.classList.remove("hidden");
    this.textContent = "Pretraining Data";
  } else {
    extraButtons.classList.add("hidden");
    this.textContent = "Pretraining Data";
  }
});
document.getElementById("labeledButton").addEventListener("click", function () {
  const extraButtons = document.getElementById("extraButtons");
  
  if (extraButtons.classList.contains("hidden")) {
    extraButtons.classList.remove("hidden");
    this.textContent = "Labaled Data";
  } else {
    extraButtons.classList.add("hidden");
    this.textContent = "Labeled Data";
  }
});


document.getElementById("unlabeledButton2").addEventListener("click", function () {
  const extraButtons = document.getElementById("extraButtons3");
  
  if (extraButtons.classList.contains("hidden")) {
    extraButtons.classList.remove("hidden");
    this.textContent = "Pretraining Data";
  } else {
    extraButtons.classList.add("hidden");
    this.textContent = "Pretraining Data";
  }
});
document.getElementById("labeledButton2").addEventListener("click", function () {
  const extraButtons = document.getElementById("extraButtons4");
  
  if (extraButtons.classList.contains("hidden")) {
    extraButtons.classList.remove("hidden");
    this.textContent = "Labaled Data";
  } else {
    extraButtons.classList.add("hidden");
    this.textContent = "Labeled Data";
  }
});
