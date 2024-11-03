const { faker } = require("@faker-js/faker");
const createGame = require("./createGame");

const imageUrls = ["https://assets-prd.ignimgs.com/2024/10/31/callofduty-blackops6-zombies-review-blogroll-1730398137298.jpg?crop=16%3A9&width=282&dpr=2", "https://assets-prd.ignimgs.com/2024/10/31/no-more-room-in-hell-2-earlyaccess-blogroll-1730394027223.jpg?crop=16%3A9&width=282&dpr=2", "https://assets-prd.ignimgs.com/2024/09/09/codblops6-1725926226920.jpg?crop=16%3A9&width=282&dpr=2", "https://assets-prd.ignimgs.com/2024/10/28/lifeisstrange-doubleexposure-blogroll-1730133924216.jpg?crop=16%3A9&width=282&dpr=2", "https://assets-prd.ignimgs.com/2024/10/28/dragonageveilguard-blogroll-1730133881470.jpg?crop=16%3A9&width=282&dpr=2", "https://assets-prd.ignimgs.com/2024/10/24/axis-allies-blogroll-1729792457476.jpeg?crop=16%3A9&width=282&dpr=2", "https://assets-prd.ignimgs.com/2024/10/25/black-ops-6-campaign-review-blog-1729849114357.jpg?crop=16%3A9&width=282&dpr=2", "https://assets-prd.ignimgs.com/2024/10/25/tmnt-mutants-unleashed-psn-1729840509041.png?crop=16%3A9&width=282&dpr=2", "https://assets-prd.ignimgs.com/2024/10/25/untitled-design-1729871930556.png?crop=16%3A9&width=282&dpr=2", "https://assets-prd.ignimgs.com/2024/10/24/thelakehouse-blogroll-1729739103142.jpg?crop=16%3A9&width=282&dpr=2"];

const getRandomImageUrl = () => {
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
};

const generateRandomGameData = () => ({
  title: faker.commerce.productName(),
  description: faker.lorem.sentences(2),
  publisher: faker.company.name(),
  imageUrl: getRandomImageUrl(),
  releaseDate: faker.date.between({from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z'}),
  genreIds: [faker.number.int({ min: 1, max: 15 }), faker.number.int({ min: 1, max: 15 })],
});

const generateGames = async (token, numberOfGames = 10) => {
  for (let i = 0; i < numberOfGames; i++) {
    const gameData = generateRandomGameData();

    try {
      const game = await createGame(gameData, token);
      console.log(`Game ${i + 1} created successfully:`, game);
    } catch (error) {
      console.error(`Failed to create game ${i + 1}:`, error.message);
    }
  }
};

// Provide the token here
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMwNjE3NDgwfQ.gnk7nfDiGcoBBhsuPPy6dAiBrSP_aDLF5r6F5QGeHnA";
generateGames(token);
