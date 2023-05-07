import _ from "lodash";
import { validationResult } from "express-validator";
import Constant from "../common/constant.js";
import userService from "../services/userService.js";

const getAllUser = async (req, res) => {
  const { pageIndex, pageSize, search } = req.body;
  let data = userService.getAllUser(pageSize);
  return res.status(Constant.HttpStatusCode.OK).json(data);
};

const getUserByUsername = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(Constant.HttpStatusCode.BAD_REQUEST)
      .json({ errors: errors.array() });
  }
  const username = req?.body?.username ?? "";
  const user = await userService.getUserByUsername(username);
  if (!user) {
    return res
      .status(Constant.HttpStatusCode.NOT_FOUND)
      .json({ message: Constant.OutputType.NOT_FOUND_USERNAME });
  }
  return res.status(Constant.HttpStatusCode.OK).json(user);
};

const getUserById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(Constant.HttpStatusCode.BAD_REQUEST)
      .json({ errors: errors.array() });
  }
  const id = req?.params?.id ?? "";
  const user = userService.getUserById(id);
  if (!user) {
    return res
      .status(Constant.HttpStatusCode.FORBIDDEN)
      .json({ message: Constant.OutputType.NOT_FOUND_USERNAME });
  }
  return res.status(Constant.HttpStatusCode.OK).json(user);
};

const deleteUserById = async (req, res) => {
  const id = req?.params?.id ?? "";
  const user = userService.getUserById(id);
  if (!user) {
    return res
      .status(Constant.HttpStatusCode.FORBIDDEN)
      .json({ message: Constant.OutputType.NOT_FOUND_USERNAME });
  } else {
    await userService
      .deleteUserById(user.id)
      .then(() => {
        return res.status(Constant.HttpStatusCode.OK).json({
          message: Constant.OutputType.DELETE_SUCCESS,
        });
      })
      .catch((err) => {
        return res.status(Constant.HttpStatusCode.BAD_REQUEST).json({
          message: Constant.OutputType.ERROR_PROCESSING_DELETE,
          error: err,
        });
      });
  }
};

export default {
  getUserByUsername,
  getAllUser,
  getUserById,
  deleteUserById,
};
