const axios = require("axios");

export const auth = async (data) => {};

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

export const createUser = async (data) => {};

export const updateUser = async (data) => {};
