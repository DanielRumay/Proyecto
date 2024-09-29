const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sisope',
    database: 'proyectologisticoo'
});


function checkCredentials(user, password) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuario WHERE NombreUsu = ? AND Contraseña = ?';

        connection.query(query, [user, password], (error, results) => {
            if (error) {
                return reject(error);
            }

            if (results.length > 0) {
                resolve(results[0]);
            } else {
                resolve(null);
            }
        });
    });
}

function getUsuarios() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT NombreUsu, Nombre, Apellido, Puesto, Contraseña, ContraseñaTemp FROM usuario';

        connection.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results || []);
        });
    });
}

function eliminarUsuario(nombreUsu) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM usuario WHERE NombreUsu = ?';
        connection.query(query, [nombreUsu], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results || []);
        })
    })
}

function agregarUsuario(userObj) {
    console.log(userObj);
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO usuario(NombreUsu,Nombre,Apellido,Contraseña,Puesto,ContraseñaTemp) VALUES(?,?,?,?,?,?)'
        const { NombreUsu, Nombre, Apellido, Contraseña, Puesto, ContraseñaTemp } = userObj;

        connection.query(query, [NombreUsu, Nombre, Apellido, Contraseña, Puesto, ContraseñaTemp], (error, resultar) => {
            if (error) {
                return reject(error);
            }
            resolve(resultar || [])
        })
    })
}

function modificarUsuario(userModificado, userActual) {
    return new Promise((resolve, reject) => {

        const query = 'UPDATE usuario set NombreUsu = ?, Nombre = ?, Apellido = ?, Contraseña = ?, Puesto = ?, ContraseñaTemp = ? WHERE NombreUsu = ?'
        const { NombreUsu, Nombre, Apellido, Contraseña, Puesto, ContraseñaTemp } = userModificado;

        connection.query(query, [NombreUsu, Nombre, Apellido, Contraseña, Puesto, ContraseñaTemp, userActual.nombreUsu], (error, resultar) => {
            if (error) {
                return reject(error);
            }
            resolve(resultar || [])
        })
    })
}

function agregarPaqueFinal(paquete) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO paquetefinal(ID_Prototipo, Descripcion) VALUES(?, ?)';
        const { ID_Prototipo, Descripcion } = paquete;

        connection.query(query, [ID_Prototipo, Descripcion], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result || []);
        });
    });
}

function getPrototipoDisponibles() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT p.ID_Prototipo, p.Nombre 
            FROM prototipo p 
            LEFT JOIN paquetefinal pf ON p.ID_Prototipo = pf.ID_Prototipo 
            WHERE pf.ID_Prototipo IS NULL;
        `;

        connection.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results || []);
        });
    });
}


module.exports = { checkCredentials, getUsuarios, eliminarUsuario, agregarUsuario, modificarUsuario, agregarPaqueFinal, getPrototipoDisponibles};