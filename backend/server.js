import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from "mysql2/promise"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 3001;

const secret = process.env.JWT_SECRET;

if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("JWT_SECRET måste vara minst 32 byte");
}

app.use(bodyParser.json());
app.use(cors());

app.get("/healthy", (req, res) => {
    res.status(200).send("Port up and running.")
});

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

function requireAuth(req, res, next) {
    const match = /^Bearer (.+)$/.exec(req.get("authorization") ?? "");
    if (!match) return res.status(401).json({ error: "Missing token." })
    const token = match[1];

    try {
        const decoded = jwt.verify(token, secret, {
            algorithms: ['HS256'],
            issuer: "banken",
            audience: "banken-api"
        })
        if (typeof decoded !== "object" || decoded == null || typeof decoded.sub !== "string" || Number(decoded.sub) <= 0 || !Number.isSafeInteger(Number(decoded.sub))) {
            return res.status(401).send("Invalid token.")
        }
        const userID = Number(decoded.sub);
        req.userID = userID;
        next();
    }
    catch (error) {
        return res.status(401).send("Invalid or expired token.")
    }
}

app.post("/users", async (req, res) => {
    const { username, password } = req.body;
    if (password.length < 8) {
        return res.status(400).send("Password too short.")
    }
    try {
        const passwordHash = await bcrypt.hash(password, 12);

        const sql = "INSERT INTO users (username, passwordHash) VALUES (?, ?)";
        const params = [username, passwordHash];
        const result = await query(sql, params);

        console.log("result", result)

        const userID = result.insertId;
        const amount = 0;

        const sql2 = "INSERT INTO accounts (userID, amount) VALUES (?, ?)";
        const params2 = [userID, amount];
        await query(sql2, params2);
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
        const sql = "SELECT * FROM users WHERE username = ?";
        const result = await query(sql, [username]);

        if (result.length === 0) {
            return res.status(401).json({ error: "Wrong username or password." })
        }

        const passwordIsCorrect = await bcrypt.compare(password, result[0].passwordHash);
        if (!passwordIsCorrect) {
            return res.status(401).json({ error: "Wrong username or password." })
        }

        const userID = result[0].userID;
        const token = jwt.sign({ sub: String(userID) }, process.env.JWT_SECRET, {
            algorithm: "HS256",
            issuer: "banken",
            audience: "banken-api",
            expiresIn: "15m",
        });

        const sql2 = 'INSERT INTO sessions (userID, token) VALUES (?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token)';
        const params2 = [userID, token];
        await query(sql2, params2);

        res.status(200).json({
            "token": token
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Session couldn't be verified")
    }
})

// app.get("/me/accounts", async (req, res) => {
//     const { token } = req.query;

//     try {
//         const sql = "SELECT * FROM sessions WHERE token = ?";
//         const result = await query(sql, [token]);

//         if (result.length > 0) {
//             const userID = result[0].userID;
//             const sql2 = "SELECT * FROM accounts WHERE userID = ?";
//             const params2 = [userID];
//             const result2 = await query(sql2, params2);

//             if (result2.length > 0) {
//                 res.status(200).json({
//                     "amount": result2[0].amount
//                 })
//             }
//         }
//         else {
//             console.log("Account not found")
//             res.status(401).send("Account could not be found.")
//         }
//     }
//     catch (error) {
//         console.log(error)
//         res.status(500).send("Account couldn't be verified")
//     }
// })

app.post("/me/accounts", requireAuth, async (req, res) => {
    const userID = req.userID;

    try {
        const sql = "SELECT amount FROM accounts WHERE userID = ?";
        const params = [userID];
        const result = await query(sql, params);

        if (result.length > 0) {
            return res.status(200).json({
                "amount": result[0].amount
            })
        }
        else {
            return res.status(404).send("Account could not be found.")
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send("Account could not be verified.")
    }
})

app.post("/me/accounts/transactions", requireAuth, async (req, res) => {
    const { amount } = req.body;
    const userID = req.userID;

    try {
        const sql = "UPDATE accounts SET amount = amount + ? WHERE userID = ?";
        const params = [amount, userID];
        const result = await query(sql, params);

        if (result.affectedRows > 0) {
            const sqlHistory = 'INSERT INTO history (transAmount, userID) VALUES (?, ?)';
            await query(sqlHistory, [amount, userID])

            const sql2 = "SELECT amount FROM accounts WHERE userID = ?";
            const result3 = await query(sql2, [userID]);

            res.status(200).json({
                "amount": result3[0].amount
            })
        }
        else {
            console.log("User ID not found")
            return res.status(404).send("Account not found.")
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send("Transaction couldn't be completed")
    }
})


app.post("/history", requireAuth, async (req, res) => {
    const userID = req.userID;

    try {
        const sql = "SELECT * FROM history WHERE userID = ? ORDER BY date_time DESC";
        const result = await query(sql, [userID]);

        if (result.length > 0) {
            return res.status(200).json(result)
        }
        else {
            console.log("No transactions found")
            return res.status(200).json([])
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send("Transaction data could not be reached.")
    }
})

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Bankens backend körs på http://localhost:${port}`);
});


