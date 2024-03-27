import express from "express";
import prisma from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", (_req, res) => {
  res.render("login.ejs");
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).send("erreur de mot de passe ou d'email/nom");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send("erreur de mot de passe ou d'email/nom");
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    res.cookie("jwt", token, { httpOnly: true, secure: true });
    res.redirect("/liste");
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

export default router;