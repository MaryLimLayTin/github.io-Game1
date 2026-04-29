let player;

const VIDEO_ID_FOR_LAB = 'lKCzsFzCVro'
const VIDEO_ID_FOR_PERIMETER = ''
const VIDEO_ID_1 = ''
const VIDEO_ID_2 = 'lYg02bByXB8'

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