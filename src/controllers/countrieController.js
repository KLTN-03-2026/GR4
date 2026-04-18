const db = require("../db");

/* ================= GET ALL COUNTRIES ================= */
exports.getAllCountries = (req, res) => {
  try {
    // kiểm tra quyền admin
    if (!req.user || req.user.role_id !== 1) {
      return res.status(403).json({
        message: "Chỉ admin mới có quyền xem"
      });
    }

    db.query("SELECT * FROM countries", (err, countries) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(countries);
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= GET PUBLIC COUNTRIES ================= */
exports.getPublicCountries = (req, res) => {
  try {
    db.query("SELECT * FROM countries ORDER BY name ASC", (err, countries) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(countries);
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= GET COUNTRY BY ID ================= */
exports.getCountryById = (req, res) => {
  try {
    db.query(
      "SELECT * FROM countries WHERE id=?",
      [req.params.id],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (result.length === 0)
          return res.status(404).json({ message: "Country not found" });

        res.json(result[0]);
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= CREATE COUNTRY ================= */
exports.createCountry = (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "Country name is required" });

    db.query(
      "INSERT INTO countries (name) VALUES (?)",
      [name],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.json({
          message: "Country created",
          id: result.insertId,
          name
        });
      }
    );

  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= UPDATE COUNTRY ================= */
exports.updateCountry = (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "Country name is required" });

    db.query(
      "UPDATE countries SET name=? WHERE id=?",
      [name, req.params.id],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Country not found" });

        res.json({ message: "Country updated successfully" });
      }
    );

  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= DELETE COUNTRY ================= */
exports.deleteCountry = (req, res) => {
  try {
    db.query(
      "DELETE FROM countries WHERE id=?",
      [req.params.id],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Country not found" });

        res.json({ message: "Country deleted successfully" });
      }
    );

  } catch (err) {
    res.status(500).json(err);
  }
};