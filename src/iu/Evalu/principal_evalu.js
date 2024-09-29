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
    const btn1 = document.querySelectorAll('#btnConsultaPrototipo');
    btn1.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('openPro', userData);
        })
    });
});

let userM = [];

ipcRenderer.on('datos-Prototipo', (e, userData, user) => {
    userM = userData;
    const cargo = document.querySelector('#Cargo');
    cargo.textContent = user.Puesto;

    const mostrarPrototipo = (prototipos) => {
        const listaPrototipo = document.querySelector('#prototipo');
        listaPrototipo.innerHTML = '';

        prototipos.forEach(prototipo => {
            console.log("Agregando prototipo:", prototipo);
            const itemLista = document.createElement('option');
            itemLista.value = prototipo.ID_Prototipo;
            itemLista.textContent = prototipo.Nombre;
            listaPrototipo.appendChild(itemLista);
        });
    };

    mostrarPrototipo(userM);

    const btnVolver = document.querySelectorAll('#VOLVER');
    btnVolver.forEach(btn => {
        btn.addEventListener('click', () => {
            ipcRenderer.send('close_Prototipe', user);
        });
    });
    const btnRegistrar = document.querySelector('#REGISTRAR');
    btnRegistrar.addEventListener('click', () => {
        const descripcion = document.querySelector('#descripcion');
        const prototipoId = document.querySelector('#prototipo');

        const nuevoPaquete = {
            ID_Prototipo: prototipoId.value,
            Descripcion: descripcion.value
        };

        ipcRenderer.send('confirmar-agregar-paquete-final', nuevoPaquete, user);
    });
});

ipcRenderer.on('confirmacion-PF', (e,nuevoPaquete, user) => {
    const btnSI = document.querySelectorAll('#confirmar');
    btnSI.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('creacion-PF',nuevoPaquete, user);
        })
    });
    const btnNO = document.querySelectorAll('#cancelar');
    btnNO.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('cerrar-confirmacion-PF');
        })
    });
});