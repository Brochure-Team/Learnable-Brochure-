import { Request, Response, NextFunction } from "express";
import { IGenericObject } from "../interfaces";

export default (schema: IGenericObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
      if (schema.body) 
        req.body = await schema.body.validateAsync(req.body);

      if (schema.query) {
        req.query = await schema.query.validateAsync(req.query);
      }  

      if (schema.params) 
        req.params = await schema.params.validateAsync(req.params);
      
      next();
}