const apiClient = require("./api-client");


const createGame = async (game, token) => {
  try {
    const response = await apiClient.post("/games", game, {
      headers: { "x-auth-token": token },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = createGame;
