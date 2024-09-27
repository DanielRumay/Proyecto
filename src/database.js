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

function modificarUsuario(userModificado, userActual) {
    return new Promise((resolve, reject) => {

        const query = 'UPDATE usuario set NombreUsu = ?, Nombre = ?, Apellido = ?, Contraseña = ?, Puesto = ?, ContraseñaTemp = ? WHERE NombreUsu = ?'
        const { NombreUsu, Nombre, Apellido, Contraseña, Puesto, ContraseñaTemp } = userModificado;

        connection.query(query, [NombreUsu, Nombre, Apellido, Contraseña, Puesto, ContraseñaTemp, userActual], (error, resultar) => {
            if (error) {
                return reject(error);
            }
            resolve(resultar || [])
        })
    })
}

function getProveedores() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT ID_Proveedor, Nombre, Contacto, Disponibilidad FROM proveedor';

        connection.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            // Transformar los resultados para cambiar 0 y 1 por "No" y "Sí"
            const transformedResults = results.map(proveedor => ({
                ...proveedor,
                Disponibilidad: proveedor.Disponibilidad === 1 ? "Sí" : "No"
            }));
            resolve(transformedResults || []);
        });
    });
}

function agregarProveedores(provObj){
    return new Promise((resolve, reject)=>{
        const query = 'INSERT INTO proveedor(Nombre,Contacto,Disponibilidad) VALUES(?,?,?)'
        const { Nombre,Contacto,Disponibilidad } = provObj;
        
        connection.query(query,[Nombre,Contacto,Disponibilidad], (error,resultar)=>{
            if(error){
                return reject(error);
            }
            resolve(resultar || [])
        })
    })
}

function eliminarProveedores(nombreProv){
    return new Promise((resolve, reject)=>{
        const query = 'DELETE FROM proveedor WHERE Nombre = ?';
        connection.query(query, [nombreProv], (error,results)=>{
            if(error){
                return reject(error);
            }
            resolve(results || []);
        })
    })
}


module.exports = { checkCredentials, getUsuarios, eliminarUsuario, agregarUsuario, modificarUsuario, getProveedores, agregarProveedores,eliminarProveedores };

