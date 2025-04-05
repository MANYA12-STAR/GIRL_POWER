let score = 0;
let currentEmotion = "";

function newEmotion() {
    fetch('/get_new_emotion')
        .then(response => response.json())
        .then(data => {
            currentEmotion = data.emotion;
            const imageUrl = data.image_url;
            console.log(imageUrl); // Check this in the browser console
            document.getElementById("emotion-image").src = imageUrl;
            document.getElementById("result").textContent = "";
        });
}

function submitAnswer(answer) {
    fetch('/submit_answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: answer })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").textContent = data.result;
        score = data.score;
        document.getElementById("score").textContent = `Score: ${score}`;
    });
}

// Initialize the game with a new emotion
newEmotion();
