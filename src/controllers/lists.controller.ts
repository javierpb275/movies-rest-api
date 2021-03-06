import { Request, Response } from "express";
import { IList, IUser } from "../types";
import User from "../models/user.model";
import List from "../models/list.model";
import { getMatch, getPaginationOptions } from "../helpers/paginator.helper";
import { validateBodyProperties } from "../helpers/validateRequest.helper";

class ListsController {
  public async getLists(req: Request, res: Response): Promise<Response> {
    const { userId, query } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const options = getPaginationOptions(query);
      const match = getMatch(query);
      await user.populate({
        path: "lists",
        match,
        options,
        populate: { path: "movies", populate: { path: "scores" } },
      });
      return res.status(200).send(user.lists);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public async getList(req: Request, res: Response): Promise<Response> {
    const { userId, params } = req;
    try {
      const list: IList | null = await List.findOne({
        _id: params.id,
        user: userId,
      });
      if (!list) {
        return res.status(404).send({ error: "List Not Found!" });
      }
      await list.populate({ path: "movies", populate: { path: "scores" } });
      return res.status(200).send(list);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public async createList(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const newList: IList = new List({ ...body, user: user._id });
      await newList.save();
      return res.status(201).send(newList);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  public async updateList(req: Request, res: Response): Promise<Response> {
    const { userId, body, params } = req;
    //allow only certain properties to be updated:
    const isValidOperation: boolean = validateBodyProperties(body, [
      "name",
      "movies",
    ]);
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid properties!" });
    }
    //-------------------------
    try {
      const updatedList: IList | null = await List.findOneAndUpdate(
        { _id: params.id, user: userId },
        body,
        {
          new: true,
        }
      );
      if (!updatedList) {
        return res.status(404).send({ error: "List Not Found!" });
      }
      return res.status(200).send(updatedList);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  public async deleteList(req: Request, res: Response): Promise<Response> {
    const { userId, params } = req;
    try {
      const list: IList | null = await List.findOne({
        _id: params.id,
        user: userId,
      });
      if (!list) {
        return res.status(404).send({ error: "List Not Found!" });
      }
      await list.remove();
      return res.status(200).send(list);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const listsController: ListsController = new ListsController();

export default listsController;
