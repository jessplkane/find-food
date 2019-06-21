export const geoLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log("no geolocation");
    }

    navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {
      resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }

    function error(error) {
      reject({
        error: error.message
      });
    }
  });
};
