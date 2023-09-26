const express = require("express");
const mysql = require("mysql");
const app = express();
const user = "root";
const password = "root";
const db = "mydb";
const host = "localhost";
const port = 4001;

app.use(express.static("New folder"));
app.use(express.json());
app.listen(port, () => {
  console.log("The server has been running on port: " + port);
});

const connection = mysql.createConnection({
  user: user,
  database: db,
  host: host,
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err);
    process.exit(1); // Exit the application on database connection error
  }
  console.log("The connection was successful !!!");
});

// Add an error event handler for the MySQL connection
connection.on("error", (err) => {
  console.error("MySQL connection error: " + err);
  process.exit(1); // Exit the application on database error
});

app.get("/getuser", (req, res) => {
  connection.query("SELECT * FROM user", (err, rows, fields) => {
    if (err) {
      console.error("Error executing MySQL query: " + err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

app.post("/setindatabase", (req, res) => {
  const body = req.body;
  connection.query(
    "INSERT INTO user SET ?",
    { name: body.password, email: body.email }, // Corrected property names
    (err, rows, fields) => {
      if (err) {
        console.error("Error executing MySQL query: " + err);
        return res.status(500).json({ error: "Database error" });
      }
      res.sendStatus(200);
    }
  );
});
app.delete("/deleteuser", (req, res) => {
  const id = req.body.id;
  connection.query(`DELETE FROM user where id = ${id}`, (err, rows, fields) => {
    if (err) {
      console.error("Error executing MySQL query: " + err);
      return res.status(500).json({ error: "Database error" });
    }
    res.sendStatus(200);
  });
});
app.get("/getuser/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM user WHERE id = ?",
    [id],
    (err, rows, fields) => {
      if (err) {
        console.error("Error executing MySQL query: " + err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(rows);
    }
  );
});

app.post("/update/:id", (req, res) => {
  const body = req.body;
  const userId = req.params.id;

  connection.query(
    "UPDATE user SET ? WHERE id = ?",
    [{ name: body.name, email: body.email }, userId],
    (err, rows, fields) => {
      if (err) {
        console.error("Error executing MySQL query: " + err);
        return res.status(500).json({ error: "Database error" });
      }
      res.sendStatus(200);
    }
  );
});

process.on("SIGINT", () => {
  connection.end(() => {
    console.log("MySQL connection closed.");
    process.exit(0);
  });
});
