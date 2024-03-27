// Ajout du système de cache
import "dotenv/config";

// Implémentation de module nécessaire
import express from "express";
import { createTransport } from "nodemailer";
import passport from "passport";
import cookieParser from "cookie-parser";
import "./utils/passport.js";
import home from "./routes/home.js";
import logout from "./routes/logout.js";
import contact from "./routes/contact.js";
import blog from "./routes/blog.js";
import conditions from "./routes/conditions.js";
import mentions from "./routes/mentions.js";
import login from "./routes/login.js";
import article from "./routes/article.js";
import liste from "./routes/liste.js";
import bodyParser from "body-parser";
import request from "request";

const app = express();

// Cache d'information importante
const {
  MAILER_USER,
  MAILER_PASSWORD,
  MAILER_SEND_TO,
  HTTP_PORT,
  HTTP_ADDRESS,
} = process.env;

// configuration des middlewares

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(express.json());

// Route pour la gestion du formulaire de contact (POST)
app.post("/envoyer-email", (req, res) => {
  const { name, email, message } = req.body;

  // Configuration du transporteur SMTP pour l'envoi d'e-mails via Gmail
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: MAILER_USER,
      pass: MAILER_PASSWORD,
    },
  });

  // Configuration du contenu de l'e-mail
  const mailOptions = {
    from: MAILER_USER,
    to: MAILER_SEND_TO,
    subject: "Nouveau message depuis le formulaire de contact",
    text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
    replyTo: email, // Adresse e-mail de l'émetteur (peut être ajoutée dans le champ "Reply-To")
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Erreur lors de l'envoi de l'e-mail:", error);
      res
        .status(500)
        .send("Une erreur est survenue lors de l'envoi de l'e-mail.");
    } else {
      console.log("E-mail envoyé avec succès:", info.response);
      res.status(200).send("Votre message a été envoyé avec succès.");
    }
  });
});

// Route pour la page d'accueil (GET)
app.use("/", home);
app.use("/home", home);

// Route pour la page de contact (GET)
app.use("/contact", contact);

// Route pour la page du blog (GET)
app.use("/blog", blog);

// Route pour la page des conditions (GET)
app.use("/conditions", conditions);

// Route pour la page des mentions (GET)
app.use("/mentions", mentions);

// Route pour la page de login (GET)
app.use("/login", login);

// Route pour la page article (GET)
app.use("/article", article);

// Route pour la page logout (GET)
app.use("/logout", logout);

// Route pour la page de la liste des articles (GET)
app.use("/liste", liste);

// Démarrage du serveur
app.listen(HTTP_PORT, HTTP_ADDRESS, () => {
  console.log(`Serveur démarré sur le port ${HTTP_ADDRESS}:${HTTP_PORT}`);
});









app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.post('/subscribe', (req, res) =>{
    if(
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ){
        return res.json({"success": false, "msg":"Please select captcha"});
    }

    //Secret Key
    const secretKey = '6LdvFJIpAAAAAFxnKNu6lM0iG8wmOT6mI4qCooN7';

    //Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    //Make Request To VerifyURL
    request(verifyUrl, (err, reponse, body)=>{
        body = JSON.parse(body);
        console.log(body);

        //If not Succesful
        if(body.success !== undefined && !body.success){
            return res.json({"success": false, "msg":"Failed captcha verification"});
        }

        //If Successful
        return res.json({"success": true, "msg":"Captcha passed"});

    })
})