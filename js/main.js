let transactionTable = document.querySelector("tbody");
let transactionForm = document.querySelector(".frm-transactions");

// div for error message
let errorMsgElem = document.querySelector(".error");
errorMsgElem.setAttribute("style", "white-space: pre;");

// display total debits amount
let totalDebits = 0;
// display total credits amount
let totalCredits = 0;
// currency sign
let currencySign = "\u0024";

// to display amount of total debits and total credits
let yourDebits = document.querySelector(".debits");
let yourCredits = document.querySelector(".credits");

// transaction tracker form
transactionForm.addEventListener("submit", function (evt) {
  // for data inputs
  let transName, transPayType, currencyAmt;

  evt.preventDefault();

  // error message string
  let errorMsg,
    errorMsg2,
    errorMsg3,
    errorMsg4 = "";

  // error statements
  errorMsg = "Type the transaction description.\n";
  errorMsg2 = "Please select payment type.\n";
  errorMsg3 = "Need an amount.";
  errorMsg4 = "Invalid: zero or negative amount is not allowed.";

  let transactionInput = evt.target;

  transName = transactionInput.elements["description"].value.trim();
  transPayType = transactionInput.elements["type"].value;
  currencyAmt = transactionInput.elements["currency"].value.trim();

  // all empty
  if (transName === "" && transPayType === "" && currencyAmt === "") {
    errorMsgElem.textContent = errorMsg + errorMsg2 + errorMsg3;
  }
  // only transaction name is not empty
  else if (transName !== "" && transPayType === "" && currencyAmt === "") {
    errorMsgElem.textContent = errorMsg2 + errorMsg3;
  }

  // only currency amount is empty
  else if (transName !== "" && transPayType !== "" && currencyAmt === "") {
    errorMsgElem.textContent = errorMsg3;
  }

  // only transPayType is not empty
  else if (transName === "" && transPayType !== "" && currencyAmt === "") {
    errorMsgElem.textContent = errorMsg + errorMsg3;
  }

  // only currency amount is not empty
  else if (transName === "" && transPayType === "" && currencyAmt !== "") {
    errorMsgElem.textContent = errorMsg + errorMsg2;
  }

  // only transPayType is empty
  else if (transName !== "" && transPayType === "" && currencyAmt !== "") {
    errorMsgElem.textContent = errorMsg2;
  }

  // only transName is empty
  else if (transName === "" && transPayType !== "" && currencyAmt !== "") {
    errorMsgElem.textContent = errorMsg;
  }

  // currency is 0
  else if (transName !== "" && transPayType !== "" && currencyAmt <= 0) {
    errorMsgElem.textContent = errorMsg4;
  }

  // input are filled
  else {
    let transData,
      transDetail,
      transDetailTxt,
      payType,
      payTypeTxt,
      amount,
      amountTxt,
      deleteButton,
      trashIcon;

    let money = Number.parseFloat(currencyAmt);

    // create elements
    transData = document.createElement("tr");
    transDetail = document.createElement("td");
    transDetailTxt = document.createTextNode(transName);
    payType = document.createElement("td");
    payTypeTxt = document.createTextNode(transPayType);
    amount = document.createElement("td");
    amountTxt = document.createTextNode(currencySign + money.toFixed(2));
    deleteButton = document.createElement("td");
    trashIcon = document.createElement("i");

    // set attributes
    transData.setAttribute("class", transPayType);
    amount.setAttribute("class", "amount");
    deleteButton.setAttribute("class", "tools");
    trashIcon.setAttribute("class", "delete fa fa-trash-o");

    // append datas
    transDetail.appendChild(transDetailTxt);
    payType.appendChild(payTypeTxt);
    amount.appendChild(amountTxt);
    deleteButton.appendChild(trashIcon);
    transData.appendChild(transDetail);
    transData.appendChild(payType);
    transData.appendChild(amount);
    transData.appendChild(deleteButton);

    // append table
    transactionTable.appendChild(transData);

    // display total amount for debit
    if (transPayType == "debit") {
      totalDebits += money;
      yourDebits.textContent = currencySign + totalDebits.toFixed(2);
    }
    // display total amount for credit
    else {
      totalCredits += money;
      yourCredits.textContent = currencySign + totalCredits.toFixed(2);
    }
    errorMsgElem.textContent = "";
  } // end for inputted without error

  // clear the form
  evt.target.reset();
  console.log("Description: " + transName);
  console.log("Payment type: " + transPayType);
  console.log("Amount: " + currencyAmt);
});

// to delete the transaction
transactionTable.addEventListener("click", function (event) {
  let trashButton = event.target; // icon
  if (trashButton.classList.contains("delete")) {
    let targetTrans = trashButton.parentNode; // data
    let transactionInfo = targetTrans.parentNode; // row
    let fullTransaction = transactionInfo.parentNode; // table
    let balanceAmtString = transactionInfo.children
      .item(2)
      .textContent.toString(); // amount converts to string
    let nonCurrencySign = balanceAmtString.substring(currencySign.length); // removing the currency sign to compute
    let balanceAmtNum = Number.parseFloat(nonCurrencySign); // converted to float

    let confirmDeleteDialog = confirm(
      "Are you sure that you want to remove this transaction?"
    );
    // if delete is true, it will detect what type of transaction will going to delete
    if (confirmDeleteDialog === true) {
      // debit transaction will be deleted
      if (transactionInfo.classList.contains("debit")) {
        totalDebits -= balanceAmtNum;
        yourDebits.textContent = currencySign + totalDebits.toFixed(2);
      }
      // credit transaction will be deleted
      else {
        totalCredits -= balanceAmtNum;
        yourCredits.textContent = currencySign + totalCredits.toFixed(2);
      }
      // remove the row
      fullTransaction.removeChild(transactionInfo);
    }
  }
});

// for inactivity
let timeoutId;

// timeout for inactivity
const INACTIVE_TIME = 120000; // 2 mins

function startTimer() {
  timeoutId = window.setTimeout(doInactive, INACTIVE_TIME);
}

function resetTimer(evt) {
  window.clearTimeout(timeoutId);
  console.log(evt);
  startTimer();
}

function doInactive() {
  alert("Page will refresh due to 2 mins of inactivity.");
  location.reload(true);
}

window.addEventListener("load", function setupTimers() {
  window.onmousemove = resetTimer; // catches mouse movements
  window.onmousedown = resetTimer; // catches mouse movements
  window.onmousewheel = resetTimer; // catches mousewheel movement
  window.onclick = resetTimer; // catches mouse clicks
  window.onscroll = resetTimer; // catches scrolling
  window.onkeydown = resetTimer; // catches keyboard pressing actions
  startTimer();
});
