const { app, BrowserWindow, ipcMain } = require('electron');
const database = require('./database.js');
const url = require('url');
const path = require('path');
const { create } = require('domain');
const { utimesSync } = require('fs');

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

let mainWindow, emergenteWindow, newProductWindow, AdmUserWindow, errorDuplicadoWindow, ProvWindow, errorDuplicadoWindow2, ProvemergenteWindow
let userLogged = null;

app.on('ready', () => {
    createMainWindow();
})

//----------------------VENTANAS ----------------------
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 1600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/inicioSecion.html'),
        protocol: 'file',
        slashes: true,
    }))

    mainWindow.setMenuBarVisibility(false);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createErrorWindow() {
    emergenteWindow = new BrowserWindow({
        width: 1050,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    emergenteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/error_404.html'),
        protocol: 'file',
        slashes: true,
    }))

    emergenteWindow.setMenuBarVisibility(false);

    emergenteWindow.on('closed', () => {
        emergenteWindow = null;
    });
}

function createConfirmWindow() {
    emergenteWindow = new BrowserWindow({
        width: 1050,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    emergenteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/confirmacion.html'),
        protocol: 'file',
        slashes: true,
    }))

    emergenteWindow.setMenuBarVisibility(false);

    emergenteWindow.on('closed', () => {
        emergenteWindow = null;
    });
}

function createWindowEvalu(userData) {
    newProductWindow = new BrowserWindow({
        width: 1400,
        height: 1600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Evalu/principal_evalu.html'),
        protocol: 'file',
        slashes: true,
    }));
    newProductWindow.setMenuBarVisibility(false);
    newProductWindow.webContents.on('did-finish-load', () => {
        newProductWindow.webContents.send('check-credentials', userData);
    });
    newProductWindow.on('closed', () => {
        newProductWindow = null;
    });
}

function createWindowCoordi(userData) {
    newProductWindow = new BrowserWindow({
        width: 1400,
        height: 1600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Coordi/principal_coordi.html'),
        protocol: 'file',
        slashes: true,
    }));
    newProductWindow.setMenuBarVisibility(false);
    newProductWindow.webContents.on('did-finish-load', () => {
        newProductWindow.webContents.send('check-credentials', userData);
    });
    newProductWindow.on('closed', () => {
        newProductWindow = null;
    });
}

function createWindowAdmin(userData) {
    newProductWindow = new BrowserWindow({
        width: 1400,
        height: 1600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Admin/principal_Admi.html'),
        protocol: 'file',
        slashes: true,
    }));
    newProductWindow.setMenuBarVisibility(false);
    newProductWindow.webContents.on('did-finish-load', () => {
        newProductWindow.webContents.send('check-credentials', userData);
    });
    newProductWindow.on('closed', () => {
        newProductWindow = null;
    });
}
function createAdmUser(userData, user) {
    AdmUserWindow = new BrowserWindow({
        width: 1400,
        height: 1600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    AdmUserWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Admin/gestionUsuarios.html'),
        protocol: 'file',
        slashes: true,
    }))
    AdmUserWindow.setMenuBarVisibility(false);
    AdmUserWindow.on('closed', () => {
        AdmUserWindow = null;
    });
    AdmUserWindow.webContents.on('did-finish-load', () => {
        AdmUserWindow.webContents.send('datos-usuarios', userData, user);
    });
}
function EmergenteUser() {
    emergenteWindow = new BrowserWindow({
        width: 1050,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    emergenteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Admin/confirmacionEU.html'),
        protocol: 'file',
        slashes: true,
    }))
    emergenteWindow.setMenuBarVisibility(false);
    emergenteWindow.on('closed', () => {
        emergenteWindow = null;
    });
    emergenteWindow.webContents.on('did-finish-load', () => {
        emergenteWindow.webContents.send('solicitar-confirmacion');
    });
}

function EmergenteAgregarUsuario() {
    emergenteWindow = new BrowserWindow({
        width: 1050,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    emergenteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Admin/formUsuario.html'),
        protocol: 'file',
        slashes: true,
    }))
    emergenteWindow.setMenuBarVisibility(false);
    emergenteWindow.on('closed', () => {
        emergenteWindow = null;
    });
    emergenteWindow.webContents.on('did-finish-load', () => {
        emergenteWindow.webContents.send('guardar-usuario');
    });
}

