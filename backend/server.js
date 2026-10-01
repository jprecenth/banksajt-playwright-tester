import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from "mysql2/promise"

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
});

async function query(sql, params) {
    const [results] = await pool.execute(sql, params);
    return results
}


app.post("/users", async (req, res) => {
    const { username, password } = req.body;

    try {
        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        const params = [username, password];
        const result = await query(sql, params);

        console.log("result", result)

        const userID = result.insertId;
        const amount = 0;

        const sql2 = "INSERT INTO accounts (userID, amount) VALUES (?, ?)";
        const params2 = [userID, amount];
        const result2 = await query(sql2, params2);
        res.send("User created!");
    }
    catch (error) {
        console.log(error)
        res.status(500).send("User creation failed")
    }
});

app.post("/sessions", async (req, res) => {
    const { username, password } = req.body;

    try {
        const sql = "SELECT * FROM users WHERE username = ? and password = ?";
        const params = [username, password];
        const result = await query(sql, params);

        if (result.length > 0) {
            const userID = result[0].userID;
            const OTP = generateOTP();
            const sql2 = 'INSERT INTO sessions (userID, token) VALUES (?, ?)';
            const params2 = [userID, OTP];
            const result2 = await query(sql2, params2);
            console.log("result2:", result2)
            res.status(200).json({
                "token": OTP
            });
        }
        else {
            console.log("User not found")
            res.status(401).send("User could not be found.")
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Session couldn't be verified")
    }
})


app.post("/me/accounts", async (req, res) => {
    const { token } = req.body;

    try {
        const sql = "SELECT * FROM sessions WHERE token = ?";
        const result = await query(sql, [token]);

        if (result.length > 0) {
            const userID = result[0].userID;
            const sql2 = "SELECT * FROM accounts WHERE userID = ?";
            const params2 = [userID];
            const result2 = await query(sql2, params2);

            if (result2.length > 0) {
                res.status(200).json({
                    "amount": result2[0].amount
                })
            }
        }
        else {
            console.log("Account not found")
            res.status(401).send("Account could not be found.")
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Account couldn't be verified")
    }
})

app.post("/me/accounts/transactions", async (req, res) => {
    const { token, amount } = req.body;

    try {
        const sql = "SELECT * FROM sessions WHERE token = ?";
        const result = await query(sql, [token])

        if (result.length > 0) {
            const userID = result[0].userID;
            const sql2 = "UPDATE accounts SET amount = amount + ? WHERE userID = ?";
            const params2 = [amount, userID];
            const result2 = await query(sql2, params2);

            if (result2.affectedRows > 0) {
                const sqlHistory = 'INSERT INTO history (transAmount, userID) VALUES (?, ?)';
                await query(sqlHistory, [amount, userID])

                const sql3 = "SELECT amount FROM accounts WHERE userID = ?";
                const result3 = await query(sql3, [userID]);
                
                res.status(200).json({
                    "amount": result3[0].amount
                })
            }
            else {
                console.log("User ID not found")
                res.status(401).send("User ID could not be found.")
            }
        }
        else {
            console.log("Session not found")
            res.status(401).send("Session could not be found.")
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Transaction couldn't be completed")
    }
})



app.use(cors());
app.use(bodyParser.json());

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

app.listen(port, () => {
    console.log(`Bankens backend körs på http://localhost:${port}`);
});


