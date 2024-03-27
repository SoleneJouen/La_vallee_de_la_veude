import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.render("blog.ejs");
});

export default router;