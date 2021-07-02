import { Response, Request } from "express";
import JWT from "jsonwebtoken";
import { CallbackError, Types } from "mongoose";
import bcrypt from "bcrypt";

import User, { IUser } from "../models/User";

const signToken = (id: Types.ObjectId) => {
  return JWT.sign(
    {
      iss: "https://github.com/Arkaraj",
      sub: id,
    },
    `${process.env.SECRET}`,
    { expiresIn: "365d" }
  ); // '1 year'
};

export default {
  registerUser: async (req: Request, res: Response) => {
    const {
      email,
      name,
      password,
    }: {
      email: string;
      name: string;
      password: string;
    } = req.body;

    User.find({ email }, async (err: any, userPresent: IUser[]) => {
      if (err) {
        res
          .status(500)
          .json({ message: { msg: "Error has occured", msgError: true } });
      }
      if (userPresent.length > 0) {
        res.status(400).json({
          message: {
            msg: "Email already exists",
            msgError: true,
          },
        });
      } else {
        // Check if its valid regNo and valid vit email
        const newUser = new User({
          email,
          name,
          password,
        }); // new User(req.body)
        await newUser.save();

        res.status(201).json({
          message: {
            msg: "Account successfully created",
            msgError: false,
            user: newUser,
          },
        });
      }
    });
  },
  loginUser: async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    User.findOne({ email }, (err: CallbackError, user: IUser | null) => {
      if (err) {
        //console.log('Error ' + err)
        res.status(500).json({
          message: { msg: "Error has occured", msgError: true, error: err },
        });
      }
      if (!user) {
        res.status(400).json({
          message: { msg: "Invalid Email Id", msgError: true },
        });
      } else {
        bcrypt.compare(password, user.password, (err, validate) => {
          if (err) {
            res.status(500).json({
              message: {
                msg: "Error has occured in bcrypting the password",
                msgError: true,
              },
            });
          }
          if (!validate) {
            res
              .status(400)
              .json({ message: { msg: "Invalid Password", msgError: true } });
          } else {
            // Logged in
            const token = signToken(user._id);
            // httpOnly doen't let client side js touch the cookie saves from cross scripting attacks
            res.cookie("auth_token", token, {
              httpOnly: true,
              sameSite: true,
            });
            res.status(200).json({
              user,
              isAuthenticated: true,
              message: { msgError: false },
            });
          }
        });
      }
    });
  },
  logoutUser: async (_req: Request, res: Response) => {
    res.clearCookie("auth_token");
    res.status(200).json({ msg: "Logged out", user: {}, success: true });
  },
  getUserProfile: async (req: any, res: Response) => {
    res.status(200).json({ isAuthenticated: true, user: req.user });
  },
};
