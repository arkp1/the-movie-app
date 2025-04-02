import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import session from "express-session";
import DBConnection from "./Database/DBConnection.js";
import Session from "./Database/SessionModel.js";

dotenv.config();

const clientID = process.env.TRAKT_CLIENT_ID;
const clientSecret = process.env.TRAKT_CLIENT_SECRET;
const redirectURI = process.env.TRAKT_REDIRECT_URI;

const app = express();
const port = 8000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

DBConnection();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

app.get("/auth", (req, res) => {
  const traktAuthURL = `https://api.trakt.tv/oauth/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}`;
  res.redirect(traktAuthURL);
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
    console.log("Session ID after login:", req.sessionID);
    console.log("Session data saved to DB.");
    console.log("Cookie headers:", res.getHeader("Set-Cookie"));

    const settingsResponse = await fetch(
      "https://api.trakt.tv/users/settings",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          "trakt-api-version": "2",
          "trakt-api-key": clientID,
        },
      }
    );
    const userData = await settingsResponse.json();
    const userId = userData.user.ids.slug;

    const newSession = new Session({
      sessionId: req.sessionID,
      userId: userId,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    });
    await newSession.save();

    res.redirect("http://localhost:5173/home");
  } catch (e) {
    console.log("error", e);
    res.status(500).send("Something went wrong");
  }
});

app.get("/watchlist", async (req, res) => {
  try {
    const sessionData = await Session.findOne({ sessionId: req.sessionID });
    if (!sessionData) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const response = await fetch("https://api.trakt.tv/sync/watchlist", {
      headers: {
        Authorization: `Bearer ${sessionData.accessToken}`,
        "trakt-api-version": "2",
        "trakt-api-key": clientID,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error("error", e);
    res.status(500).send("Failed to fetch user settings");
  }
});


app.post("/watchlist/add", async (req, res) => {
  console.log("Watchlist endpoint - Session ID:", req.sessionID);
  console.log("Cookies:", req.headers.cookie);
  try {
    const { type, id } = req.body; // type = "movie" or "show"
    const sessionData = await Session.findOne({ sessionId: req.sessionID });

    if (!sessionData) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const body = {};
    if (type === "movie") {
      body.movies = [{ ids: { trakt: id } }];
    } else if (type === "show") {
      body.shows = [{ ids: { trakt: id } }];
    }

    const response = await fetch("https://api.trakt.tv/sync/watchlist", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionData.accessToken}`,
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": clientID,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error("Error adding to watchlist:", e);
    res.status(500).send("Failed to add to watchlist");
  }
});


app.post("/watchlist/remove", async (req, res) => {
  try {
    const { type, id } = req.body; // type = "movie" or "show"
    const sessionData = await Session.findOne({ sessionId: req.sessionID });

    if (!sessionData) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const body = {};
    if (type === "movie") {
      body.movies = [{ ids: { trakt: id } }];
    } else if (type === "show") {
      body.shows = [{ ids: { trakt: id } }];
    }

    const response = await fetch("https://api.trakt.tv/sync/watchlist/remove", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionData.accessToken}`,
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": clientID,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error("Error removing from watchlist:", e);
    res.status(500).send("Failed to remove from watchlist");
  }
});



app.get("/profile", async (req, res) => {
  console.log("Request session ID:", req.sessionID);

  const sessionData = await Session.findOne({ sessionId: req.sessionID });

  console.log("Session data:", sessionData);
  try {
    const sessionData = await Session.findOne({ sessionId: req.sessionID });
    if (!sessionData) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const response = await fetch("https://api.trakt.tv/users/settings", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionData.accessToken}`,
        "trakt-api-version": "2",
        "trakt-api-key": clientID,
      },
    });
    const data = await response.json();
    const avatarURL = data.user.images.avatar.full;

    res.json({ ...data, avatarURL });
  } catch (e) {
    console.error("error", e);
    res.status(500).send("Failed to fetch user settings");
  }
});

app.get("/refresh", async (req, res) => {
  try {
    const sessionData = await Session.findOne({ sessionId: req.sessionID });
    if (!sessionData) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const response = await fetch("https://api.trakt.tv/oauth/token", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: sessionData.refreshToken,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: redirectURI,
        grant_type: "refresh_token",
      }),
    });

    const newTokens = await response.json();
    sessionData.accessToken = newTokens.access_token;
    sessionData.refreshToken = newTokens.refresh_token;
    sessionData.expiresIn = newTokens.expires_in;

    await sessionData.save();
    res.json(newTokens);
  } catch (e) {
    console.error("refresh error", e);
    res.status(500).send("Failed to refresh token");
  }
});

//Logout
app.post("/logout", async (req, res) => {
  try {
    // Find and delete the session from DB
    const session = await Session.findOneAndDelete({
      sessionId: req.sessionID,
    });

    // If we have a stored access token, revoke it via Trakt API
    if (session?.accessToken) {
      await fetch("https://api.trakt.tv/oauth/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: session.accessToken,
          client_id: process.env.TRAKT_CLIENT_ID,
          client_secret: process.env.TRAKT_CLIENT_SECRET,
        }),
      });
    }

    // Clear the session cookie
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});
