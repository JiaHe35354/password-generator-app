const lengthText = document.getElementById("length-text");
const rangeInput = document.getElementById("length");

const upperLetter = document.getElementById("uppercase");
const lowerLetter = document.getElementById("lowercase");
const number = document.getElementById("numbers");
const symbol = document.getElementById("symbols");
const passText = document.querySelector(".password");
const btnGenerate = document.querySelector(".btn");
const btnCopy = document.querySelector(".icon-copy");
const copyMsg = document.querySelector(".copy-msg");

rangeInput.addEventListener("input", () => {
  lengthText.textContent = rangeInput.value;
});

function genPassword(length, upper, lower, num, symbol) {
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numChars = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  let chars = "";

  if (upper) chars += upperChars;
  if (lower) chars += lowerChars;
  if (num) chars += numChars;
  if (symbol) chars += specialChars;

  let pass = "";

  for (let i = 0; i < length; i++) {
    const randIdx = Math.floor(Math.random() * chars.length);
    pass += chars[randIdx];
  }

  return pass;
}

function calculateStrength(length, upper, lower, num, symbol) {
  const typesCount = [upper, lower, num, symbol].filter(Boolean).length;

  if (length < 8 || typesCount === 1) return "WEAK";
  if (
    (length >= 8 &&
      length < 10 &&
      (typesCount === 2 || typesCount === 3 || typesCount === 4)) ||
    (length >= 10 && typesCount === 2)
  )
    return "LOW";
  if (
    (length >= 10 && length < 14 && (typesCount === 3 || typesCount === 4)) ||
    (length >= 14 && typesCount === 3)
  )
    return "MEDIUM";
  if (length >= 14 && typesCount === 4) return "STRONG";
}

function updateStrengthDisplay(level) {
  const strengthLevel = document.querySelector(".strength-level");
  const bars = document.querySelectorAll(".bar");

  if (!level) {
    strengthLevel.textContent = "";
    bars.forEach((bar) => bar.classList.remove("bar-full"));
    return;
  }

  strengthLevel.textContent = level;

  bars.forEach((bar) =>
    bar.classList.remove("bar-red", "bar-yellow", "bar-green")
  );

  let activeBars = 0;

  if (level === "WEAK") activeBars = 1;
  if (level === "LOW") activeBars = 2;
  if (level === "MEDIUM") activeBars = 3;
  if (level === "STRONG") activeBars = 4;

  for (let i = 0; i < activeBars; i++) {
    if (activeBars === 1) bars[i].classList.add("bar-red");
    if (activeBars === 2) bars[i].classList.add("bar-red");
    if (activeBars === 3) bars[i].classList.add("bar-yellow");
    if (activeBars === 4) bars[i].classList.add("bar-green");
  }
}

function generate() {
  const lengthValue = +rangeInput.value;

  const upper = upperLetter.checked;
  const lower = lowerLetter.checked;
  const num = number.checked;
  const sym = symbol.checked;

  if (lengthValue === 0 || (!upper && !lower && !num && !sym)) {
    passText.textContent = "P4$5W0rD!";

    passText.classList.remove("password-active");
    updateStrengthDisplay("");
    if (lengthValue === 0) lengthText.textContent = 0;
    return;
  }

  const pass = genPassword(lengthValue, upper, lower, num, sym);
  passText.textContent = pass;
  lengthText.textContent = lengthValue;
  passText.classList.add("password-active");

  const strength = calculateStrength(lengthValue, upper, lower, num, sym);
  updateStrengthDisplay(strength);
}

btnGenerate.addEventListener("click", () => {
  generate();
});

function copyPassword() {
  const password = passText.textContent;
  const isActive = passText.classList.contains("password-active");

  if (!password || !isActive) return;

  copyMsg.style.display = "block";
  copyMsg.classList.remove("copy-success", "copy-error");

  navigator.clipboard
    .writeText(password)
    .then(() => {
      copyMsg.textContent = "Copied!";
      copyMsg.classList.add("copy-success");

      setTimeout(() => {
        copyMsg.style.display = "none";
        copyMsg.textContent = "";
        copyMsg.classList.remove("copy-success");
      }, 2000);
    })
    .catch(() => {
      copyMsg.textContent = "Failed to copy";
      copyMsg.classList.add("copy-error");

      setTimeout(() => {
        copyMsg.style.display = "none";
        copyMsg.textContent = "";
        copyMsg.classList.remove("copy-error");
      }, 2000);
    });
}

btnCopy.addEventListener("click", (e) => {
  copyPassword();
});
