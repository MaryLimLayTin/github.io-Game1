let player;

// This tracks the "Global State" of your game
let gameState = {
    hasKeycard: false,
    hasData: false
};

const VIDEO_ID_FOR_LAB = 'lKCzsFzCVro'
const VIDEO_ID_FOR_PERIMETER = ''
const VIDEO_ID_1 = ''
const VIDEO_ID_2 = 'o_85aRHS_eY'
const VIDEO_ID_HERE = 'lYg02bByXB8'
const NEW_VIDEO_ID = 'XM0GbrwbQAo'
const SUCCESS_VIDEO_ID = 'B9yuJD3fwO4'

const gameData = {
    "start": {
        "videoId": "lYg02bByXB8",
        "choices": [
            { "text": "Go to Lab", "nextScene": "lab_room" },
            { "text": "Check Security", "nextScene": "perimeter" }
        ]
    },
    "lab_room": {
        "videoId": VIDEO_ID_2,
        "choices": [
            { "text": "Analyze Sample", "nextScene": "victory" },
            { "text": "Back to Start", "nextScene": "start" }
        ]
    }
};

// Toggle the Sidebar
function toggleMenu() {
    const menu = document.getElementById("side-menu");
    if (menu.style.width === "250px") {
        menu.style.width = "0";
    } else {
        menu.style.width = "250px";
    }
}

// Function to Jump to a New Video from the Menu
function jumpToScene(sceneType) {
    toggleMenu(); // Close menu after selection
    
    let nextVideoId = "";
    
    if (sceneType === 'start') nextVideoId = 'dQw4w9WgXcQ';
    if (sceneType === 'lab') nextVideoId = VIDEO_ID_HERE;
    
    // Use the global 'player' object we created earlier
    player.loadVideoById(nextVideoId);
    
    // Hide the buttons overlay while the new video starts
    document.getElementById('ui-overlay').classList.add('hidden');
}

// 1. This function is called by the YouTube API automatically
/*function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: 'lYg02bByXB8', // Replace with your starting Video ID
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}*/

/*
function pickChoice(choice) {
    if (choice === 'lab') {
        player.loadVideoById(NEW_VIDEO_ID); // Load the next part
        
        // UNLOCK ITEM IN SIDE MENU
        const keycard = document.getElementById('item-keycard');
        keycard.innerHTML = "[\u2713] Lab Keycard"; // Adds a checkmark
        keycard.style.color = "#27ae60"; // Turns it green
    }
    
    // Always hide the overlay after a choice is made
    document.getElementById('ui-overlay').classList.add('hidden');
}*/

function pickChoice(choice) {
    if (choice === 'lab') {
        gameState.hasKeycard = true; // Update the state
        
        // Update Sidebar UI
        const item = document.getElementById('item-keycard');
        item.innerHTML = "[\u2713] Lab Keycard";
        item.style.color = "#27ae60";

        // Optional: Load a "Success" video clip
        player.loadVideoById(SUCCESS_VIDEO_ID);
    }
    
    document.getElementById('ui-overlay').classList.add('hidden');
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: 'lYg02bByXB8', 
        host: 'https://www.youtube.com', // Explicitly set the host
        playerVars: {
            'origin': window.location.origin, // Tells YouTube where you are hosting from
            'enablejsapi': 1,
            'widget_referrer': window.location.origin
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

// 2. Watch for the video to end
/* function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        document.getElementById('ui-overlay').classList.remove('hidden');
    }
} */

/*
function onPlayerStateChange(event) {
    console.log("Player State Changed to:", event.data); // Should show '0' when ended
    
    if (event.data == YT.PlayerState.ENDED) {
        console.log("Video ended! Attempting to unhide overlay...");
        const overlay = document.getElementById('ui-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            console.log("Class 'hidden' removed.");
        } else {
            console.error("Could not find element with ID 'ui-overlay'");
        }
    }
} */

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        const overlay = document.getElementById('ui-overlay');
        overlay.classList.remove('hidden');

        // Logic: If they already have the keycard, hide the 'Go to Lab' button
        const labButton = document.getElementById('btn-lab'); 
        if (gameState.hasKeycard) {
            labButton.style.display = 'none'; // Hide the button
        } else {
            labButton.style.display = 'inline-block'; // Show it if they don't have it
        }
    }
}

// 3. Handle the button clicks
function handleChoice(path) {
    document.getElementById('ui-overlay').classList.add('hidden');
    
    if (path === 'left') {
        player.loadVideoById(VIDEO_ID_FOR_LAB); // Replace with actual ID
    } else {
        player.loadVideoById(VIDEO_ID_FOR_PERIMETER); // Replace with actual ID
    }
}