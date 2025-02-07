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
  //finish of func  
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

function getInformationForMaxLoanSum() {
  /* * info from inputs* */
  let euribor = parseFloat(document.getElementById("euribor").value);
  let interestRate = parseFloat(document.getElementById("interestRate").value);
  let loanTerm = parseFloat(document.getElementById("loan_term").value);
  let householdIncome = parseFloat(document.getElementById("household_income").value);
  let householdObligations = parseFloat(document.getElementById("household_obligations").value);
  let maxDTI = parseFloat(document.getElementById("max_dti").value);
  let numberOfDependance = parseFloat(document.getElementById("dependance_number").value);
  const isMarriedRadios = document.getElementsByName('radio-val');
  let maritalStatus = null;
  
  //getting info from radio inputs (probably less clunky in react)
  for (const radio of isMarriedRadios) {
    if (radio.checked) {
      maritalStatus = radio.value;
      break;
    }
  }
// one person livelihood costs without dependence 
  let houseHoldLivelihoodCosts = 360;

  if (maritalStatus == 'true') {
    numberOfDependance ++
  }

  
  if (numberOfDependance > 0) {
    houseHoldLivelihoodCosts = calculateLivelihoodCosts(houseHoldLivelihoodCosts, numberOfDependance)
  }
  
  console.log('is married:' + maritalStatus + " number of dependance: " + numberOfDependance + "house Hold Livelihood Costs:" + houseHoldLivelihoodCosts)
  
  let balanceAfterExpenses = householdIncome - householdObligations - houseHoldLivelihoodCosts;
  let numberOfPayments = loanTerm * 12;
  let monthlyInterestRate = (euribor + interestRate) / 100 / 12; // Convert to decimal and then divide by 12 for monthly rate

  const maxMonthlyPayment = calculateMaxMonthlyPayment(householdIncome, householdObligations, maxDTI, balanceAfterExpenses);
  const preliminaryMaxLoanSum = calculatePreliminaryMaxLoanSum(monthlyInterestRate, numberOfPayments, maxMonthlyPayment);
  // finish of the func
  console.log(preliminaryMaxLoanSum);
}

function calculateLivelihoodCosts(houseHoldLivelihoodCosts, numberOfDependance) {
//  first dependance always 180 others always 108
  if (numberOfDependance > 2) {
    numberOfDependance--;
    let otherDependance = 108 * numberOfDependance
    return houseHoldLivelihoodCosts +=  180 + otherDependance
  }
  else if (numberOfDependance === 1) {
    return houseHoldLivelihoodCosts += 180;
  }
  else if(numberOfDependance === 2) {
    return houseHoldLivelihoodCosts += 180 + 108;
  }

}

function calculateMaxMonthlyPayment(householdIncome, householdObligations, maxDTI, balanceAfterExpenses) {  
  // Calculate the maximum payment based on DTI
  const maxPaymentDTI = (householdIncome * (maxDTI / 100)) - householdObligations

  return Math.min(maxPaymentDTI, balanceAfterExpenses);
}

function calculatePreliminaryMaxLoanSum(monthlyInterestRate, numberOfPayments, maxMonthlyPayment) {
    if (monthlyInterestRate === 0) {
        return maxMonthlyPayment * numberOfPayments; // No need to negate
    } else {
        return (maxMonthlyPayment * (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments)) / monthlyInterestRate);
    }
}