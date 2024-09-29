const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'DESKTOP-R6JBD3D',
    user: 'Rodrigo',
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
// -------------USUARIOS-------------
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

        connection.query(query, [NombreUsu, Nombre, Apellido, Contraseña, Puesto, ContraseñaTemp, userActual], (error, resultar) => {
            if (error) {
                return reject(error);
            }
            resolve(resultar || [])
        })
    })
}
// -------------PROVEEDORES-------------
function getProveedores() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT ID_Proveedor, Nombre, Contacto FROM proveedor';

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

function agregarProveedores(provObj) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO proveedor(Nombre,Contacto) VALUES(?,?)'
        const { Nombre, Contacto } = provObj;

        connection.query(query, [Nombre, Contacto], (error, resultar) => {
            if (error) {
                return reject(error);
            }
            resolve(resultar || [])
        })
    })
}

function eliminarProveedores(nombreProv) {
    return new Promise(async (resolve, reject) => {
        try {
            // Primero, eliminar todas las relaciones en proveedor_servicio
            const deleteRelationsQuery = 'DELETE FROM proveedor_servicio WHERE ID_Proveedor = (SELECT ID_Proveedor FROM proveedor WHERE Nombre = ?)';
            await new Promise((resolveRelations, rejectRelations) => {
                connection.query(deleteRelationsQuery, [nombreProv], (error, results) => {
                    if (error) {
                        return rejectRelations(error);
                    }
                    resolveRelations(results);
                });
            });

            // Luego, eliminar el proveedor
            const deleteProveedorQuery = 'DELETE FROM proveedor WHERE Nombre = ?';
            connection.query(deleteProveedorQuery, [nombreProv], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results || []);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function modificarProveedores(newProv, prov) {
    return new Promise((resolve, reject) => {
        query = 'UPDATE proveedor SET Nombre=?, Contacto=?, Disponibilidad=? WHERE Nombre =?';
        const { Nombre, Contacto, Disponibilidad } = newProv;

        connection.query(query, [Nombre, Contacto, Disponibilidad, prov], (error, resultar) => {
            if (error) {
                return reject(error);
            }
            resolve(resultar || []);
        })
    })
}

function getIDServicio(servicio) {
    return new Promise((resolve, reject) => {
        query = 'SELECT ID_Servicio FROM servicio WHERE Servicio =?';
        connection.query(query, [servicio], (error, resultar) => {
            if (error) {
                return reject(error);
            }
            resolve(resultar || []);
        })
    })
}

function agregarServicioProveedor(servicio, ID_Proveedor, precio, disponibilidad) {
    return new Promise((resolve, reject) => {
        query = 'INSERT INTO proveedor_servicio (ID_Proveedor,ID_Servicio,Precio, Disponibilidad) VALUES (?,?,?,?)';
        connection.query(query, [ID_Proveedor, servicio, precio, disponibilidad], (error, resultar) => {
            if (error) {
                return reject(error);
            }
            resolve(resultar || []);
        })
    })
}


function getIDServicioProveedor(ID_Proveedor) {
    return new Promise((resolve, reject) => {
        query = 'SELECT ID_Servicio FROM proveedor_servicio WHERE ID_Proveedor =?';
        connection.query(query, [ID_Proveedor], (error, resultar) => {
            if (error) {
                return reject(error);
            }
            resolve(resultar || []);
        })
    })
}

function getPrecioServicioProveedor(ID_Proveedor, ID_Servicio) {
    return new Promise((resolve, reject) => {
        const placeholders = ID_Servicio.map(() => '?').join(',');
        query = `SELECT Precio FROM proveedor_servicio WHERE ID_Proveedor =? AND ID_Servicio IN (${placeholders})`;
        connection.query(query, [ID_Proveedor, ...ID_Servicio], (error, resultar) => {
            if (error) {
                return reject(error);
            }
            resolve(resultar || []);
        })
    })
}

function getNombreServicio(ID_Servicio) {
    return new Promise((resolve, reject) => {
        const placeholders = ID_Servicio.map(() => '?').join(',');
        const query = `SELECT Servicio FROM servicio WHERE ID_Servicio IN (${placeholders})`;

        connection.query(query, ID_Servicio, (error, resultado) => {
            if (error) {
                return reject(error);
            }
            resolve(resultado || []);
        });
    });
}

function getDisponibilidadServicio(ID_Servicio, ID_Proveedor) {
    return new Promise((resolve, reject) => {
        const placeholders = ID_Servicio.map(() => '?').join(',');
        const query = `SELECT Disponibilidad FROM proveedor_servicio WHERE ID_Servicio IN (${placeholders}) AND ID_Proveedor =?`;

        connection.query(query, [...ID_Servicio, ID_Proveedor], (error, resultado) => {
            if (error) {
                return reject(error);
            }
            resolve(resultado || []);
        });
    });
}

function modificarServicioProveedor(idServicio, idProveedor, precio, disponibilidad) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE proveedor_servicio
            SET precio = ?, disponibilidad = ?
            WHERE ID_Servicio = ? AND ID_Proveedor = ?;
        `;


        connection.query(query, [precio, disponibilidad, idServicio, idProveedor], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getPrototipos() {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT p.ID_Prototipo, 
        p.Nombre AS Nombre_Prototipo, 
        d.Destino AS Nombre_Destino, 
        GROUP_CONCAT(DISTINCT pr.Nombre ORDER BY pr.Nombre ASC SEPARATOR ', ') AS Proveedores,
        GROUP_CONCAT(DISTINCT s.Servicio ORDER BY s.Servicio ASC SEPARATOR ', ') AS Servicios
        FROM prototipo p
        LEFT JOIN prototipo_destino pd ON p.ID_Prototipo = pd.ID_Prototipo
        LEFT JOIN destino d ON pd.ID_Destino = d.ID_Destino
        LEFT JOIN prototipo_proveedor pp ON pp.ID_Prototipo = p.ID_Prototipo
        LEFT JOIN proveedor pr ON pp.ID_Proveedor = pr.ID_Proveedor
        LEFT JOIN proveedor_servicio ps ON pr.ID_Proveedor = ps.ID_Proveedor
        LEFT JOIN servicio s ON ps.ID_Servicio = s.ID_Servicio
        GROUP BY p.ID_Prototipo, d.Destino;`;
        connection.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        })
    })
}


