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
            const itemLista = document.createElement('li');
            itemLista.innerHTML = `
                <a class="dropdown-item" href="#">${prototipo.Nombre}</a>
            `;
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
});