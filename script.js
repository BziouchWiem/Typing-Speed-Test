document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textDisplay = document.getElementById('text-display');
    const textInput = document.getElementById('text-input');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const timerElement = document.getElementById('timer');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    
    // Sample texts for typing test
    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
        "Cute kittens play happily with colorful yarn balls. Fluffy puppies chase their tiny tails in circles. Kawaii animals bring joy to everyone!",
        "JavaScript makes web pages interactive and fun. HTML structures content while CSS makes it pretty. Together they create magic on the internet!",
        "Pink cupcakes with rainbow sprinkles taste delicious. Bubble tea with tapioca pearls is so refreshing. Sweet treats make life happier every day!"
    ];
    
    // Test variables
    let timer;
    let timeLeft = 60;
    let isTestRunning = false;
    let isTestComplete = false;
    let startTime, endTime;
    let currentText = '';
    let currentPosition = 0;
    let correctCharacters = 0;
    let totalTypedCharacters = 0;
    
    // Initialize
    loadRandomText();
    
    // Event Listeners
    startBtn.addEventListener('click', startTest);
    stopBtn.addEventListener('click', stopTest);
    resetBtn.addEventListener('click', resetTest);
    textInput.addEventListener('input', checkTyping);
    
    // Functions
    function loadRandomText() {
        currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        renderText();
    }
    
    function renderText() {
        let html = '';
        for (let i = 0; i < currentText.length; i++) {
            let char = currentText[i];
            let charClass = '';
            
            if (i < currentPosition) {
                charClass = 'correct';
            } else if (i === currentPosition) {
                charClass = 'current';
            }
            
            html += `<span class="${charClass}">${char}</span>`;
        }
        textDisplay.innerHTML = html;
    }
    
    function startTest() {
        if (isTestRunning) return;
        
        isTestRunning = true;
        isTestComplete = false;
        startTime = new Date();
        timeLeft = 60;
        
        // Enable/disable controls
        textInput.disabled = false;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        resetBtn.disabled = false;
        
        // Focus on input
        textInput.value = '';
        textInput.focus();
        
        // Start timer
        timer = setInterval(updateTimer, 1000);
        updateStats();
    }
    
    function updateTimer() {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endTest();
        }
    }
    
    function checkTyping() {
        const typedText = textInput.value;
        currentPosition = typedText.length;
        totalTypedCharacters++;
        
        // Check if character is correct
        if (typedText === currentText.substring(0, currentPosition)) {
            correctCharacters++;
        }
        
        // Check if text is completed
        if (currentPosition === currentText.length) {
            loadRandomText();
            textInput.value = '';
            currentPosition = 0;
        }
        
        renderText();
        updateStats();
    }
    
    function updateStats() {
        // Calculate time elapsed in seconds
        const timeElapsedInSeconds = Math.max(1, 60 - timeLeft); // Minimum 1 second to avoid division by zero
        const timeElapsedInMinutes = timeElapsedInSeconds / 60;
        
        // Calculate WPM (Words Per Minute)
        const wordsTyped = correctCharacters / 5; // 5 characters = 1 word
        const wpm = Math.round(wordsTyped / timeElapsedInMinutes);
        
        // Calculate accuracy
        const accuracy = totalTypedCharacters > 0 
            ? Math.round((correctCharacters / totalTypedCharacters) * 100) 
            : 0;
        
        wpmElement.textContent = wpm;
        accuracyElement.textContent = accuracy;
    }
    
    function stopTest() {
        if (!isTestRunning) return;
        
        clearInterval(timer);
        isTestComplete = true;
        isTestRunning = false;
        endTime = new Date();
        
        // Update stats with final values
        updateStats();
        
        // Disable input and buttons
        textInput.disabled = true;
        stopBtn.disabled = true;
        
        // Show completion message
        textDisplay.innerHTML = `<span class="complete-message">Complete! 🎉</span>${textDisplay.innerHTML}`;
    }
    
    function endTest() {
        clearInterval(timer);
        isTestRunning = false;
        textInput.disabled = true;
        endTime = new Date();
        updateStats();
        
        if (!isTestComplete) {
            textDisplay.innerHTML = `<span class="complete-message">Time's up! ⏰</span>${textDisplay.innerHTML}`;
        }
        
        stopBtn.disabled = true;
    }
    
    function resetTest() {
        clearInterval(timer);
        isTestRunning = false;
        isTestComplete = false;
        timeLeft = 60;
        currentPosition = 0;
        correctCharacters = 0;
        totalTypedCharacters = 0;
        
        timerElement.textContent = timeLeft;
        wpmElement.textContent = '0';
        accuracyElement.textContent = '0';
        
        textInput.value = '';
        textInput.disabled = true;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        resetBtn.disabled = true;
        
        loadRandomText();
        
        // Remove completion message if any
        textDisplay.innerHTML = textDisplay.innerHTML.replace('<span class="complete-message">Complete! 🎉</span>', '')
                                                   .replace('<span class="complete-message">Time\'s up! ⏰</span>', '');
    }
});