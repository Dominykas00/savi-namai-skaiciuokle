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

function calculateMaxSum() {
  let euribor = parseFloat(document.getElementById("euribor").value);
  let interestRate = parseFloat(document.getElementById("interestRate").value);
  let loanTerm = parseFloat(document.getElementById("loan_term").value);
  let householdIncome = parseFloat(document.getElementById("household_income").value);
  let householdObligations = parseFloat(document.getElementById("household_obligations").value);
  let houseHoldLivelihoodCosts = parseFloat(document.getElementById("min_livelihood_income").value);
  let maxDTI = parseFloat(document.getElementById("max_dti").value);
  event.preventDefault();

  
  let balanceAfterExpenses = householdIncome - householdObligations - houseHoldLivelihoodCosts;
  let numberOfPayments = loanTerm * 12;
  let monthlyInterestRate = (euribor + interestRate) / 100 / 12; // Convert to decimal and then divide by 12 for monthly rate

  const maxMonthlyPayment = calculateMaxMonthlyPayment(householdIncome, householdObligations, maxDTI, balanceAfterExpenses);
  const preliminaryMaxLoanSum = calculatePreliminaryMaxLoanSum(monthlyInterestRate, numberOfPayments, maxMonthlyPayment);
  
  
  showMaxLoanSumResult(preliminaryMaxLoanSum);

}

function calculateMaxMonthlyPayment(householdIncome, householdObligations, maxDTI, balanceAfterExpenses) {  
  // Calculate the maximum payment based on DTI
  const maxPaymentDTI = (householdIncome - householdObligations) * (maxDTI / 100);
    
  return Math.min(maxPaymentDTI, balanceAfterExpenses);
}

function calculatePreliminaryMaxLoanSum(monthlyInterestRate, numberOfPayments, maxMonthlyPayment) {
    if (monthlyInterestRate === 0) {
        return maxMonthlyPayment * numberOfPayments; // No need to negate
    } else {
        return (maxMonthlyPayment * (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments)) / monthlyInterestRate);
    }
}

function showMaxLoanSumResult(preliminaryMaxLoanSum) { 
  document.getElementById("preliminary_max_loan").innerHTML = preliminaryMaxLoanSum.toFixed(2) + " €";
  document.getElementById("result_pop_up").style.display = "flex";
  document.getElementById("opacity_container").style.display = "block";
}