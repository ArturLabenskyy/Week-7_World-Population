const regions = document.querySelectorAll(`.region`);
const nameList = document.querySelector(`.name-list`);
const spinner = document.querySelector(`.loader`);
let myChart = document.querySelector(`#graphic`);

regions.forEach((el) => {
    el.addEventListener(`click`, (e) => {
        getRegionPopulation(el.textContent);
    });
});

async function getRegionPopulation(region) {
    nameList.style.display = `block`;
    spinner.style.display = `block`;
    deactivateButtons(regions);
    const regionCountryNames = [];
    const regionCountryPopulation = [];
    try {
        const res = await fetch(
            `https://restcountries.com/v3.1/region/${region}`
        );
        if (!res.ok) throw new Error(`Huston, we have a problem!!!`);
        const data = await res.json();
        nameList.innerHTML = ``;
        data.forEach((el) => {
            let country = document.createElement(`button`);
            country.textContent = el.name.common;
            country.classList.add(`bottom-btn`);
            nameList.appendChild(country);
            addClickToCountry(country);
            regionCountryNames.push(el.name.common);
            regionCountryPopulation.push(el.population);
        });
        createChart(regionCountryNames, regionCountryPopulation);
    } catch (error) {
        console.log(error);
    }
    spinner.style.display = `none`;
    activateButtons(regions);
}

function getCountryPopulation(countryName) {
    nameList.style.display = `none`;
    spinner.style.display = `block`;
    destroyChart();
    deactivateButtons(regions);
    const cityNames = [];
    const cityPopulation = [];
    const raw = {
        limit: 1000,
        order: "asc",
        orderBy: "name",
        country: countryName,
    };

    fetch(
        "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(raw),
        }
    )
        .then((response) => response.json())
        .then((data) => {
            data.data.forEach((el) => {
                cityNames.push(el.city);
                cityPopulation.push(el.populationCounts[0].value);
                createChart(cityNames, cityPopulation);
            });
        })
        .catch((error) => console.log(`Huston, we got a problem!!!`, error));
}

function createChart(x, y) {
    destroyChart();
    let populationChart = new Chart(myChart, {
        type: `bar`,
        data: {
            labels: x,
            datasets: [
                {
                    label: `Population`,
                    data: y,
                },
            ],
        },
        options: {},
    });
    spinner.style.display = `none`;
    activateButtons(regions);
}

function addClickToCountry(countryButton) {
    countryButton.addEventListener(`click`, (e) => {
        window.scrollTo({ top: 0, behavior: "auto" });
        getCountryPopulation(countryButton.textContent);
    });
}

function deactivateButtons(buttonsList) {
    buttonsList.forEach((el) => {
        el.disabled = true;
    });
}

function activateButtons(buttonsList) {
    buttonsList.forEach((el) => {
        el.disabled = false;
    });
}

function destroyChart() {
    let chartStatus = Chart.getChart("graphic"); // <canvas> id
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
}
