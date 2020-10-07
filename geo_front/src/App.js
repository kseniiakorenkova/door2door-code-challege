import React, { Component, Fragment } from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Button from '@material-ui/core/Button';
import LocationsService from './service/LocationsService';
import ReactMapGL, { Source, Layer } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css';

const ltd = 52.52791908000258;
const lgtd = 13.34014892578125;
const default_geo_json = {
	"features": [],
	"type": "FeatureCollection"
};


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			viewport: {
				width: '100%',
				height: 500,
				latitude: ltd,
				longitude: lgtd,
				zoom: 10,
			},
			pickup_hotspots: default_geo_json,
			dropoff_hotspots: default_geo_json,
			booking_distance_bins: null
		}
	};

	handleShowLocationsEvent = () => {
		const request_data = {
			"bounding_box": [13.34014892578125, 52.52791908000258, 13.506317138671875, 52.562995039558004],
			"number_of_requests": 2
		}

		LocationsService.getLocationsToShow(request_data).then(
			data => {
				this.setState({ pickup_hotspots: data.most_popular_pickup_points });
				this.setState({ dropoff_hotspots: data.most_popular_dropoff_points });
				this.setState({ booking_distance_bins: data.booking_distance_bins });
			});
	};

	stringifyDistanceBins() {
		return "<p>Distance bins:</p>" + JSON.stringify(this.state.booking_distance_bins).replace("{", "").replace("}", "").
			replace('"', "").replaceAll('"', "").replaceAll(",", "</br>")

	}

	render() {
		const items = this.stringifyDistanceBins(this.state.booking_distance_bins);
		return (
				<MuiThemeProvider>
						<AppBar title="Welcome to Location Service" showMenuIconButton={false} />
						<div className='buttonAlignment'>
							<Button size="small" variant="outlined" color="primary" onClick={this.handleShowLocationsEvent}>Show Popular Pickup & Dropoff Points</Button>
						</div>
						<ReactMapGL
							{...this.state.viewport} mapStyle="mapbox://styles/mapbox/streets-v9" mapboxApiAccessToken="pk.eyJ1Ijoia29yZW5rb3ZhIiwiYSI6ImNrZnJjcjh5ajFqN2YyeHM1YWo1b2xwZ2gifQ.-iJjv--tax0283vYoAygHw"
							onViewportChange={(viewport) => this.setState({ viewport })}>
							<Source id="pickup" type="geojson" data={this.state.pickup_hotspots} />
							<Source id="dropoff" type="geojson" data={this.state.dropoff_hotspots} />
							<Layer id="layer1" type="symbol" source="pickup" layout={{
								'text-field': ['get', 'name'],
								'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
								'text-justify': 'auto',
								'text-size': 12,
								'icon-image': ['concat', 'embassy', '-15']
							}} />
							<Layer id="layer2" type="symbol" source="dropoff"
								layout={{
									'text-field': ['get', 'name'],
									'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
									'text-justify': 'auto',
									'text-size': 12,
									'icon-image': ['concat', 'star', '-15']
								}} />
						</ReactMapGL>
						{this.state.booking_distance_bins && <div className='customPopup'
							dangerouslySetInnerHTML={{ __html: items }} />}
				</MuiThemeProvider>
		);
	}

}
export default App;

