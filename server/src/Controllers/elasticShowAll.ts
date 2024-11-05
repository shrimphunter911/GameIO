import { Request, Response } from "express";
import client from "../config/elasticSearch";

export const getAllGamesFromElastic = async (req: Request, res: Response) => {
  try {
    const result = await client.search({
      index: "games",
      body: {
        query: {
          match_all: {},
        },
      },
      size: 10000,
    });

    const games = result.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
    }));

    res.status(200).json(games);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch games from Elasticsearch" });
  }
};
