import express, { json } from "express";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const tokens = JSON.parse(fs.readFileSync("./tokens.json", "utf8"));

const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});

const clientID = process.env.TRAKT_CLIENT_ID;
const clientSecret = process.env.TRAKT_CLIENT_SECRET;
const redirectURI = process.env.TRAKT_REDIRECT_URI;

app.get("/auth", (req, res) => {
  const url = `https://api.trakt.tv/oauth/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}`;
  res.redirect(url);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const response = await fetch("https://api.trakt.tv/oauth/token", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: redirectURI,
        grant_type: "authorization_code",
      }),
    });
    const data = await response.json();
    res.send(data);
  } catch (e) {
    console.log("error", e);
    res.status(500).send("Something went wrong");
  }
});

app.get("/watchlist", async (req, res) => {
  try {
    const response = await fetch("https://api.trakt.tv/sync/watchlist", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        "trakt-api-version": "2",
        "trakt-api-key": clientID,
      },
    });
    const data = await response.json();
    res.send(data);
  } catch (e) {
    console.error("error", e);
    res.status(500).send("Failed to fetch user settings");
  }
});

//TOKEN REFRESH LOGIC
app.get("/refresh", async (req, res) => {
  try {
    const response = await fetch("https://api.trakt.tv/oauth/token", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: tokens.refresh_token,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: redirectURI,
        grant_type: "refresh_token",
      }),
    });

    const newTokens = await response.json();
    fs.writeFileSync("./tokens.json", JSON.stringify(newTokens, null, 2));
    Object.assign(tokens, newTokens);
    res.send("Token refreshed and saved.");
  } catch (e) {
    console.error("refresh error", e);
    res.status(500).send("Failed to refresh token");
  }
});
