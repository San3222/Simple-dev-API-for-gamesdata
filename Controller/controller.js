const dbConn = require('../db/connection')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signUp = async (req, res, next) => {
    try {
        const data = req.body;
        console.log(data);
        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.user_password, saltRounds);

        // user fill data in signup form
        const sql = `INSERT INTO apidata.games_data (title,platform,score,genre,editors_choice,games_id,email_id,user_password) VALUES (?,?,?,?,?,?,?,?)`;
        // Store the user in the MySQL database
        await dbConn.query(sql, [data.title, data.platform, data.score, data.genre, data.editors_choice, data.games_id, data.email_id, hashedPassword], (error, results) => {
            if (!error) {
                return res.status(201).json({ message: 'User created' });
            } else
                return res.status(500).json({ message: "server error " });
        });

    } catch (error) {
        console.log(error)
    }
}


const login = async (req, res, next) => {
    try {
        const { email_id, user_password } = req.body;
        console.log(email_id);
        const [rows] = await dbConn.query('SELECT * FROM apidata.games_data WHERE email_id = ?', [email_id]);
        // console.log(rows)
        const user = rows[0];
        // console.log(user)
        if (!user) {
            return res.status(400).send('User not found');
        }
        // campare  the hashed Password
        const isMatch = await bcrypt.compare(user_password, user.user_password);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(400).send('incorrect password');
        } else {
            // create a json web token
            // const token = jwt.sign({ email_id }, process.env.SECRET_KEY);
            // console.log(token)
            // return res.status(201).send({ token });

            return res.status(200).json({ message: 'user login' })
        }
    } catch (error) {
        res.status(500).send('server error');
    }
}

//  Get all games data
const get_All_User_data = async (req, res, next) => {
    const filters = req.query;
    const sortBy = 'games_id';
    const order = 'DESC'
    dbConn.query(`SELECT * FROM apidata.games_data ORDER BY ${sortBy} ${order} `, (error, results) => {
        if (error) throw error;
        const filterUsers = results.filter(user => {
            let isValid = true;
            for (key in filters) {
                isValid = isValid && user[key] == filters[key];
            }
            return isValid;
        });
        return res.send({ Game_data: filterUsers });
    });
};

// Create new data
const add_User_data = async (req, res, next) => {
    var data = req.body;

    let sql = `INSERT INTO apidata.games_data (title,platform,score,genre,editors_choice,games_id,email_id,user_password) VALUES (?,?,?,?,?,?,?,?)`;
    dbConn.query(sql, [data.title, data.platform, data.score, data.genre, data.editors_choice, data.games_id, data.email_id, data.user_password], (error, results) => {
        if (!error) {
            return res.status(200).json({ message: 'game  a added successsfully then' });
        } else
            return res.status(500).json(error);
    });
};

// Update new data
const update_User_data = async (req, res, next) => {
    const id = req.params.games_id;
    let data = req.body;
    let sql = `UPDATE apidata.games_data SET title=?, platform=?,score=?,genre=?,editors_choice=?,games_id=?,email_id=?,user_password=? WHERE games_id=?`;
    dbConn.query(sql, [data.title, data.platform, data.score, data.genre, data.editors_choice, data.games_id, data.email_id, data.user_password, id], (error, results) => {
        if (!error) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: 'Game data id does not found' });
            }
            return res.status(200).json({ message: 'Games data updated successfully' });
        } else {
            return res.status(500).json(err);
        }
    });
};

// Delete data
const delete_User_data = async (req, res, next) => {
    var id = req.params.games_id;

    let sql = "DELETE FROM apidata.games_data WHERE games_id=?";
    dbConn.query(sql, [id], (error, results) => {
        if (!error) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: 'Game data id does not found' });
            }
            return res.status(200).json({ message: 'Games data Deleted successfully' });
        } else {
            return res.status(500).json(err);
        }
    });
};


module.exports = { signUp, login, get_All_User_data, add_User_data, update_User_data, delete_User_data };
