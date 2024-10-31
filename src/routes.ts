import { Router } from "express";
import LotomaniaController from "./lotomania/lotomania.controller";

export default Router()
  .get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "OK",
    });
  })
  .get('/start', LotomaniaController.start);
