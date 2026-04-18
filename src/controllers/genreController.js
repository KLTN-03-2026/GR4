const db = require("../db");

/* ================= GET ALL GENRES ================= */
exports.getAllGenres = (req, res) => {
  try {
    db.query("SELECT * FROM genres", (err, genres) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(genres);
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= GET PUBLIC GENRES ================= */
exports.getPublicGenres = (req, res) => {
  try {
    db.query("SELECT * FROM genres ORDER BY name ASC", (err, genres) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(genres);
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= GET GENRE BY ID ================= */
exports.getGenreById = (req, res) => {
  try {
    db.query(
      "SELECT * FROM genres WHERE id=?",
      [req.params.id],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (result.length === 0)
          return res.status(404).json({ message: "Genre not found" });

        res.json(result[0]);
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= CREATE GENRE ================= */
exports.createGenre = (req, res) => {
  try {
    const { name } = req.body;

    db.query(
      "INSERT INTO genres (name) VALUES (?)",
      [name],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.json({
          message: "Genre created",
          id: result.insertId,
          name
        });
      }
    );

  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= UPDATE GENRE ================= */
exports.updateGenre = (req, res) => {
  try {
    const { name } = req.body;

    db.query(
      "UPDATE genres SET name=? WHERE id=?",
      [name, req.params.id],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Genre not found" });

        res.json({ message: "Genre updated successfully" });
      }
    );

  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= DELETE GENRE ================= */
exports.deleteGenre = (req, res) => {
  try {
    db.query(
      "DELETE FROM genres WHERE id=?",
      [req.params.id],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Genre not found" });

        res.json({ message: "Genre deleted successfully" });
      }
    );

  } catch (err) {
    res.status(500).json(err);
  }
};