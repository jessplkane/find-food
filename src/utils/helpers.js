import { USER_DENIED_LOCATION } from "./constants";

export const userDeniedLocation = ({ error }) => {
  return error === USER_DENIED_LOCATION ? true : false;
};

export const getRandomNumber = max => {
  return Math.floor(Math.random() * Math.floor(max));
};
