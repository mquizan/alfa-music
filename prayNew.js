// Set the API endpoint and parameters
const cityData = document.getElementById('city-data').innerHTML;
const url = 'https://api.aladhan.com/v1/timingsByCity';
const params = {
    city: cityData,
    country: 'KSA',
    method: 4,
    school: 0,

};
// Set the API headers
const http = 'http';
const headers = ((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://api.aladhan.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
});

function fetchPrayerTimes() {
    // Fetch the prayer times from the API
    fetch(`${url}?${new URLSearchParams(params)}`, { headers })
        .then(response => response.json())
        .then(data => {
            // Extract the prayer times for today
            const prayerTimes = data.data.timings;
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            const times = [
                { prayer: 'Fajr', time: prayerTimes.Fajr },
                { prayer: 'Sunrise', time: prayerTimes.Sunrise },
                { prayer: 'Dhuhr', time: prayerTimes.Dhuhr },
                { prayer: 'Asr', time: prayerTimes.Asr },
                { prayer: 'Maghrib', time: prayerTimes.Maghrib },
                { prayer: 'Isha', time: prayerTimes.Isha }
            ];
            // Display the prayer times on the webpage
            const prayerTimesElement = document.getElementById('prayer-times');
            prayerTimesElement.innerHTML = ''; // Clear previous prayer times
            times.forEach(time => {
                const row = document.createElement('tr');
                const prayerCell = document.createElement('td');
                prayerCell.innerText = time.prayer;
                row.appendChild(prayerCell);
                const timeCell = document.createElement('td');
                let count = 1;
                timeCell.classList.add('pTime');
                timeCell.innerText = time.time;
                row.appendChild(timeCell);
                prayerTimesElement.appendChild(row);
            });

            // Add the date to the header
            const headerElement = document.querySelector('.headtext');
            headerElement.innerText = `Prayer Times for ${today}`;

            // Update the next prayer time
            displayNextPrayerTime();
        })
        .catch(error => console.log(error));
}

// Function to check prayer times and perform actions
function checkPrayerTimes() {
  const delay = 32;
  const bodyBox = document.getElementById('body-box');
  const timeElement = document.getElementById('time');
  const now = new Date();
  const cells = document.querySelectorAll('.pTime');
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const futureMinute = (currentMinute + 3) % 60;
  const cellValues = [];

  cells.forEach(cell => {
    const cellTime = cell.innerText;
    const cellHour = parseInt(cellTime.split(':')[0], 10);
    const cellMinute = parseInt(cellTime.split(':')[1], 10);


if (currentHour === cellHour && futureMinute === cellMinute) {
    const spotifyEmbed = document.querySelector('iframe');
    let isPlaying = false; // Track the playback state
    bodyBox.style.display = 'block';
    
    spotifyEmbed.contentWindow.postMessage({
        command: 'pause'
    }, '*');

    setTimeout(() => {
        timeElement.style.backgroundColor = '#fff';
        bodyBox.style.display = 'none';
        spotifyEmbed.contentWindow.postMessage({
            command: 'play'
        }, '*');
        cellValues.push(cell.innerText); // Save cell value
    }, 15 * 60 * 1000); // 15 minutes
}

  localStorage.setItem('cellValues', JSON.stringify(cellValues)); // Store cell values in local storage

const jsonValue = localStorage.getItem('cellValues');
const timeValues = JSON.parse(jsonValue);

console.log(timeValues);


// Function to find the next prayer time
function findNextPrayerTime() {
    const now = new Date();
    const currentTime = now.getTime();
    const cells = document.querySelectorAll('.pTime');
    let nextPrayerTime = null;
    cells.forEach(cell => {
        const cellTime = cell.innerText;
        const cellHour = parseInt(cellTime.split(':')[0], 10);
        const cellMinute = parseInt(cellTime.split(':')[1], 10);
        const prayerTime = new Date();
        prayerTime.setHours(cellHour, cellMinute, 0);
        if (prayerTime.getTime() > currentTime && !nextPrayerTime) {
            nextPrayerTime = prayerTime;
        }
    });
    return nextPrayerTime;
}

// Function to display the next prayer time
function displayNextPrayerTime() {
    const nextPrayerTime = findNextPrayerTime();
    const nextPrayerTimeElement = document.getElementById('next-prayer-time');
    if (nextPrayerTime) {
        const nextPrayerTimeString = nextPrayerTime.toLocaleTimeString([], { timeStyle: 'short' });
        nextPrayerTimeElement.innerText = `${nextPrayerTimeString}`;
    } else {
        nextPrayerTimeElement.innerText = 'Upcoming prayer time will be on the next day.';
    }
}

// Call the fetchPrayerTimes function initially to load the prayer times
fetchPrayerTimes();

// Call the checkPrayerTimes function every minute to check and perform actions
setInterval(checkPrayerTimes, 10000);

// Call the fetchPrayerTimes function every day at 12 AM to reload the prayer times
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        fetchPrayerTimes();
    }
}, 60000);