function EmergenteModificarUsuario(usuario) {
    emergenteWindow = new BrowserWindow({
        width: 1050,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    emergenteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Admin/formUsuario.html'),
        protocol: 'file',
        slashes: true,
    }))
    emergenteWindow.setMenuBarVisibility(false);
    emergenteWindow.on('closed', () => {
        emergenteWindow = null;
    });
    emergenteWindow.webContents.on('did-finish-load', () => {
        emergenteWindow.webContents.send('modificar-usuario', usuario);
    });
}


function EmergenteErrorDuplicado() {
    errorDuplicadoWindow = new BrowserWindow({
        width: 1050,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    errorDuplicadoWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Admin/errorDuplicado.html'),
        protocol: 'file',
        slashes: true,
    }))

    errorDuplicadoWindow.setMenuBarVisibility(false);

    errorDuplicadoWindow.on('closed', () => {
        errorDuplicadoWindow = null;
    });
}


//----------------------IPC MAIN----------------------
ipcMain.on('close', (e) => {
    newProductWindow.close();
    createConfirmWindow();
});
ipcMain.on('cerrarsecion', (e) => {
    emergenteWindow.close();
    createMainWindow();
});
ipcMain.on('Mensaje', (e) => {
    console.log('Hola');
})

ipcMain.on('form-user', (e,) => {
    AdmUserWindow.close();
    EmergenteAgregarUsuario();
})

ipcMain.on('close_error', (e) => {
    emergenteWindow.close();
    createMainWindow();
});

ipcMain.on('close_confirmacion', (e) => {
    emergenteWindow.close();
    createMainWindow();
});

ipcMain.on('close_funcion', (e, userData) => {
    AdmUserWindow.close();
    createWindowAdmin(userData);
});


ipcMain.on('cerrar-error', async (e) => {
    try {
        const userData = await database.getUsuarios();
        createAdmUser(userData, userLogged);
        if (errorDuplicadoWindow) { await errorDuplicadoWindow.close(); }
        await emergenteWindow.close();
    } catch (error) {
        console.log(error);
    }
})

ipcMain.on('form-actualizar-user', async (e, usuario) => {
    await EmergenteModificarUsuario(usuario);
    await AdmUserWindow.close();
});



ipcMain.on('openCU', async (e, user) => {
    try {
        const userData = await database.getUsuarios();
        if (newProductWindow) {
            newProductWindow.close();
        }
        createAdmUser(userData, user);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }
});

// FUNCIONES PARA ELIMINAR EL USUARIO
ipcMain.on('confirmar-eliminar-usuario', async (e, usuario) => {
    try {
        await database.eliminarUsuario(usuario);
        //e.sender.send('actualizar-user-eliminado', usuario);
        EmergenteUser();
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
    }
});

ipcMain.on('cerrar-ventana-confirmacion', async (e) => {

    if (AdmUserWindow) {
        await AdmUserWindow.close();
    }
    const userData = await database.getUsuarios();
    createAdmUser(userData, userLogged);
    await emergenteWindow.close();
});

// ---FUNCIONES PARA AGREGAR EL USUARIO---
ipcMain.on('agregar-usuario', async (e, newUser) => {
    try {
        await database.agregarUsuario(newUser);
        const userData = await database.getUsuarios();
        emergenteWindow.close();
        createAdmUser(userData, userLogged);
    } catch (error) {
        EmergenteErrorDuplicado();
    }
})

// ---FUNCION PARA MODIFICAR USUARIO---

ipcMain.on('usuario-modificado', async (e, newUser, userActual) => {
    const userData = await database.getUsuarios();
    try {
        await database.modificarUsuario(newUser, userActual);
        const userData = await database.getUsuarios();
        emergenteWindow.close();
        createAdmUser(userData, userLogged);
    } catch (error) {
        console.log(error);
        emergenteWindow.close();
        EmergenteErrorDuplicado();
    }
})

