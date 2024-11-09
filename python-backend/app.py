from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    # Retrieve the 'value' from the JSON data sent by the frontend
    value = data.get('value', 2)
    result = value * 2
    # Return the result as JSON
    return jsonify({'result': result})


if __name__ == '__main__':
    app.run(debug=True)
