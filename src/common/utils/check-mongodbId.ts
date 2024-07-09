import { BadRequestException } from "@nestjs/common";
import { isValidObjectId } from "mongoose";

export const checkId = (id: string) => {
  if (!isValidObjectId(id)) throw new BadRequestException("Invalid id");

  return;
};