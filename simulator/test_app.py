from app import app
from flask import json

url = '/locations/v1'
content_type = 'application/json'


def test_post():
    response = app.test_client().post(
        url,
        data=json.dumps({"bounding_box": [13.34014892578125, 52.52791908000258, 13.506317138671875, 52.562995039558004],
                         "number_of_requests": 2}),
        content_type=content_type
    )

    data = json.loads(response.get_data())

    assert response.status_code == 200
    assert 'type' in data['most_popular_pickup_points']
    assert 'type' in data['most_popular_dropoff_points']
    assert "From 0->1km" in data['booking_distance_bins']


def test_missing_parameter_data1_post():
    response = app.test_client().post(
        url,
        data=json.dumps({"number_of_requests": 2}),
        content_type=content_type
    )
    assert response.status_code == 400


def test_missing_parameter_data2_post():
    response = app.test_client().post(
        url,
        data=json.dumps(
            {"bounding_box": [13.34014892578125, 52.52791908000258, 13.506317138671875, 52.562995039558004]}),
        content_type=content_type
    )
    assert response.status_code == 400

def test_missing_parameter_data_post():
    response = app.test_client().post(
        url,
        data=json.dumps([]),
        content_type=content_type
    )
    assert response.status_code == 400
