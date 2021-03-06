import { ENDPOINTS } from "../constants";

export const changeOption = (optionName, optionValue) => {
  return {
    type: "CHANGED_OPTION",
    payload: { [optionName]: optionValue }
  }
}

export const changeAvailability = (data, addons, availableAddons) => {
  const allAddons = data[addons].map(addon => addon.name)
  const unavailableAddons = allAddons.filter(addon => !availableAddons.includes(addon))
  const unavailableAddonsIndexes = unavailableAddons.map(addon => allAddons.indexOf(addon))

  return {
    type: "CHANGED_AVAILABILITY",
    payload: { unavailableAddonsIndexes, addons }
  }
}

// data fetching
export const fetchData = () => {
  return async dispatch => {

    dispatch(fetchDataBegin());

    Promise.all(ENDPOINTS.map(async endpoint => {
      try {
            const response = await fetch(endpoint.url);
            const res = await handleErrors(response);
            const json = await res.json();
            dispatch(fetchDataSuccess(json, endpoint.dataName));
            return json;
        } catch (error) {
            return dispatch(fetchDataFailure(error));
        }
    }))
  };
}
  
  // Handle HTTP errors since fetch won't
  const handleErrors = response => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

export const fetchDataBegin = () => ({
    type: 'FETCH_DATA_BEGIN'
  });
  
export const fetchDataSuccess = (response, dataName) => ({
    type: 'FETCH_DATA_SUCCESS',
    payload: { [dataName]: response }
});

export const fetchDataFailure = error => ({
    type: 'FETCH_DATA_FAILURE',
    payload: { error }
});