const express = require("express");
const cors = require("cors");
const axios = require('axios');

const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.post("/authenticate", async (req, res) => {
  const { username, secret, email, first_name, last_name } = req.body;

  try {
    const r = await axios.put(
      'https://api.chatengine.io/users/',
      {
        username: username,
        secret: username,
        email: username,
        first_name: username,
        last_name: username
      },
      {headers: {"private-key": "7a5900fd-45a3-49d9-9e7c-7558ab1a72b1"}}
    )
    return res.status(r.status).json(r.data);
  } catch (e) {
    if (e.response) {
      // The request was made, but the server responded with an error status code
      console.log(e.response.data);
      console.log(e.response.status);
      return res.status(e.response.status).json(e.response.data);
    } else if (e.request) {
      // The request was made but no response was received
      console.log(e.request);
      return res.status(500).json({ error: "No response from the server" });
    } else {
      // Something happened in setting up the request that triggered an error
      console.log("Error", e.message);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
    
    // return res.status(e.response.status).json(e.response.data)
  }

  // return res.json({ username: username, secret: "sha256..." });
});

app.listen(port, () => {
  console.log(`Chatserver fired up 🚀 on port ${port}`);
});
