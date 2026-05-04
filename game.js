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
const VIDEO_ID_BEGIN = 'lYg02bByXB8'
const VIDEO_ID_LAB = 'lYg02bByXB8'
const VIDEO_ID_SECURE = 'dQAGx9goPfk'
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

// 1. Define the items hidden in the video
const hiddenItems = [
    { name: 'Keycard', timeStart: 10, timeEnd: 15, id: 'item-keycard' },
    { name: 'Data Disk', timeStart: 45, timeEnd: 50, id: 'item-data' }
];


// 2. The "Stopwatch" function
function monitorVideoItems() {
    if (player && player.getCurrentTime) {
        let now = player.getCurrentTime();
        let foundSomething = false;

        hiddenItems.forEach(item => {
            // Sense if we are inside the specific time window for this item
            if (now >= item.timeStart && now <= item.timeEnd && !gameState[item.id]) {
                showCollectionButton(item);
                foundSomething = true;
            }
        });

        // CRITICAL: If no items match the current time, clear the screen
        if (!foundSomething) {
            const overlay = document.getElementById('ui-overlay');
            // We only hide it if it doesn't contain the "Choice" buttons (toLab/toPerimeter)
            if (!overlay.innerHTML.includes('to Lab')) { 
                overlay.classList.add('hidden');
            }
        }
    }
}

// 3. Update UI
function showCollectionButton(item) {
    const overlay = document.getElementById('ui-overlay');
    overlay.innerHTML = `<button onclick="collectItem('${item.id}', '${item.name}')">Collect ${item.name}</button>`;
    overlay.classList.remove('hidden');
}

// Check the time every 500ms
//setInterval(monitorVideoItems, 500);
// In your game.js
setInterval(monitorVideoItems, 100); // Checks 10 times per second

function updateSidebarUI() {
    const list = document.getElementById('inventory-list');
    list.innerHTML = ''; // Clear everything first

    hiddenItems.forEach(item => {
        const isFound = gameState[item.id];
        const status = isFound ? "[\u2713]" : "[ ]";
        const color = isFound ? "#27ae60" : "#555";
        
        list.innerHTML += `<li style="color: ${color}">${status} ${item.name}</li>`;
    });
}

// Toggle the Sidebar
function toggleMenu() {
    const menu = document.getElementById("side-menu");
    if (menu.style.width === "250px") {
        menu.style.width = "0";
    } else {
        menu.style.width = "250px";
    }
}

// Function to draw the sidebar based on current state
function renderSidebar() {
    const list = document.getElementById('inventory-list');
    if (!list) return;

    list.innerHTML = ""; // Clear any "ghost" content

    hiddenItems.forEach(item => {
        const isFound = gameState[item.id];
        const status = isFound ? "[\u2713]" : "[ ]";
        const color = isFound ? "#27ae60" : "#555";
        
        list.innerHTML += `<li style="color: ${color}; white-space: nowrap;">${status} ${item.name}</li>`;
    });
}

// Call it immediately so the menu is ready before the user clicks the hamburger
renderSidebar();

// Function to Jump to a New Video from the Menu
function jumpToScene(sceneType) {
    toggleMenu(); // Close menu after selection
    
    let nextVideoId = "";
    
    if (sceneType === 'start') nextVideoId = 'dQw4w9WgXcQ';
    if (sceneType === 'lab') nextVideoId = VIDEO_ID_HERE;
    if (sceneType === 'secure') nextVideoId = VIDEO_ID_SECURE;
    
    // Use the global 'player' object we created earlier
    player.loadVideoById(nextVideoId);
    
    // Hide the buttons overlay while the new video starts
    document.getElementById('ui-overlay').classList.add('hidden');
}


function handleGameEvent(type, value, nextVideoId) {
    // 1. Update the Internal State
    gameState[value] = true;

    // 2. Update the Sidebar UI
    const sidebarItem = document.getElementById(`item-${value}`);
    if (sidebarItem) {
        sidebarItem.innerHTML = `[\u2713] ${type}`;
        sidebarItem.style.color = "#27ae60";
    }

    // 3. Close the Sidebar (if it was open)
    document.getElementById("side-menu").style.width = "0";

    // 4. Hide the Overlay immediately
    document.getElementById('ui-overlay').classList.add('hidden');

    // 5. Change the Video (if a new ID is provided)
    if (nextVideoId) {
        player.loadVideoById(nextVideoId);
    }
}

/*
function collectItem(itemId, itemName) {
    // Briefly flash the menu icon green to show success without opening the whole menu
    const icon = document.getElementById('menu-icon');
    icon.style.backgroundColor = "#27ae60";
    setTimeout(() => { icon.style.backgroundColor = "rgba(0,0,0,0.5)"; }, 2000);

    // 1. Update the Game State
    gameState[itemId] = true;

    // 2. Update the Sidebar UI (Checkmark)
    const sidebarItem = document.getElementById(itemId);
    if (sidebarItem) {
        sidebarItem.innerHTML = `[\u2713] ${itemName}`;
        sidebarItem.style.color = "#27ae60";
    }

    // 3. AUTO-CLOSE THE SIDE MENU
    // If the sidebar is open, this snaps it shut so the player can see the video
    document.getElementById("side-menu").style.width = "0";

    // 4. HIDE THE BUTTON
    // This removes the button immediately so they can't click it twice
    document.getElementById('ui-overlay').classList.add('hidden');
    
    console.log("Collected: " + itemName);
}
*/

function collectItem(itemId, itemName) {
    gameState[itemId] = true;
    
    renderSidebar(); // Redraw the list with the new checkmark
    
    document.getElementById('ui-overlay').classList.add('hidden');
    // Optional: close menu if it was open
    document.getElementById("side-menu").style.width = "0";
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

// Run this function repeatedly to check the video time
function trackVideoProgress() {
    if (player && player.getCurrentTime) {
        let currentTime = player.getCurrentTime();

        // SENSING LOGIC: 
        // If video is between 15 and 20 seconds, show the "Keycard" button
        if (currentTime >= 15 && currentTime <= 20 && !gameState.hasKeycard) {
            document.getElementById('ui-overlay').classList.remove('hidden');
        } else {
            document.getElementById('ui-overlay').classList.add('hidden');
        }
    }
}

// Check every 500ms (twice a second) for better accuracy
//setInterval(trackVideoProgress, 500);