import { isValidObjectId } from "mongoose";
import { logger } from ".";

export default (id: string, helpers: any): string => {
  if (!isValidObjectId(id)) {
    logger.error("Invalid Object Id");
    return helpers.error("Invalid Object Id");
  }

  return id;
}