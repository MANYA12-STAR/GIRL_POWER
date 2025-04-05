from flask import Flask, render_template, jsonify, request
import random
import os

app = Flask(__name__)

# List of emotions and their corresponding image filenames
emotions = {
    'Happy': 'happy.jpg',
    'Sad': 'sad.jpg',
    'Angry': 'angry.jpg',
    'Surprised': 'surprised.jpg',
    'Fearful': 'fearful.jpg',
    'Disgusted': 'disgusted.jpg'
}

# Game state
game_state = {
    "current_emotion": "",
    "score": 0
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_new_emotion', methods=['GET'])
def get_new_emotion():
    # Pick a random emotion from the list
    emotion = random.choice(list(emotions.keys()))
    game_state['current_emotion'] = emotion
    image_filename = emotions[emotion]
    image_url = f'/static/images/{image_filename}'
    
    return jsonify({"image_url": image_url, "emotion": emotion})

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    data = request.json
    answer = data.get('answer', '').capitalize()

    if answer == game_state['current_emotion']:
        game_state['score'] += 1
        result = "Correct!"
    else:
        result = "Incorrect!"

    return jsonify({
        "result": result,
        "score": game_state['score']
    })

if __name__ == '__main__':
    app.run(debug=True)
