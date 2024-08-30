function calculateLoan() {
  let housingPrice = parseFloat(document.getElementById("housingPrice").value);
  let initialPayment = parseFloat(document.getElementById("initialPayment").value);
  let initialPaymentPercentage = parseFloat(document.getElementById("initialPaymentPercentage").value);
  let loanTerm = parseFloat(document.getElementById("loanTerm").value);
  let interestRate = parseFloat(document.getElementById("interestRate").value);
  let euribor = parseFloat(document.getElementById("euribor").value);
  
  event.preventDefault();
  let [monthlyPayment, loanAmount, totalAmountPaid] = calculatePMT(housingPrice, initialPayment, loanTerm, interestRate, euribor);  

  showResult(monthlyPayment, loanAmount, totalAmountPaid);
}

function calculatePMT(housingPrice, initialPayment, loanTerm, interestRate, euribor) {
  let loanAmount = housingPrice - initialPayment;
  let totalInterestRate = interestRate + euribor;  
  let numberOfPeriods = loanTerm * 12;
  let monthlyRate = totalInterestRate / 12 / 100;
  let monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPeriods));
  let totalAmountPaid = monthlyPayment * numberOfPeriods;

  return [monthlyPayment, loanAmount, totalAmountPaid];
}

function showResult(monthlyPayment, loanAmount, totalAmountPaid) {
  document.getElementById("preliminary_monthly_cost").innerHTML = monthlyPayment.toFixed(2) + " €/mėn.";
  document.getElementById("loan_sum").innerHTML = loanAmount + " €";
  document.getElementById("total_loan_cost").innerHTML = totalAmountPaid.toFixed(2) + " €";

  document.getElementById("result_pop_up").style.display = "flex";
  document.getElementById("opacity_container").style.display = "block";
}

function closeResult() {
  document.getElementById("result_pop_up").style.display = "none";
  document.getElementById("opacity_container").style.display = "none";
}