/// ---FUNCION PARA LOGGIN---
ipcMain.on('check-credentials', async (event, confirmUser) => {
    const { user, password } = confirmUser;

    try {
        const userData = await database.checkCredentials(user, password);
        if (userData) {
            userLogged = userData
            const cargo = userData.Puesto;
            if (cargo == "Administrador") {
                if (mainWindow) {
                    mainWindow.close();
                }
                createWindowAdmin(userData);
            }
            if (cargo == "Coordinador") {
                if (mainWindow) {
                    mainWindow.close();
                }
                createWindowCoordi(userData);
            }
            if (cargo == "Evaluador") {
                if (mainWindow) {
                    mainWindow.close();
                }
                createWindowEvalu(userData);
            }
        } else {
            if (mainWindow) {
                mainWindow.close();
            }
            createErrorWindow();
        }
    } catch (error) {
        if (mainWindow) {
            mainWindow.close();
        }
        createErrorWindow();
    }
});

//aquí comienza proveedores:


function EmergenteProv() {
    emergenteWindow = new BrowserWindow({
        width: 1050,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    emergenteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Coordi/confirmacionEP.html'),
        protocol: 'file',
        slashes: true,
    }))
    emergenteWindow.setMenuBarVisibility(false);
    emergenteWindow.on('closed', () => {
        emergenteWindow = null;
    });
    emergenteWindow.webContents.on('did-finish-load', () => {
        emergenteWindow.webContents.send('solicitar-confirmacionp');
    });
}

function createProvUser(provData, user) {
    ProvWindow = new BrowserWindow({
        width: 1400,
        height: 1600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    ProvWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Coordi/consultarProveedores.html'),
        protocol: 'file',
        slashes: true,
    }));
    ProvWindow.setMenuBarVisibility(false);
    ProvWindow.on('closed', () => {
        ProvWindow = null;
    });
    ProvWindow.webContents.on('did-finish-load', () => {
        ProvWindow.webContents.send('gestion-proveedor', provData, user);
    });
}

function EmergenteAgregarProveedor() {
    ProvemergenteWindow = new BrowserWindow({
        width: 1050,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    ProvemergenteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Coordi/formProveedor.html'),
        protocol: 'file',
        slashes: true,
    }))
    ProvemergenteWindow.setMenuBarVisibility(false);
    ProvemergenteWindow.on('closed', () => {
        ProvemergenteWindow = null;
    });
    ProvemergenteWindow.webContents.on('did-finish-load', () => {
        ProvemergenteWindow.webContents.send('guardar-proveedor');
    });
}

function EmergenteModificarProveedor(prov) {
    ProvemergenteWindow = new BrowserWindow({
        width: 1050,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    ProvemergenteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Coordi/formProveedor.html'),
        protocol: 'file',
        slashes: true,
    }))
    ProvemergenteWindow.setMenuBarVisibility(false);
    ProvemergenteWindow.on('closed', () => {
        ProvemergenteWindow = null;
    });
    ProvemergenteWindow.webContents.on('did-finish-load', () => {
        ProvemergenteWindow.webContents.send('modificar-proveedor', prov);
    });
}

function EmergenteServiciosProveedor(ID_Proveedor) {
    ProvemergenteWindow = new BrowserWindow({
        width: 1050,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    ProvemergenteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Coordi/servicios.html'),
        protocol: 'file',
        slashes: true,
    }))
    ProvemergenteWindow.setMenuBarVisibility(false);
    ProvemergenteWindow.on('closed', () => {
        ProvemergenteWindow = null;
    });
    ProvemergenteWindow.webContents.on('did-finish-load', () => {
        ProvemergenteWindow.webContents.send('servicios-proveedor', ID_Proveedor);
    });
}

function EmergenteModificarServiciosProveedor(serviciosCombinados, ID_Proveedor) {
    ProvemergenteWindow = new BrowserWindow({
        width: 1050,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    ProvemergenteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Coordi/servicios.html'),
        protocol: 'file',
        slashes: true,
    }))
    ProvemergenteWindow.setMenuBarVisibility(false);
    ProvemergenteWindow.on('closed', () => {
        ProvemergenteWindow = null;
    });
    ProvemergenteWindow.webContents.on('did-finish-load', () => {
        ProvemergenteWindow.webContents.send('modificar-servicios-proveedor', serviciosCombinados, ID_Proveedor);
    });
}

