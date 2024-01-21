const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthDisplay]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let checkCount = 1;
let passwordLength = 10;
uppercaseCheck.checked = true;
setIndicator("#ccc");
handleSlider();

// set password length and input slider background
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// handle input event on range slider
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// handle check-count and password-length (password-length >= check-count)
[...allCheckBox].forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    checkCount = 0;
    [...allCheckBox].forEach((check) => {
      if (check.checked) checkCount += 1;
    });
    if (passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
    }
  });
});

// genarate any random no. b/w min and max
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// generates any number b/w 0 - 9
function generateRandomNumber() {
  return getRndInteger(0, 10);
}

// generates any lowercase digit b/w a - z
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

// generates any uppercase digit b/w A - Z
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

//generates any symbols
function generateSymbol() {
  const symbolArr = Array.from(symbols);
  const randIndx = getRndInteger(0, symbolArr.length);
  return symbolArr[randIndx];
}

// Shuffle the array randomly - Fisher Yates Method
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

// Handle generate password
generateBtn.addEventListener("click", () => {
  // none of the checkboxes are selected
  if (checkCount <= 0) return;

  // password-length should be >= selected no. of checkbox
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // remove the previous password
  if (password.length) password = "";

  // add selected checkbox functions to an array
  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
  if (numbersCheck.checked) funcArr.push(generateRandomNumber);
  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndx = getRndInteger(0, funcArr.length);
    password += funcArr[randIndx]();
  }

  password = shuffleArray(Array.from(password));
  passwordDisplay.value = password;
  calcStrength();
});

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } 
  catch (err) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } 
  else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } 
  else {
    setIndicator("#f00");
  }
}
