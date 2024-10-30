import { Model, ModelStatic } from "sequelize";
import db from "../Models";
import { Request, Response } from "express";

const genreModel = db.genre as ModelStatic<Model>;

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await genreModel.findAll();
    res.status(200).json(genres);
  } catch (error) {
    res.status(404).send(error);
  }
};
