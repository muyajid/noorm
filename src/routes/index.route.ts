import { Router } from "express";
import userRouter from "../modules/user/user.route";
import authRoute from "../modules/auth/auth.route";
import postRoute from "../modules/post/post.route";

const routes = Router();

routes.use("/user", userRouter);
routes.use("/auth", authRoute);
routes.use("/posts", postRoute);

export default routes;
