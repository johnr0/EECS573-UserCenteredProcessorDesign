from flask import Flask, request
from flask_restful import reqparse, Api, Resource
import random
import json 

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('surveyresult')

class RLagent(Resource):
    def post(self):
        args = parser.parse_args()
        data = args['surveyresult']
        print(data)
        data = json.loads(data)
        # build model with data
        

        return random.randint(0,2)

api.add_resource(RLagent, '/getarm')

if __name__=='__main__':
    app.run(debug=True, port=3527)