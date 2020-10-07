from flask import Flask, request, abort
import simulator as simulator
import json5
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/locations/v1', methods=['POST'])
def getLocations():
    request_data = request.get_json()
    if not request_data or not 'bounding_box' in request_data or not 'number_of_requests' in request_data:
        abort(400)
    bounding_box = request_data["bounding_box"]
    number_of_requests = request_data["number_of_requests"]
    result = simulator.Simulator(bounding_box).simulate(number_of_requests)
    final = {'booking_distance_bins': result['booking_distance_bins'],
             'most_popular_dropoff_points': json5.loads(result['most_popular_dropoff_points']),
             'most_popular_pickup_points': json5.loads(result['most_popular_pickup_points'])
             }
    return final

if __name__ == '__main__':
    app.run()