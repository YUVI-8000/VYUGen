from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

questions = [
    "What is the use of CAM?",
    "Perform 9-14 using 2's complement method.",
    "What is the use of address bus and data bus?",
    "Explain implicit addressing mode with examples.",
    "Differentiate between hardwired and micro-programmed control units.",
    "What are interrupts and state their types?",
    "Explain 1 byte, 2-byte, and 3-byte instructions along with suitable examples.",
    "Differentiate between instruction, machine, and clock cycle.",
    "What are privileged instructions and how do they differ from non-privileged instructions?",
    "Differentiate between MOV and MVI instructions with examples.",
    "What is Cache memory? Explain the various cache mapping techniques in detail.",
    "Explain the various modes of I/O data transfer in detail.",
    "Explain the concept of a full adder in detail. How does a carry look-ahead adder differ from a full adder?",
    "Explain the concept of pipelining. What are the various hazards of pipelining?",
    "Write a short note on: i) Parallel Processors ii) Cache coherency.",
    "Draw and explain the diagram of 8085.",
    "Draw and explain the construction and parts of a hard disk.",
    "Explain Booth multiplication algorithm with a flowchart. Also, perform the multiplication of 14 and 7.",
    "Why does software fail after it has passed acceptance testing?",
    "State the importance of scheduling activity in project management.",
    "Can a program be correct and still not exhibit good quality? Explain.",
    "What is a software metric?",
    "What are the characteristics of software measurement?",
    "Explain testing fundamentals.",
    "Discuss computer-aided software engineering.",
    "What are functional requirements?",
    "What is meant by Software and Software Engineering?",
    "What are the maintenance process models?",
    "Write the importance of UML in developing object-oriented software.",
    "Explain how both waterfall and prototyping models of software processes can accommodate the spiral model.",
    "What are the different types of maintenance that a software product might need? Why is maintenance required?",
    "Why is code review required? Discuss any technique for code review.",
    "Explain the concept of Cohesion and Coupling. How can an ideal design in which modules have high cohesion and low coupling be achieved?",
    "Explain the software requirement analysis and specification. Discuss various methods for requirement gathering.",
    "What is the process of software testing? Explain the different testing methods illustrating their importance.",
    "What do you mean by project scheduling? How are PERT charts used to plan the scheduling of a project?"
]

vectorizer = TfidfVectorizer(stop_words='english')
question_vectors = vectorizer.fit_transform(questions)

# @app.route('/ml-search', methods=['POST'])
# def find_similar():
#     topic = request.json['topic']
#     topic_vector = vectorizer.transform([topic])
    
#     similarities = cosine_similarity(topic_vector, question_vectors).flatten()
    
#     threshold = 0.2
#     matching_indices = [i for i, similarity in enumerate(similarities) if similarity >= threshold]
    
#     results = [{"similarity": round(similarities[index], 2), "question": questions[index]} for index in matching_indices]
    
#     return jsonify(results)
@app.route('/ml-search', methods=['POST'])
def find_similar():
    topic = request.json.get('topic')
    if not topic:
        return jsonify({"error": "Topic is required."}), 400
    
    topic_vector = vectorizer.transform([topic])
    
    similarities = cosine_similarity(topic_vector, question_vectors).flatten()
    
    threshold = 0.2
    matching_indices = [i for i, similarity in enumerate(similarities) if similarity >= threshold]
    
    if not matching_indices:
        return jsonify({"message": "No similar questions found."}), 404
    
    results = [{"similarity": round(similarities[index], 2), "question": questions[index]} for index in matching_indices]
    
    return jsonify(results)



@app.route('/')
def home():
    return "Flask is running!"

if __name__ == '__main__':
    app.run(debug=True)
