const { Router } = require("express");
const router = Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
	try {
		const employers = await pool.query(`SELECT * FROM employer`);

		res.status(200).json(employers.rows);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const employer = await pool.query(
			`SELECT employer.name, employer.salary, job.title FROM employer 
            LEFT JOIN job ON employer.job_id = job.id 
            WHERE employer.id = $1 `,
			[id]
		);

		res.status(200).json(employer.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

router.post("/add", async (req, res) => {
	try {
		const { name, salary, degree, job_id } = req.body;
		const newEmployer = await pool.query(
			"INSERT INTO employer (name, salary , degree, job_id) VALUES ($1,$2,$3, $4) RETURNING *",
			[name, salary, degree, job_id]
		);
		res.status(201).json(newEmployer.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { name, salary, degree, job_id } = req.body;

		const oldEmployer = await pool.query(`SELECT * FROM employer WHERE id=$1`, [
			id,
		]);

		const updatedEmployer = await pool.query(
			"UPDATE employer SET name=$1, salary=$2, degree = $3, job_id = $4 WHERE id = $5  RETURNING *",
			[
				name ? name : oldEmployer.rows[0].name,
				salary ? salary : oldEmployer.rows[0].salary,
				degree ? degree : oldEmployer.rows[0].degree,
				job_id ? job_id : oldEmployer.rows[0].job_id,
				id,
			]
		);
		res.status(201).json(updatedEmployer.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await pool.query("DELETE FROM employer WHERE id = $1", [id]);
		res.status(200).json({ message: "Employer deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
