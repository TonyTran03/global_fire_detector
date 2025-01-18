from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/users', methods=['GET'])
def get_users():
  return 


@app.route('/users', methods=['DELETE'])
def delete_user():
    return jsonify({'result': 'success'})

app.run()