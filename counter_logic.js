/* 
* calculating Preliminary Monthly Payment
*/

function getInfoForMaxMonthlyPayment() {
  /* * info from inputs* */
  let housingPrice = parseFloat(document.getElementById("housingPrice").value); 
  let initialPayment = parseFloat(document.getElementById("initialPayment").value); 
  let loanTerm = parseFloat(document.getElementById("loanTerm").value);
  let interestRate = parseFloat(document.getElementById("interestRate").value);
  let euribor = parseFloat(document.getElementById("euribor").value);
  
  /* * calculation of preliminarys monthly payment* */
  let [monthlyPayment, loanAmount, totalAmountPaid] = calculatePreliminaryMonthlyPayment(housingPrice, initialPayment, loanTerm, interestRate, euribor);  
  console.log(monthlyPayment, loanAmount, totalAmountPaid);
}

function calculatePreliminaryMonthlyPayment(housingPrice, initialPayment, loanTerm, interestRate, euribor) {
  let loanAmount = housingPrice - initialPayment;
  let totalInterestRate = interestRate + euribor;  
  let numberOfPeriods = loanTerm * 12;
  let monthlyRate = totalInterestRate / 12 / 100;
  let monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPeriods));
  let totalAmountPaid = monthlyPayment * numberOfPeriods;

  return [monthlyPayment, loanAmount, totalAmountPaid];
}

/* 
* calculating Preliminary Maximum loan sum
*/

function getInfoForMaxLoanSum() {
  /** information from inputs **/
  let euribor = parseFloat(document.getElementById("euribor").value);
  let interestRate = parseFloat(document.getElementById("interestRate").value);
  let loanTerm = parseFloat(document.getElementById("loan_term").value);
  let householdIncome = parseFloat(document.getElementById("household_income").value);
  let householdObligations = parseFloat(document.getElementById("household_obligations").value);
  let houseHoldLivelihoodCosts = parseFloat(document.getElementById("min_livelihood_income").value);
  let maxDTI = parseFloat(document.getElementById("max_dti").value);

  /** calculation of given info**/
  let balanceAfterExpenses = householdIncome - householdObligations - houseHoldLivelihoodCosts;
  let numberOfPayments = loanTerm * 12;
  let monthlyInterestRate = (euribor + interestRate) / 100 / 12; // Convert to decimal and then divide by 12 for monthly rate

  /** Max payment calc based on DTI **/
  const maxMonthlyPayment = calculateMaxMonthlyPayment(householdIncome, householdObligations, maxDTI, balanceAfterExpenses);
  /** Preliminary maximum loan sum Calculation **/
  const preliminaryMaxLoanSum = calculatePreliminaryMaxLoanSum(monthlyInterestRate, numberOfPayments, maxMonthlyPayment);

  console.log(preliminaryMaxLoanSum);
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

