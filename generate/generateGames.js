const { faker } = require("@faker-js/faker");
const createGame = require("./createGame");

const imageUrls = [
  'https://assets-prd.ignimgs.com/2021/12/08/horizonzerodawn-1638924347525.jpg?width=300&crop=1%3A1%2Csmart&auto=webp&dpr=2',
  'https://assets2.ignimgs.com/2015/06/03/uncharted-4-button-v2jpg-5a448e.jpg?width=300&crop=1%3A1%2Csmart&auto=webp&dpr=2',
  'https://assets-prd.ignimgs.com/2022/06/03/spideyremastered-1654220581626.jpg?width=300&crop=1%3A1%2Csmart&auto=webp&dpr=2',
  'https://assets-prd.ignimgs.com/2024/04/02/ghost-of-tsushima-button-replacement-1712068663737.jpg?width=300&crop=1%3A1%2Csmart&auto=webp&dpr=2',
  'https://assets-prd.ignimgs.com/2022/05/16/god-of-war-2018-1652716403586.jpg?width=300&crop=1%3A1%2Csmart&auto=webp&dpr=2',
  'https://assets-prd.ignimgs.com/2022/05/18/marves-spider-man-miles-morales-1652915375850.jpg?width=300&crop=1%3A1%2Csmart&auto=webp&dpr=2',
  'https://assets-prd.ignimgs.com/2022/03/30/forbiddenwest-1648659613888.jpg?width=300&crop=1%3A1%2Csmart&auto=webp&dpr=2',
  'https://assets-prd.ignimgs.com/2021/09/09/god-of-war-ragnarok-button-1631231879154.jpg?width=300&crop=1%3A1%2Csmart&auto=webp&dpr=2',
  'https://assets1.ignimgs.com/2017/08/11/uncharted-lost-legacy---button-f-1502413916063.jpg?width=300&crop=1%3A1%2Csmart&auto=webp&dpr=2',
  'https://assets1.ignimgs.com/2020/03/05/last-of-us-2---button-2020-1583430650540.jpg?width=300&crop=1%3A1%2Csmart&auto=webp&dpr=2'
]
const getRandomImageUrl = () => {
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
};

const generateRandomGameData = () => ({
  title: faker.lorem.words({ min: 2, max: 3 }),
  description: faker.lorem.sentences(10),
  publisher: faker.company.name(),
  imageUrl: getRandomImageUrl(),
  releaseDate: faker.date.between({from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z'}),
  genreIds: [faker.number.int({ min: 1, max: 15 }), faker.number.int({ min: 1, max: 15 })],
});

const generateGames = async (token, numberOfGames = 1000) => {
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
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzMwOTU4NzIzfQ.tEXOk5RlIqZ70BpnX8j264bkZrOg1yUViFQRp_8SGtM";
generateGames(token);
