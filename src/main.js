const { app, BrowserWindow, ipcMain } = require('electron');
const database = require('./database.js');
const url = require('url');
const path = require('path');
const { create } = require('domain');

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

let mainWindow, emergenteWindow, newProductWindow, AdmUserWindow, errorDuplicadoWindow 
let userLogged = null;

app.on('ready', () => {
    createMainWindow();
})

//----------------------VENTANAS ----------------------
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

function EmergenteModificarUsuario(usuario){
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


function EmergenteErrorDuplicado(){
    errorDuplicadoWindow  = new BrowserWindow({
        width: 1050,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    errorDuplicadoWindow .loadURL(url.format({
        pathname: path.join(__dirname, 'iu/Admin/errorDuplicado.html'),
        protocol: 'file',
        slashes: true,
    }))

    errorDuplicadoWindow .setMenuBarVisibility(false);

    errorDuplicadoWindow .on('closed', () => {
        emergenteWindow = null;
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
})

ipcMain.on('form-user',(e, )=>{
    AdmUserWindow.close();
    EmergenteAgregarUsuario();
})

ipcMain.on('close_error', (e)  => {
    emergenteWindow.close();
    createMainWindow();
});

ipcMain.on('close_confirmacion', (e)  => {
    emergenteWindow.close();
    createMainWindow();
});

ipcMain.on('close_funcion', (e, userData)  => {
    AdmUserWindow.close();
    createWindowAdmin(userData);
});

ipcMain.on('cerrar-error',async (e)=>{
    try{
        const userData = await database.getUsuarios();
        createAdmUser(userData, userLogged);
        if(errorDuplicadoWindow){ await errorDuplicadoWindow.close(); }
        await emergenteWindow.close();
    }catch(error){
        console.log(error);
    }
})

ipcMain.on('form-actualizar-user', async (e, usuario) =>{
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
ipcMain.on('confirmar-eliminar-usuario', async (e, usuario)  => {
    try {
        await database.eliminarUsuario(usuario);
        //e.sender.send('actualizar-user-eliminado', usuario);
        EmergenteUser();
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
    }
});

ipcMain.on('cerrar-ventana-confirmacion', async(e)  => {
    
    if(AdmUserWindow){
        await AdmUserWindow.close();
    }
    const userData = await database.getUsuarios();
    createAdmUser(userData, userLogged);
    await emergenteWindow.close();
});



// ---FUNCIONES PARA AGREGAR EL USUARIO---
ipcMain.on('agregar-usuario', async(e,newUser)=>{
    try{
        await database.agregarUsuario(newUser);
        const userData = await database.getUsuarios();
        emergenteWindow.close();
        createAdmUser(userData, userLogged);
    }catch(error){
        EmergenteErrorDuplicado();
    }
})

// ---FUNCION PARA MODIFICAR USUARIO---

ipcMain.on('usuario-modificado', async (e, newUser,userActual)=>{
    const userData = await database.getUsuarios();
    try{
        await database.modificarUsuario(newUser, userActual);
        const userData = await database.getUsuarios();
        emergenteWindow.close();
        createAdmUser(userData, userLogged);
    }catch(error){
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