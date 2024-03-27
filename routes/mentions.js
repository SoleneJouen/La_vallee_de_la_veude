import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  let jwtCookieExists = false;
  if (req.cookies.jwt) {
    jwtCookieExists = true;
  }
  res.render("mentions.ejs", { jwtCookieExists: jwtCookieExists });
});

export default router;