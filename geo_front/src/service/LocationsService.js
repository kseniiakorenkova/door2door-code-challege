import axios from "axios";

class LocationsService {
	getLocationsToShow(data) {
		return axios
			.post("/locations/v1", data).then(response => {
				if (!response.error) {
					return response.data;
				}
				else { return {}; }
			});
	}

}

export default new LocationsService();