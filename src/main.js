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

function createNewProductWindow(userData) {
    newProductWindow = new BrowserWindow({
        width: 1400,
        height: 1600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'iu/principal.html'),
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
    createMainWindow();
});

ipcMain.on('check-credentials', async (event, confirmUser) => {
    const { user, password } = confirmUser;

    try {
        const userData = await database.checkCredentials(user, password);
        if (userData) {
            if (mainWindow) {
                mainWindow.close();
            }
            createNewProductWindow(userData);
        } else {
            console.error('No se encontraron las credenciales:', error.message);
        }
    } catch (error) {
        console.error('Error al verificar las credenciales:', error.message);
    }
});