function EmergenteErrorDuplicado2() {
    errorDuplicadoWindow2 = new BrowserWindow({
        width: 1050,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    errorDuplicadoWindow2.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Coordi/errorDuplicado2.html'),
        protocol: 'file',
        slashes: true,
    }))

    errorDuplicadoWindow2.setMenuBarVisibility(false);

    errorDuplicadoWindow2.on('closed', () => {
        errorDuplicadoWindow2 = null;
    });
}

function EmergenteErrorServicio() {
    errorDuplicadoWindow2 = new BrowserWindow({
        width: 1050,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    errorDuplicadoWindow2.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Coordi/errorServicio.html'),
        protocol: 'file',
        slashes: true,
    }))

    errorDuplicadoWindow2.setMenuBarVisibility(false);

    errorDuplicadoWindow2.on('closed', () => {
        errorDuplicadoWindow2 = null;
    });
}


// IPC MAIN

ipcMain.on('open-consultar-proveedores', async (event, user) => {
    try {
        const userData = await database.getProveedores();
        if (newProductWindow) {
            newProductWindow.close();
        }
        createProvUser(userData, user);
    } catch (error) {
        console.error("Error al obtener los proveedores:", error);
    }
});

ipcMain.on('cerrar-consultar-proveedores', (event, user) => {
    if (ProvWindow) {
        ProvWindow.close();
    }
    createWindowCoordi(user);
});


ipcMain.on('form-prov', (e) => {
    ProvWindow.close();
    EmergenteAgregarProveedor();
})

ipcMain.on('form-servicios', async (e, ID_Proveedor) => {
    EmergenteServiciosProveedor(ID_Proveedor);
    await ProvWindow.close();
})

ipcMain.on('form-actualizar-servicios', async (e, ID_Proveedor) => {
    try {
        const ID_servicios = await database.getIDServicioProveedor(ID_Proveedor);

        if (ID_servicios.length > 0) {
            const ids = ID_servicios.map(servicio => servicio.ID_Servicio);

            const [servicios, disponibilidad, precios] = await Promise.all([
                database.getNombreServicio(ids),
                database.getDisponibilidadServicio(ids, ID_Proveedor),
                database.getPrecioServicioProveedor(ID_Proveedor, ids)
            ]);

            // Combina la información
            const serviciosCombinados = servicios.map((servicio, index) => ({
                nombre: servicio.Servicio,
                disponibilidad: disponibilidad[index].Disponibilidad,
                precio: precios[index].Precio
            }));
            ProvWindow.close();
            EmergenteModificarServiciosProveedor(serviciosCombinados, ID_Proveedor);
        }
        else {
            const provData = await database.getProveedores();
            createProvUser(provData, userLogged)
            await ProvWindow.close();
        }
    } catch (error) {
        console.error("Error al obtener servicios: ", error);
    }
})

ipcMain.on('form-actualizar-proveedor', async (e, prov) => {
    EmergenteModificarProveedor(prov);
    await ProvWindow.close();
})


// ---FUNCIONES PARA AGREGAR EL PROVEEDOR---
ipcMain.on('agregar-proveedor', async (e, newProv) => {
    try {
        console.log(newProv);
        await database.agregarProveedores(newProv);
        const provData = await database.getProveedores();
        ProvemergenteWindow.close();
        createProvUser(provData, userLogged);
    } catch (error) {
        console.log(error);
        EmergenteErrorDuplicado2();
    }
})

// ---FUNCIONES PARA SERVICIOS AL PROVEEDOR---

