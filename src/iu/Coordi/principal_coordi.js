const { ipcRenderer } = require('electron');

const products = document.querySelector('#home');

ipcRenderer.on('check-credentials', (e, userData) => {
    const cargoElement = document.querySelector('#cargo');

    cargoElement.textContent = userData.Puesto;
    const btns = document.querySelectorAll('#btnLogin');
    btns.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('close');
        })
    });
    const btnConsultarProveedor = document.querySelector('#btnConsultarProveedor');
    btnConsultarProveedor.addEventListener('click', e => {
        ipcRenderer.send('open-consultar-proveedores', userData);
    });
});

ipcRenderer.on('gestion-proveedor', (e, userData) => {

    const btnVolver = document.querySelector('#btnVolver');
    btnVolver.addEventListener('click', e => {
        ipcRenderer.send('cerrar-consultar-proveedores', userData);
    });

});