import prisma from "../utils/db.js";
import multer from "multer";
import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (_req, res) => {
    res.render("article.ejs");
  }
);

router.get(
  "/:id/modifier",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const articleId = parseInt(req.params.id);
    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });
    console.log(article);
    res.render("article.ejs", { article: article });
  }
);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images/upload/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/all", async (_req, res) => {
  try {
    const articles = await prisma.article.findMany();
    res.json(articles);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  async (req, res) => {
    const article = {
      date: new Date(req.body.date).toISOString(),
      titre: req.body.titre,
      description: req.body.description,
      auteur: req.body.auteur,
      image: `/images/upload/${req.file.filename}`,
    };

    try {
      await prisma.article.create({
        data: {
          date: article.date,
          titre: article.titre,
          description: article.description,
          auteur: article.auteur,
          image: article.image,
        },
      });

      return res.redirect("/liste");
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }
);

router.delete(
  "/:id/delete",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const articleId = parseInt(req.params.id);

    try {
      await prisma.article.delete({
        where: {
          id: articleId,
        },
      });

      return res.status(200).json({ message: "Article deleted successfully" });
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }
);

export default router;