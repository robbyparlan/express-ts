import * as express from "express";
import authRouter from './auth/auth.router'

let router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
  res.send("Bismillah Service HRIS")
});

router.use('/auth', authRouter)

export = router;