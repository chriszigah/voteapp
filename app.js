const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();

const dataFile = path.join(__dirname, "data.json");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client")));

// Get Total Vote
app.get("/poll", async (req, res) => {
  let data = JSON.parse(await fs.readFile(dataFile, "utf-8"));

  // Calculate Total Votes
  totalVotes = Object.values(data).reduce((total, n) => (total += n), 0);

  //Calculate Individual Vote
  const cdata = Object.entries(data).map(([label, votes]) => {
    return {
      label,
      percentage: ((100 * votes) / totalVotes || 0).toFixed(0),
    };
  });
  res.json({ cdata, totalVotes });
});

// Post Vote
app.post("/poll", async (req, res) => {
  const data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
  data[req.body.add]++;
  await fs.writeFile(dataFile, JSON.stringify(data));
  res.json({ data });
});

//Allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
// Start Server
app.listen(7240, () => console.log(`Server is listening on port 7240`));
