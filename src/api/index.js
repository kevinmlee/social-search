const axios = require("axios");
const endpoint = "https://prickly-umbrella-toad.cyclic.app";

export const auth = async (data) => {
  const { username, password } = data;

  return axios
    .post(`${endpoint}/api/user/auth`, {
      username: username,
      password: password,
    })
    .then(
      (response) => response.data,
      (error) => error
    );
};

/**
 * Returns user object if found
 * @param {Object} data
 * @returns {Object}
 */
export const getUser = async (data) => {
  const { username } = data;

  return axios
    .post(`${endpoint}/api/get/user`, {
      username: username,
    })
    .then(
      (response) => response.data.data,
      (error) => error
    );
};

/**
 * Creates user in the database and returns created user object
 * @param {Object} data
 * @returns {Object}
 */
export const createUser = async (data) => {
  const { username, password, firstName, lastName, avatar, accountType } = data;

  return axios
    .post(`${endpoint}/api/create/user`, {
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      avatar: avatar,
      accountType: accountType,
    })
    .then(
      (response) => response.data.data,
      (error) => error
    );
};

export const updateUser = async (data) => {};
