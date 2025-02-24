function calculateLoan() {
  event.preventDefault();
  let housingPrice = parseFloat(document.getElementById("housingPrice").value);
  let initialPayment = parseFloat(document.getElementById("initialPayment").value);
  let initialPaymentPercentage = parseFloat(document.getElementById("initialPaymentPercentage").value);
  let loanTerm = parseFloat(document.getElementById("loanTerm").value);
  let interestRate = parseFloat(document.getElementById("interestRate").value);
  let euribor = parseFloat(document.getElementById("euribor").value);
  
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
  let maxDTI = parseFloat(document.getElementById("max_dti").value);
  let numberOfDependance = parseFloat(document.getElementById("dependance_number").value);
  const isMarriedRadios = document.getElementsByName('radio-val');
  let maritalStatus = null;
  
  event.preventDefault();

  
  for (const radio of isMarriedRadios) {
    if (radio.checked) {
      maritalStatus = radio.value;
      break;
    }
  }
  let houseHoldLivelihoodCosts = 360;
  
  if (maritalStatus == 'true'){
    numberOfDependance ++
  }

  if(numberOfDependance > 0){
    houseHoldLivelihoodCosts = calculateLivelihoodCosts(houseHoldLivelihoodCosts, numberOfDependance)
  }
  
  console.log('is married:' + maritalStatus + " number of dependance: " + numberOfDependance + "house Hold Livelihood Costs:" + houseHoldLivelihoodCosts)
  
  let balanceAfterExpenses = householdIncome - householdObligations - houseHoldLivelihoodCosts;
  let numberOfPayments = loanTerm * 12;
  let monthlyInterestRate = (euribor + interestRate) / 100 / 12; // Convert to decimal and then divide by 12 for monthly rate

  const maxMonthlyPayment = calculateMaxMonthlyPayment(householdIncome, householdObligations, maxDTI, balanceAfterExpenses);
  const preliminaryMaxLoanSum = calculatePreliminaryMaxLoanSum(monthlyInterestRate, numberOfPayments, maxMonthlyPayment);
  
  showMaxLoanSumResult(preliminaryMaxLoanSum);
}

function calculateLivelihoodCosts(houseHoldLivelihoodCosts, numberOfDependance) {

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
  // const maxPaymentDTI = (householdIncome - householdObligations) * (maxDTI / 100);
  if (householdIncome - (householdIncome * 0.4) > houseHoldLivelihoodCosts) {
  	return (householdIncome * 0.4) - householdObligations;
  } else {
  	return householdIncome - householdObligations - houseHoldLivelihoodCosts;
  }
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

function getRefinanceData() {
  let currentLoanAmount = parseFloat(document.getElementById("current_loan_amount").value);
  let currentLoanTerm = parseFloat(document.getElementById("loan_term").value);
  let yearsPassed = parseFloat(document.getElementById("years_passed").value);
  let currentInterestRate = parseFloat(document.getElementById("interest_rate").value);
  let currentEuribor = parseFloat(document.getElementById("euribor").value);
  let newLoanTerm = parseFloat(document.getElementById("new_loan_term").value);
  let newInterestRate = parseFloat(document.getElementById("new_interest_rate").value);

  let calcObj = {
    currentLoanAmount: currentLoanAmount,
    currentLoanTerm: currentLoanTerm,
    yearsPassed: yearsPassed,
    currentInterestRate: currentInterestRate,
    currentEuribor: currentEuribor,
    newLoanTerm: newLoanTerm,
    newInterestRate: newInterestRate
  }

  return calcObj;
}

function calculateMonthlyPayment(monthlyInterestRate, loanTermMonths, loanAmount) {
    return (monthlyInterestRate * loanAmount) /  (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
}

function calculateRemainingBalance(loanAmount, monthlyInterestRate, monthsPassed, monthlyPayment) {
    return (loanAmount * Math.pow(1 + monthlyInterestRate, monthsPassed)) - 
           ((monthlyPayment * (Math.pow(1 + monthlyInterestRate, monthsPassed) - 1)) / monthlyInterestRate);
}


function calcRefinance() {
  event.preventDefault();

  let dataObj = getRefinanceData();
  const {currentLoanAmount, currentLoanTerm, yearsPassed, currentInterestRate, currentEuribor, newLoanTerm, newInterestRate} = dataObj;
  
  console.log("Current Loan Amount: " + currentLoanAmount +
    "\nCurrent Loan Term: " + currentLoanTerm +
    "\nYears Passed: " + yearsPassed +
    "\nCurrent Interest Rate: " + currentInterestRate +
    "\nCurrent Euribor: " + currentEuribor + 
    "\nNew Loan Term: " + newLoanTerm +
    "\nNew Interest Rate: " + newInterestRate);

  //in react app user will input this value
  let yearsLeft = currentLoanTerm - yearsPassed; 
  let monthsPassed = yearsPassed * 12; 
  let remainingMonths = yearsLeft * 12; 
  

  let monthlyInterestRate = ((currentInterestRate + currentEuribor) /  100  / 12);
  let newMonthlyInterestRate = ((newInterestRate + currentEuribor) / 100 / 12);
  console.log("Monthly Interest Rate: " + monthlyInterestRate
          + "\nNew Monthly Interest Rate: " + newMonthlyInterestRate
  );

  let monthlyPayment = calculateMonthlyPayment(monthlyInterestRate, currentLoanTerm * 12, currentLoanAmount);  
  console.log("Monthly Payment: " + monthlyPayment);
  
  let totalPaidInGivenYears = monthlyPayment * monthsPassed;
  console.log("Total Paid in Given Years: " + totalPaidInGivenYears);
  
  let remainingBalance = calculateRemainingBalance(currentLoanAmount, monthlyInterestRate, monthsPassed, monthlyPayment);
  console.log("Remaining Balance after Given Years: " + remainingBalance);
  
  let totalLoanCost = monthlyPayment * (currentLoanTerm * 12);
  console.log("Total Repaid Amount: " + totalLoanCost);

  let newMonthlyPayment = calculateMonthlyPayment(newMonthlyInterestRate, newLoanTerm * 12, remainingBalance);
  console.log("New Monthly Payment: " + newMonthlyPayment); 

  let monthlyPaymentWithoutCommission = monthlyPayment - newMonthlyPayment;
  console.log("Total Monthly Saving: " + monthlyPaymentWithoutCommission);

  let newTotalLoanCost = (newLoanTerm * 12) * newMonthlyPayment + totalPaidInGivenYears;
  console.log("Total Repaid Amount: " + newTotalLoanCost);

  let savingsWithoutCommission = totalLoanCost - newTotalLoanCost;
  console.log("Total saved amount(without commission): " + savingsWithoutCommission);

  let commissionsFee = savingsWithoutCommission * 0.15;
  console.log("Contract fee/commission fee: " + commissionsFee);

  // round up all values that are going to be displayed with math.round or toFixed(2)
  let totalSaved = (savingsWithoutCommission - commissionsFee);
  console.log("Total saved amount after other fees: " + totalSaved.toFixed(2));

  let totalMonthlySavings = monthlyPaymentWithoutCommission - (commissionsFee / (newLoanTerm * 12));
  console.log("Monthly savings after all fees: " + (Math.round(totalMonthlySavings * 100) / 100));
  
  return false;
}