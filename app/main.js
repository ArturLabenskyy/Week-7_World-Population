const regions = document.querySelectorAll(`.region`);
const nameList = document.querySelector(`.name-list`);
let myChart = document.querySelector(`#graphic`);

regions.forEach((el) => {
    el.addEventListener(`click`, (e) => {
        getRegionPopulation(el.textContent);
    });
});

async function getRegionPopulation(region) {
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
            // createChart(regionCountryNames, regionCountryPopulation);
        });
        createChart(regionCountryNames, regionCountryPopulation);
    } catch (error) {
        console.log(error);
    }
}

function addClickToCountry(countryButton) {
    countryButton.addEventListener(`click`, (e) => {
        getCountryPopulation(countryButton.textContent);
    });
}

async function getCountryPopulation(countryName) {
    const cityNames = [];
    const cityPopulation = [];
    try {
        const res = await fetch(
            "https://countriesnow.space/api/v0.1/countries"
        );
        if (!res.ok) throw new Error(`Huston, we have a problem!!!`);
        const data = await res.json();
        nameList.innerHTML = ``;
        data.data.forEach((el) => {
            if (el.country === countryName) {
                el.cities.forEach((cityName) => {
                    // let city = document.createElement(`button`);
                    // city.textContent = cityName;
                    // city.classList.add(`bottom-btn`);
                    // nameList.appendChild(city);
                    // cityNames.push(cityName);
                    getCityPopulation(cityName, cityPopulation, cityNames);
                    // createChart(cityNames, cityPopulation);

                    // cityPopulation.push(cityPop);
                });
            }
        });
        console.log(cityNames);
        console.log(cityPopulation);
        // createChart(cityNames, cityPopulation);
    } catch (error) {
        console.log(error);
    }
}

function getCityPopulation(cityName, populationArray, cityNameArray) {
    fetch("https://countriesnow.space/api/v0.1/countries/population/cities", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            city: cityName,
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            cityNameArray.push(response.data.city);
            populationArray.push(response.data.populationCounts[0].value);
            createChart(cityNameArray, populationArray);
            // console.log(response.data.city);
            // console.log(response.data.populationCounts[0].value);
        })
        .catch((error) => console.log(`We have some problem`, error));
}

function createChart(x, y) {
    let chartStatus = Chart.getChart("graphic"); // <canvas> id
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
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
}
