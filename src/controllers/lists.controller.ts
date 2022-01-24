import { Request, Response } from "express";

class ListsController {
  public async getLists(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("getLists");
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public async getList(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("getList");
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public async createList(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(201).send("createList");
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  public async updateList(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("updateList");
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  public async deleteList(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("deleteList");
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const listsController: ListsController = new ListsController();

export default listsController;
