function updateLocalTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById('localTime').textContent = `${timeString}`;
    document.getElementById('localDate').textContent = `${dayName} ${dateString}`;
}

// Tab switching functionality
function setupTabs() {
    const timerTab = document.getElementById('timerTab');
    const stopwatchTab = document.getElementById('stopwatchTab');
    const timerContent = document.getElementById('timerContent');
    const stopwatchContent = document.getElementById('stopwatchContent');
    
    timerTab.addEventListener('click', function() {
        timerTab.classList.add('active');
        stopwatchTab.classList.remove('active');
        timerContent.classList.add('active');
        stopwatchContent.classList.remove('active');
    });
    
    stopwatchTab.addEventListener('click', function() {
        stopwatchTab.classList.add('active');
        timerTab.classList.remove('active');
        stopwatchContent.classList.add('active');
        timerContent.classList.remove('active');
    });
}

// Timer functionality
let timerInterval;
let seconds = 1500; // Default 25 minutes

function updateTimerDisplay() {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    // Check if we're resuming or starting fresh
    if (document.getElementById('startTimer').textContent === 'Start') {
        // Get minutes from input
        const minutesInput = document.getElementById('minutes');
        seconds = parseInt(minutesInput.value) * 60;
        updateTimerDisplay();
    }
    
    // Clear any existing interval
    clearInterval(timerInterval);
    
    // Start the countdown
    timerInterval = setInterval(() => {
        seconds--;
        updateTimerDisplay();
        
        if (seconds <= 0) {
            clearInterval(timerInterval);
            alert('Timer completed!');
            document.getElementById('startTimer').textContent = 'Start';
        }
    }, 1000);
    
    // Change button text
    document.getElementById('startTimer').textContent = 'Pause';
    document.getElementById('startTimer').onclick = pauseTimer;
}

function pauseTimer() {
    clearInterval(timerInterval);
    document.getElementById('startTimer').textContent = 'Resume';
    document.getElementById('startTimer').onclick = startTimer;
}

function resetTimer() {
    clearInterval(timerInterval);
    const minutesInput = document.getElementById('minutes');
    seconds = parseInt(minutesInput.value) * 60;
    updateTimerDisplay();
    document.getElementById('startTimer').textContent = 'Start';
    document.getElementById('startTimer').onclick = startTimer;
}

// Stopwatch functionality
let stopwatchInterval;
let stopwatchRunning = false;
let stopwatchTime = 0;
let lapCount = 0;

function updateStopwatchDisplay() {
    const hours = Math.floor(stopwatchTime / 3600000);
    const minutes = Math.floor((stopwatchTime % 3600000) / 60000);
    const seconds = Math.floor((stopwatchTime % 60000) / 1000);
    const milliseconds = Math.floor((stopwatchTime % 1000) / 10);
    
    document.getElementById('stopwatchDisplay').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

function startStopwatch() {
    if (!stopwatchRunning) {
        const startTime = Date.now() - stopwatchTime;
        stopwatchInterval = setInterval(() => {
            stopwatchTime = Date.now() - startTime;
            updateStopwatchDisplay();
        }, 10);
        
        document.getElementById('startStopwatch').textContent = 'Pause';
        document.getElementById('lapStopwatch').disabled = false;
        stopwatchRunning = true;
    } else {
        clearInterval(stopwatchInterval);
        document.getElementById('startStopwatch').textContent = 'Resume';
        stopwatchRunning = false;
    }
}

function lapStopwatch() {
    if (stopwatchRunning) {
        lapCount++;
        const lapTime = stopwatchTime;
        
        // Create lap item container
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        
        // Format time
        const hours = Math.floor(lapTime / 3600000);
        const minutes = Math.floor((lapTime % 3600000) / 60000);
        const seconds = Math.floor((lapTime % 60000) / 1000);
        const milliseconds = Math.floor((lapTime % 1000) / 10);
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        
        // Create elements for the lap display
        const lapNumber = document.createElement('span');
        lapNumber.className = 'lap-number';
        lapNumber.textContent = `Lap ${lapCount}: `;
        
        const lapTimeDisplay = document.createElement('span');
        lapTimeDisplay.className = 'lap-time';
        lapTimeDisplay.textContent = timeString;
        
        // Create lap name elements
        const lapNameContainer = document.createElement('div');
        lapNameContainer.className = 'lap-name-container';
        
        const lapNameInput = document.createElement('input');
        lapNameInput.type = 'text';
        lapNameInput.className = 'lap-name-input';
        lapNameInput.placeholder = 'Enter lap name...';
        
        const saveButton = document.createElement('button');
        saveButton.className = 'save-name-button';
        saveButton.textContent = 'Save';
        
        const lapNameDisplay = document.createElement('span');
        lapNameDisplay.className = 'lap-name-display';
        lapNameDisplay.style.display = 'none';
        
        // Add save functionality
        saveButton.addEventListener('click', function() {
            const name = lapNameInput.value.trim();
            if (name) {
                lapNameDisplay.textContent = ` - ${name}`;
                lapNameDisplay.style.display = 'inline';
                lapNameContainer.removeChild(lapNameInput);
                lapNameContainer.removeChild(saveButton);
            }
        });
        
        // Assemble lap item
        lapItem.appendChild(lapNumber);
        lapItem.appendChild(lapTimeDisplay);
        lapNameContainer.appendChild(lapNameInput);
        lapNameContainer.appendChild(saveButton);
        lapNameContainer.appendChild(lapNameDisplay);
        lapItem.appendChild(lapNameContainer);
        
        // Add to laps container
        const lapsContainer = document.getElementById('laps');
        lapsContainer.insertBefore(lapItem, lapsContainer.firstChild);
        
        // Focus on the name input for immediate typing
        lapNameInput.focus();
    }
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    lapCount = 0;
    updateStopwatchDisplay();
    document.getElementById('startStopwatch').textContent = 'Start';
    document.getElementById('lapStopwatch').disabled = true;
    document.getElementById('laps').innerHTML = '';
    stopwatchRunning = false;
}

// Initialize on page load
window.onload = function() {
    // Set up local time with 1-second updates
    updateLocalTime();
    setInterval(updateLocalTime, 1000);
    
    // Set up tabs
    setupTabs();
    
    // Set up timer controls
    document.getElementById('startTimer').onclick = startTimer;
    document.getElementById('resetTimer').onclick = resetTimer;
    updateTimerDisplay();
    
    // Set up stopwatch controls
    document.getElementById('startStopwatch').onclick = startStopwatch;
    document.getElementById('lapStopwatch').onclick = lapStopwatch;
    document.getElementById('resetStopwatch').onclick = resetStopwatch;
    updateStopwatchDisplay();
};