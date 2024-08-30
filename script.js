function calculateLoan() {
  let housingPrice = parseFloat(document.getElementById("housingPrice").value);
  let initialPayment = parseFloat(document.getElementById("initialPayment").value);
  let initialPaymentPercentage = parseFloat(document.getElementById("initialPaymentPercentage").value);
  let loanTerm = parseFloat(document.getElementById("loanTerm").value);
  let interestRate = parseFloat(document.getElementById("interestRate").value);
  let euribor = parseFloat(document.getElementById("euribor").value);
  
  event.preventDefault();
  let loanAmount = housingPrice - initialPayment;

  // Calculate the total interest rate by adding euribor
  let totalInterestRate = interestRate + euribor;

  // Convert loan term to months
  let numberOfPeriods = loanTerm * 12;

  // Calculate monthly interest rate
  let monthlyRate = totalInterestRate / 12 / 100;

  // Calculate the monthly payment using the PMT formula
  let monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPeriods));

  showResult(monthlyPayment);

}

function calculatePMT(interestRate, numberOfPeriods, loanAmount) {
    let monthlyRate = interestRate / 12 / 100;

    let payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPeriods));

    return payment;
}

function showResult(monthlyPayment) {
  document.getElementById("preliminary_monthly_cost").innerHTML = monthlyPayment;
  document.getElementById("result_pop_up").style.display = "flex";
  document.getElementById("opacity_container").style.display = "block";
}


function closeResult() {
  document.getElementById("result_pop_up").style.display = "none";
  document.getElementById("opacity_container").style.display = "none";
}