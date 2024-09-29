const { app, BrowserWindow, ipcMain } = require('electron');
const database = require('./database.js');
const url = require('url');
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

let mainWindow
let emergenteWindow
let newProductWindow
let AdmUserWindow
let ProvWindow
let PrototipeWindow


app.on('ready', () => {
    createMainWindow();
})

//----------------------FUNCIONES----------------------
function createMainWindow(){
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

function createErrorWindow(){
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

function createConfirmWindow(){
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

function createAdmUser(userData, user){
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

function EmergenteUser(){
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

function EmergenteAgregarUsuario(){
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

function createProvUser(user) {
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
        ProvWindow.webContents.send('gestion-proveedor', user);
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
    }));
    emergenteWindow.setMenuBarVisibility(false);
    emergenteWindow.on('closed', () => {
        emergenteWindow = null;
    });
    emergenteWindow.webContents.on('did-finish-load', () => {
        emergenteWindow.webContents.send('modificar-usuario', usuario);
    });
}

function createProtot(userData, user){
    PrototipeWindow = new BrowserWindow({
        width: 1400,
        height: 1600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    PrototipeWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Evalu/paquetefinal.html'),
        protocol: 'file',
        slashes: true,
    }))
    PrototipeWindow.setMenuBarVisibility(false);
    PrototipeWindow.on('closed', () => {
        AdmUserWindow = null;
    });
    PrototipeWindow.webContents.on('did-finish-load', () => {
        PrototipeWindow.webContents.send('datos-Prototipo', userData, user);
    });
}

//----------------------IPC MAIN----------------------

ipcMain.on('close', (e)  => {
    newProductWindow.close();
    createConfirmWindow();
});
ipcMain.on('cerrarsecion', (e)  => {
    emergenteWindow.close();
    createMainWindow();
});
ipcMain.on('Mensaje',(e)=>{
    console.log('Hola');
});

ipcMain.on('form-user',(e)=>{
    EmergenteAgregarUsuario();
});

ipcMain.on('form-actualizar-user',(e,usuario)=>{
    console.log(usuario);
    EmergenteModificarUsuario(usuario);
})



ipcMain.on('close_error', (e)  => {
    emergenteWindow.close();
    createMainWindow();
});

ipcMain.on('close_confirmacion', (e)  => {
    emergenteWindow.close();
    createMainWindow();
});
ipcMain.on('cerrar-ventana-confirmacion', (e)  => {
    emergenteWindow.close();
});
ipcMain.on('close_funcion', (e, userData)  => {
    AdmUserWindow.close();
    createWindowAdmin(userData);
});
ipcMain.on('close_Prototipe', (e, userData)  => {
    PrototipeWindow.close();
    createWindowEvalu(userData);
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


ipcMain.on('confirmar-eliminar-usuario', async (e, usuario)  => {
    try {
        await database.eliminarUsuario(usuario);
        e.sender.send('actualizar-user', usuario);
        EmergenteUser();
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
    }
});

ipcMain.on('open-consultar-proveedores', (event, user) => {
    if (newProductWindow) {
        newProductWindow.close();
    }
    createProvUser(user);
});

ipcMain.on('cerrar-consultar-proveedores', (event, user) => {
    if (ProvWindow) {
        ProvWindow.close();
    }
    createWindowCoordi(user);
});

ipcMain.on('agregar-usuario', async(e,newUser)=>{
    try{
        await database.agregarUsuario(newUser);
        e.sender.send('actualizar-user',newUser);
        emergenteWindow.close();
    }catch(error){
        console.error("Error al agregar un nuevo usuario: ", error);
    }
});

ipcMain.on('usuario-modificado', async(e,newUser, userActual)=>{
    try{
        await database.modificarUsuario(newUser, userActual);
        emergenteWindow.close();
    }catch(error){
        console.error("Error al agregar un nuevo usuario: ", error);
    }
})

ipcMain.on('openPro', async (e, user) => {
    try {
        const userData = await database.getPrototipo();
        if (newProductWindow) {
            newProductWindow.close();
        }
        createProtot(userData, user);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }
});

ipcMain.on('check-credentials', async (event, confirmUser) => {
    const { user, password } = confirmUser;

    try {
        const userData = await database.checkCredentials(user, password);
        if (userData) {
            const cargo = userData.Puesto;
            if(cargo=="Administrador"){
                if (mainWindow) {
                    mainWindow.close();
                }
                createWindowAdmin(userData);
            }
            if(cargo=="Coordinador"){
                if (mainWindow) {
                    mainWindow.close();
                }
                createWindowCoordi(userData);
            }
            if(cargo=="Evaluador"){
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