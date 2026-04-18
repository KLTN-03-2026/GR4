const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL
router.get("/", (req, res) => {
  db.query("SELECT * FROM roles", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET BY ID
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM roles WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(404).json({ message: "Role not found" });

    res.json(result[0]);
  });
});

// CREATE
router.post("/", (req, res) => {
  const { name } = req.body;

  db.query("INSERT INTO roles (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, name });
  });
});

// UPDATE
router.put("/:id", (req, res) => {
  const { name } = req.body;

  db.query(
    "UPDATE roles SET name = ? WHERE id = ?",
    [name, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Role not found" });

      res.json({ message: "Role updated successfully" });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM roles WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Role not found" });

    res.json({ message: "Role deleted successfully" });
  });
});

module.exports = router;