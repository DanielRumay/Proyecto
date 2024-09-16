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

app.on('ready', () => {
    createMainWindow();
})

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

ipcMain.on('close', (e)  => {
    newProductWindow.close();
    createConfirmWindow();
});
ipcMain.on('close_error', (e)  => {
    emergenteWindow.close();
    createMainWindow();
});
ipcMain.on('close_confirmacion', (e)  => {
    emergenteWindow.close();
    createMainWindow();
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