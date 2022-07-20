const axios = require("axios");

export const auth = async (data) => {
  const { username, password } = data;

  return axios
    .post("/api/user/auth", {
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
    .post("/api/get/user", {
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
  const { username, password, firstName, lastName, avatar, googleUserId } =
    data;

  return axios
    .post("/api/create/user", {
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      avatar: avatar,
      googleUserId: googleUserId,
    })
    .then(
      (response) => response.data.data,
      (error) => error
    );
};

export const updateUser = async (data) => {};
