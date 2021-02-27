const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

const app = express();
//MySQL connection
const connection = require("./db");

app.use(bodyParser.json());

// Route
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

// list customers
app.get("/customers", (req, res) => {
  const sql = "SELECT * FROM customers";
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length) {
      res.json(results);
    } else {
      res.send("Not results");
    }
  });
});

// get by id
app.get("/customers/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM customers WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;
    if (result.length) {
      res.json(result);
    } else {
      res.send("Not result");
    }
  });
});

// add
app.post("/add", (req, res) => {
  const sql = "INSERT INTO customers SET ?";
  // utilidad de body-parser
  const customerObj = {
    name: req.body.name,
    city: req.body.city,
  };
  connection.query(sql, customerObj, (error) => {
    if (error) throw error;
    res.send("Customer created");
  });
});

// update
app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, city } = req.body;
  const sql_base = "UPDATE customers SET";
  let sql;
  if (!name && city) {
    sql = `${sql_base} city = '${city}}`;
  } else if (name && !city) {
    sql = `${sql_base} name = '${name}'`;
  } else {
    sql = `${sql_base} name = '${name}', city = '${city}}`;
  }
  connection.query(sql, (error) => {
    if (error) throw error;
    res.send("Customer updated");
  });
});

// delete
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM customers WHERE id = ${id}`;
  connection.query(sql, (error) => {
    if (error) throw error;
    res.send("Customer deleted");
  });
});

// Check connect
connection.connect((error) => {
  if (error) throw error;
  console.log("Database connection success");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