ipcMain.on('servicios-dProveedor', async (e, Servicio_Proveedor) => {
    const { servicios, precio, disponibilidad } = Servicio_Proveedor;
    const ID_Proveedor = Servicio_Proveedor.id_proveedor;
    try {
        if (servicios.includes("Alojamiento")) {
            const id_servicio = await database.getIDServicio("Alojamiento")
            const servicio = id_servicio[0]?.ID_Servicio;
            await database.agregarServicioProveedor(servicio, ID_Proveedor, precio["Alojamiento"], disponibilidad["Alojamiento"]);
        }
        if (servicios.includes("Transporte")) {
            const id_servicio = await database.getIDServicio("Transporte")
            const servicio = id_servicio[0]?.ID_Servicio;
            await database.agregarServicioProveedor(servicio, ID_Proveedor, precio["Transporte"], disponibilidad["Transporte"]);
        }
        if (servicios.includes("Turismo")) {
            const id_servicio = await database.getIDServicio("Turismo")
            const servicio = id_servicio[0]?.ID_Servicio;
            await database.agregarServicioProveedor(servicio, ID_Proveedor, precio["Turismo"], disponibilidad["Turismo"]);
        }
        const provData = await database.getProveedores();
        ProvemergenteWindow.close();
        createProvUser(provData, userLogged);
    } catch (error) {
        console.log(error);
        const provData = await database.getProveedores();
        EmergenteErrorServicio(provData);
        await ProvemergenteWindow.close();

    }
})

// FUNCION DE VENTANAS (CERRADO)
ipcMain.on('cerrar-error2', async (e) => {
    try {
        const provData = await database.getProveedores();
        createProvUser(provData, userLogged);
        if (errorDuplicadoWindow2) { await errorDuplicadoWindow2.close(); }
        await ProvemergenteWindow.close();
    } catch (error) {
        console.log(error);
    }
})

ipcMain.on('cerrar-ventana-confirmacionp', async (e) => {
    if (ProvWindow) {
        await ProvWindow.close();
    }
    const provData = await database.getProveedores();
    createProvUser(provData, userLogged);
    await emergenteWindow.close();
});

// FUNCION PARA MODIFICAR PROVEEDOR

ipcMain.on('proveedor-modificado', async (e, newProv, prov) => {

    try {
        await database.modificarProveedores(newProv, prov);
        const provData = await database.getProveedores();
        ProvemergenteWindow.close();
        createProvUser(provData, userLogged);
    } catch (error) {
        console.log(error);
        ProvemergenteWindow.close();
        EmergenteErrorDuplicado2();
    }
})
//-------------------------------------------------------------------------

ipcMain.on('actualizar-servicio-proveedor', async (e, serviciosActualizados, ID_Proveedor) => {
    try {
        for (const servicio of serviciosActualizados) {
            const { disponibilidad, precio, nombre } = servicio;

            const id_servicio = await database.getIDServicio(nombre);
            const servicioId = id_servicio[0]?.ID_Servicio;

            if (servicioId) {
                await database.modificarServicioProveedor(servicioId, ID_Proveedor, precio, disponibilidad);
            }
        }
    } catch (error) {
        console.error(error);
    }
});

// FUNCIONES PARA ELIMINAR AL PROVEEDOR
ipcMain.on('confirmar-eliminar-proveedor', async (e, proveedor) => {
    try {
        await database.eliminarProveedores(proveedor);
        EmergenteProv();
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
    }
});

// OBTENER NOMBRES DE LOS SERVICIOS DEL PROVEEDOR
ipcMain.handle('obtener-datos-servicio', async (e, ID_Proveedor) => {
    try {
        const servicios = await database.getIDServicioProveedor(ID_Proveedor);
        const idsServicios = servicios.map(servicio => servicio.ID_Servicio);
        let nombresServicios = [];
        let disponibilidadServicios = [];
        let preciosServicios = [];

        if (idsServicios.length > 0) {
            nombresServicios = await database.getNombreServicio(idsServicios);
            disponibilidadServicios = await database.getDisponibilidadServicio(idsServicios, ID_Proveedor);
            preciosServicios = await database.getPrecioServicioProveedor(ID_Proveedor, idsServicios);
        }
        return {
            nombres: nombresServicios.map(servicio => servicio.Servicio),
            disponibilidad: disponibilidadServicios.map(disponibilidad => disponibilidad.Disponibilidad),
            precios: preciosServicios.map(precio => precio.Precio)
        }
    } catch (error) {
        console.log(error);
    }
})