import React, { useState, useEffect } from "react";
import axios from "axios";

import { geoLocation } from "../services/GetLocation";
import { CLIENT_ID, CLIENT_SECRET, DATE } from "../utils/constants";
import { userDeniedLocation, getRandomNumber } from "../utils/helpers";

import "./Form.scss";

// TODO: Add tooltip for users that have not allowed location access
// TODO: Add filter for price, default 1-2 but allow up to 4

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [userInput, setUserInput] = useState(null);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    setLoading(true);

    try {
      const location = await geoLocation();

      setUserLocation(location);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handlieInputChange = e => {
    return setUserInput(e.target.value);
  };

  const expandDetails = () => {
    const venueId = results.venue.id;

    axios
      .get(
        `https://api.foursquare.com/v2/venues/${venueId}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}
    `
      )
      .then(res => {
        console.log(res);
      });

    return setIsOpen(!isOpen);
  };

  const handleGetChoices = () => {
    const url =
      error && userDeniedLocation(error)
        ? `https://api.foursquare.com/v2/venues/explore?near=${userInput}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}&section=food&price=1,2,3,4`
        : `https://api.foursquare.com/v2/venues/explore?ll=${
            userLocation.lat
          },${
            userLocation.lng
          }&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}&section=food&price=1,2,3,4`;

    axios.get(url).then(res => {
      console.log(res);
      const randomSelectedNumber = getRandomNumber(
        res.data.response.groups[0].items.length
      );

      setResults(res.data.response.groups[0].items[randomSelectedNumber]);
    });
  };

  const isAccordionOpen = () => {
    return isOpen ? "Accordion__item Accordion__item--open" : "Accordion__item";
  };

  return (
    <div>
      <h1>hello</h1>

      {loading && <p>Finding location...</p>}

      {!error && !loading && (
        <button onClick={handleGetChoices}>Get food</button>
      )}

      {error && userDeniedLocation(error) && (
        <div>
          <input
            type="text"
            onChange={handlieInputChange}
            placeholder="Please enter your neighbourhood for recommendations near you"
          />
          <button type="submit" onClick={handleGetChoices}>
            Find food!
          </button>
        </div>
      )}

      {results && (
        <div>
          <h3>{results.venue.name}</h3>

          <p>Category: {results.venue.categories[0].name}</p>

          <ul className="Accordion" onClick={expandDetails}>
            <p>Expand to see more details +</p>
            <li className={isAccordionOpen()}>hidden</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Form;
