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

router.post("/add", async (req, res) => {
	try {
		const { title } = req.body;
		const newJob = await pool.query(
			"INSERT INTO job (title) VALUES ($1) RETURNING *",
			[title]
		);
		res.status(201).json(newJob.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		await pool.query(`DELETE FROM employer WHERE job_id = $1`, [req.params.id]);
		await pool.query(`DELETE FROM job WHERE id = $1`, [req.params.id]);

		res.status(200).json({ message: "Job deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
