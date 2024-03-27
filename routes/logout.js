import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

export default router;