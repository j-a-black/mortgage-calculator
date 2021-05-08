// initialing the state using the default values identifed within the html elements
let state = {
  price: Number(document.querySelectorAll('[name="price"]')[0].value),
  down_payment: Number(
    document.querySelectorAll('[name="down_payment"]')[0].value
  ),
  loan_term: Number(document.querySelectorAll('[name="loan_term"]')[0].value),
  interest_rate: parseFloat(
    document.querySelectorAll('[name="interest_rate"]')[0].value
  ),
  home_insurance: Number(
    document.querySelectorAll('[name="home_insurance"]')[0].value
  ),
  property_tax: Number(
    document.querySelectorAll('[name="property_tax"]')[0].value
  ),
  hoa: Number(document.querySelectorAll('[name="hoa"]')[0].value),
};
// console.log(state);

// declaring variables
let homePrice,
  downPayment,
  monthlyInterest,
  monthlyHOA,
  monthlyPropertyTax,
  totalMonthlyPayments,
  principleLoan,
  monthlyPrincipleAndInterest,
  monthlyHomeInsurance,
  monthlyTotal;

// adding event listener to all input text fields
let inputTexts = document.getElementsByClassName("form__textInput");

for (let i = 0; i < inputTexts.length; i++) {
  inputTexts[i].addEventListener("input", updateInputsState);
}

// adding event listener to the select tag/dropdown menue
let selectTexts = document.getElementsByClassName("form__selectInput")[0];
let rangeSlider = document.getElementsByClassName("form__rangeSlider")[0];

selectTexts.addEventListener("input", updateInputsState);
rangeSlider.addEventListener("input", updateInputsState);

// updating the state
function updateInputsState(event) {
  let name = event.target.name;
  let value = Number(event.target.value);

  if (name == "interest_rate") {
    value = parseFloat(value);
  }

  state = {
    ...state,
    [name]: value, // [name] displays the value of the variable 'name.' e.g. if event.target.name = 'price' and so on
  };
  console.log(state);
  calc();
}

document.getElementsByTagName("form")[0].addEventListener("submit", (event) => {
  event.preventDefault();

  calc();
});

// calculating the
function calc() {
  // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]

  // M is monthly mortgage payments or monthly principle & interest payments

  // P = principal loan amount, or price of home after downpayment is subtracted

  // i = monthly interest rate

  // n = number of months required to repay the loan

  homePrice = state.price;
  downPayment = state.down_payment;
  principleLoan = homePrice - downPayment;
  monthlyInterest = state.interest_rate / 100 / 12;
  monthlyHOA = state.hoa / 12;
  monthlyPropertyTax = (state.property_tax / 12).toFixed(2);
  totalMonthlyPayments = state.loan_term * 12;
  monthlyHomeInsurance = state.home_insurance / 12;

  monthlyPrincipleAndInterest = (
    (principleLoan *
      (monthlyInterest * (1 + monthlyInterest) ** totalMonthlyPayments)) /
    ((1 + monthlyInterest) ** totalMonthlyPayments - 1)
  ).toFixed(2);

  monthlyTotal =
    parseFloat(monthlyPrincipleAndInterest) +
    parseFloat(monthlyHOA) +
    parseFloat(monthlyHomeInsurance) +
    parseFloat(monthlyPropertyTax);

  document.getElementsByClassName(
    "result--monthlyTotal"
  )[0].innerHTML = parseFloat(monthlyTotal).toFixed(2);
  document.getElementsByClassName(
    "result--monthlyPrincipleAndInterest"
  )[0].innerHTML = parseFloat(monthlyPrincipleAndInterest).toFixed(2);
  document.getElementsByClassName(
    "result--monthlyHOA"
  )[0].innerHTML = parseFloat(monthlyHOA).toFixed(2);
  document.getElementsByClassName(
    "result--monthlyHomeInsurance"
  )[0].innerHTML = parseFloat(monthlyHomeInsurance).toFixed(2);
  document.getElementsByClassName(
    "result--monthlyPropertyTax"
  )[0].innerHTML = parseFloat(monthlyPropertyTax).toFixed(2);

  updateChart(myChart, labels, backgroundColor);
}

// from Chartjs.org, using doughnut  chart
labels = [
  "Principal & Interest",
  "Homeowner's Insurance",
  "Property Tax",
  "HOA",
];

backgroundColor = ["#1e3799", "#f6b93b", "#e55039", "#78e08f"];

borderColor = ["#1e3799", "#f6b93b", "#e55039", "#78e08f"];

let ctx = document.getElementById("myChart").getContext("2d"); // from Chartjs.rog
let myChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: labels,
    datasets: [
      {
        data: [
          monthlyPrincipleAndInterest,
          monthlyHomeInsurance,
          monthlyPropertyTax,
          monthlyHOA,
        ],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  },
});
myChart.options.animation = false;

// update chart after changing input values
function updateChart(chart, label, color) {
  chart.data.datasets.pop();
  chart.data.datasets.push({
    label: label,
    backgroundColor: color,
    data: [
      monthlyPrincipleAndInterest,
      monthlyHomeInsurance,
      monthlyPropertyTax,
      monthlyHOA,
    ],
  });

  chart.options.transitions.active.animation.duration = 0;
  chart.update();
}

calc();
