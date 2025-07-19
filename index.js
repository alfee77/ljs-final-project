import FetchWrapper from "./fetch-wrapper.js";
import { capitalize, calculateCalories } from "./helpers.js";
import AppData from "./app-data.js";
import Chart from "chart.js/auto";

const logFoodAPI = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/alfee77food"
);
const appData = new AppData();
const form = document.querySelector("#create-form");
const name = document.querySelector("#create-name");
const carbs = document.querySelector("#create-carbs");
const protein = document.querySelector("#create-protein");
const fat = document.querySelector("#create-fat");
const foodToAdd = { fields: {} };
const foodList = document.querySelector("#food-list");

const displayEntry = (pFoodList, pName, pCarbs, pProtein, pFat) => {
  pFoodList.insertAdjacentHTML(
    "afterbegin",
    `<li class="card">
      <div>
        <h3 class="name">${capitalize(pName)}</h3>
        <div class="calories">${calculateCalories(
          pCarbs,
          pProtein,
          pFat
        )} calories</div>
        <ul class="macros">
          <li class="carbs"><div>Carbs</div><div class="value">${pCarbs}g</div></li>
          <li class="protein"><div>Protein</div><div class="value">${pProtein}g</div></li>
          <li class="fat"><div>Fat</div><div class="value">${pFat}g</div></li> 
        </ul>
      </div>
    </li>`
  );
  appData.addFood(pCarbs, pProtein, pFat);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  foodToAdd.fields.name = { stringValue: name.value };
  foodToAdd.fields.carbs = { integerValue: carbs.value };
  foodToAdd.fields.protein = { integerValue: protein.value };
  foodToAdd.fields.fat = { integerValue: fat.value };

  logFoodAPI.post("/", foodToAdd).then((data) => {
    if (!data.error) {
      displayEntry(foodList, name.value, carbs.value, protein.value, fat.value);
      console.log("Good");
      render();
      form.reset();
    } else {
      console.log("Shitty fuck!!");
    }
  });
});

const init = () => {
  logFoodAPI.get("/?pageSize=5").then((data) => {
    data.documents?.forEach((entry) => {
      const fields = entry.fields;
      displayEntry(
        foodList,
        fields.name.stringValue,
        fields.carbs.integerValue,
        fields.protein.integerValue,
        fields.fat.integerValue
      );
    });
    render();
  });
};

let chartInstance = null;

const renderChart = () => {
  const context = document.querySelector("#app-chart").getContext("2d");
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(context, {
    type: "bar",
    data: {
      labels: ["Carbs", "Protein", "Fat"],
      datasets: [
        {
          label: "Macronutrients",
          data: [
            appData.getTotalCarbs(),
            appData.getTotalProtein(),
            appData.getTotalFat(),
          ],
          backgroundColor: ["#25AEEE", "#FECD52", "#57D269"],
          hoverBackgroundColor: ["grey", "grey", "grey"],
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
};

const render = () => {
  document.querySelector("#total-calories").innerHTML =
    appData.getTotalCalories();
  renderChart();
};

init();
