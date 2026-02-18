const mysql = require('mysql2');

//Connection a la bdd
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'frogue',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//Fonction query a réutiliser pour les fonctions qui demande une connexion a la bdd
exports.query = function(sql, params = []) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

//Fonction pour recuperer une seule ligne de la table
exports.getOne = async function(sql, params = []) {
    const results = await exports.query(sql, params);
    return results[0];
};