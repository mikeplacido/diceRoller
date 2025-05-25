
if (window.Chart && window['chartjs-plugin-annotation']) {
  Chart.register(window['chartjs-plugin-annotation']);
}

document.addEventListener('DOMContentLoaded', () => {
  // set default values

  const btnRollDice = document.getElementById('btnRollDice');
  const btnReset = document.getElementById('btnReset');
  const displayResultsText = document.getElementById('displayResultsText');
  const inpNumberRolls = document.getElementById('inpNumberRolls');
  const inpTime = document.getElementById('inpTime');
  // set default values
  ResetForm();
  

  // click event listeners
  btnRollDice.addEventListener('click', RollDice);
  btnReset.addEventListener('click', ResetForm);

  // input event listeners
  inpTime.addEventListener('mouseover', () => {
    inpNumberRolls.setAttribute('disabled', true);
    inpTime.removeAttribute('disabled');
  });
  inpNumberRolls.addEventListener('mouseover', () => {
    inpTime.setAttribute('disabled', true);
    inpNumberRolls.removeAttribute('disabled');
  });
});

let results = [];

function ResetForm() {
  results = [];
  displayResultsText.innerHTML = '';
  displayAnalysis.innerHTML = '';
  inpNumberRolls.value = 20;
  inpTime.value = 1;
  inpNumberRolls.removeAttribute('disabled');
  inpTime.setAttribute('disabled', true);
  const existingChart = document.getElementById('myChart');
  if (existingChart) {
    chartContainer.removeChild(existingChart);
  }
}

// function RollMultipleDice () {
//   const numberDice = parseInt(
//     document.getElementById('inpNumberDice').value
//   );

//   for (let i = 0; i < numberDice; i++)
//   {
//     result = Math.floor(Math.random() * 6) + 1;
//     results.push(result);
//   }
// }

function RollDice() {
  if (inpNumberRolls.getAttribute('disabled') === null) {
    const numberRolls = parseInt(
      document.getElementById('inpNumberRolls').value
    );
    RollDiceForNumber(numberRolls);
  } else if (inpTime.getAttribute('disabled') === null) {
    RollDiceForTime();
  }
}
function RollDiceForNumber(numberRolls) {
  for (let i = 0; i < numberRolls; i++) {
    const thisResult = Math.floor(Math.random() * 6) + 1;
    results.push(thisResult);
    setTimeout(() => {
      ResultTicker(thisResult);
    }, 100 * i);
  }
  DisplayAnalysis();
}

function RollDiceForTime() {
  //get the time in ms
  const duration = inpTime.value * 1000;
  // set interval for rolls in ms
  const interval = 100;
  // set time elapsed
  let timeElapsed = 0;
  // produce results for the duration
  const timer = setInterval(() => {
    RollDiceForNumber(1);
    timeElapsed += interval;
    // check if time elapsed is greater than duration
    if (timeElapsed >= duration) {
      clearInterval(timer);
      DisplayAnalysis();
    }
  }, interval);
}

// ticker for results
function ResultTicker(result) {
  displayResultsText.innerHTML += `${result}   `;
}



//display analysis
function DisplayAnalysis() {
  const analysis = AnalyseResults();
  displayAnalysis.innerHTML = `
    <div id="analysisText">
      <p>Total: ${analysis[0]} &nbsp;&nbsp; Average: ${analysis[1]}</p>
    </div>
    <div id="analysisFlex">
      <div id="analysisTable">
        <table>
          <tr>
            <th></th>
            <th>Count</th>
          </tr>
          <tr>
            <td id="dice">&#9856</td>
            <td>${analysis[2][0]}</td>
          </tr>
          <tr>
            <td id="dice">&#9857</td>
            <td>${analysis[2][1]}</td>
          </tr>
          <tr>
            <td id="dice">&#9858</td>
            <td>${analysis[2][2]}</td>
          </tr>
          <tr>
            <td id="dice">&#9859</td>
            <td>${analysis[2][3]}</td>
          </tr>
          <tr>
            <td id="dice">&#9860</td>
            <td>${analysis[2][4]}</td>
          </tr>
          <tr>
            <td id="dice">&#9861</td>
            <td>${analysis[2][5]}</td>
          </tr>
        </table>
      </div>
      <div id="chartContainer"></div>
    </div>
  `;
  createChart();
}
// Analyse results get total, average and count of each die face
function AnalyseResults() {
  const total = results.reduce((acc, val) => acc + val, 0);
  const average = total / results.length;
  const count = [0, 0, 0, 0, 0, 0];
  results.forEach((result) => {
    count[result - 1]++;
  });

  return [total, average.toFixed(2), count];
}

function createChart() {
  const ctx = document.createElement('canvas');
  const chartContainer = document.getElementById('chartContainer');
  // Clear previous chart if exists
  const existingChart = document.getElementById('myChart');
  if (existingChart) {
    chartContainer.removeChild(existingChart);
  }
  ctx.id = 'myChart';
  chartContainer.appendChild(ctx);

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: results.length }, (_, i) => i + 1),
      datasets: [
        {
          label: 'Running Average',
          data: results.map((_, index) => {
            const slice = results.slice(0, index + 1);
            return Number(
              slice.reduce((sum, val) => sum + val, 0) /
              (index + 1)
            ).toFixed(2);
          }),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Number of Rolls',
          },
        },
        y: {
          min: 1,
          max: 6,
          ticks: {
            stepSize: 1,
          },
          title: {
            display: true,
            text: 'Average Result',
          },
        },
      },
      plugins: {
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              yMin: 3.5,
              yMax: 3.5,
              borderColor: 'red',
              borderWidth: 2,
            },
          },
        },
      },
    },
  });
}


