const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
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
        const query = 'SELECT NombreUsu, CONCAT(Nombre, " ", Apellido) AS NombreCompleto, Puesto, Contraseña, ContraseñaTemp FROM usuario';
        
        connection.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results || []);
        });
    });
}

function eliminarUsuario(nombreUsu){
    return new Promise((resolve, reject)=>{
        const query = 'DELETE FROM usuario WHERE NombreUsu = ?';
        connection.query(query, [nombreUsu], (error,results)=>{
            if(error){
                return reject(error);
            }
            resolve(results || []);
        })
    })
}

function agregarUsuario(userObj){
    console.log(userObj);
    return new Promise((resolve, reject)=>{
        const query = 'INSERT INTO usuario(NombreUsu,Nombre,Apellido,Contraseña,Puesto,ContraseñaTemp) VALUES(?,?,?,?,?,?)'
        const { NombreUsu, Nombre, Apellido, Contraseña, Puesto, ContraseñaTemp } = userObj;
        
        connection.query(query,[NombreUsu, Nombre, Apellido, Contraseña, Puesto, ContraseñaTemp], (error,resultar)=>{
            if(error){
                return reject(error);
            }
            resolve(resultar || [])
        })
    })
}


module.exports = { checkCredentials, getUsuarios, eliminarUsuario, agregarUsuario};