function agregarPrototipo(protObj) {
    return new Promise((resolve, reject) => {
        const queryPrototipo = 'INSERT INTO prototipo(Nombre, usuario_ID_Usuario) VALUES(?, ?)';
        const queryDestino = 'INSERT INTO prototipo_destino(ID_Destino, ID_Prototipo) VALUES(?, ?)';
        
        const { Nombre, ID_Destino, usuario_ID_Usuario } = protObj; // Desestructurar correctamente

        // Primero insertamos en la tabla prototipo
        connection.query(queryPrototipo, [Nombre, usuario_ID_Usuario], (error, resultado) => {
            if (error) {
                return reject(error);
            }

            // Obtenemos el ID del prototipo recién insertado
            const idPrototipoInsertado = resultado.insertId;

            // Ahora insertamos en la tabla prototipo_destino
            connection.query(queryDestino, [ID_Destino, idPrototipoInsertado], (errorDestino, resultadoDestino) => {
                if (errorDestino) {
                    return reject(errorDestino);
                }
                resolve(resultadoDestino || []);
            });
        });
    });
}


module.exports = {
    checkCredentials, getUsuarios, eliminarUsuario, agregarUsuario, modificarUsuario,
    getProveedores, agregarProveedores, eliminarProveedores, modificarProveedores, getIDServicio, agregarServicioProveedor,
    getNombreServicio, getIDServicioProveedor, getDisponibilidadServicio, getPrecioServicioProveedor,
    modificarServicioProveedor, getPrototipos, agregarPrototipo
};

