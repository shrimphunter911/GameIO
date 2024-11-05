import client from "./config/elasticSearch";
const createGameIndex = async () => {
  const index = "games";
  const exists = await client.indices.exists({ index });
  if (!exists) {
    await client.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            title: { type: "text" },
            releaseDate: { type: "date" },
            publisher: { type: "text" },
            imageUrl: { type: "text" },
            userId: { type: "integer" },
            avg_rating: { type: "float" },
            genreIds: { type: "integer" },
          },
        },
      },
    });
    console.log(`Index "${index}" created.`);
  } else {
    console.log(`Index "${index}" already exists.`);
  }
};
export default createGameIndex;
