const { Router } = require("express");
const router = Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
	try {
		const jobs = await pool.query("SELECT * FROM job");

		res.status(200).json(jobs.rows);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const job = await pool.query("SELECT * FROM job WHERE id = $1", [id]);
		res.status(200).json(job.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

router.post("/add", async (req, res) => {
	try {
		const { title, description, salary, company, contact_email } = req.body;
		const newJob = await pool.query(
			"INSERT INTO job (title, description, salary, company, contact_email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
			[title, description, salary, company, contact_email]
		);
		res.status(201).json(newJob.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
