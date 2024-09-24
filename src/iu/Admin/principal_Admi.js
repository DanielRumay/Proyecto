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
    const btn1 = document.querySelectorAll('#btnConsultarUsuarios');
    btn1.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('openCU', userData);
        })
    });
});

let userM = [];

ipcRenderer.on('datos-usuarios', (event, usuarios, user) => {
    userM = usuarios;
    const tablaBody = document.querySelector('#usuariosBody');
    tablaBody.innerHTML = '';

    const mostrarUsuarios = (usuariosParaMostrar) => {
        const tablaBody = document.querySelector('#usuariosBody');
        tablaBody.innerHTML = '';
        usuariosParaMostrar.forEach(usuario => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${usuario.NombreUsu}</td>
                <td>${usuario.NombreCompleto}</td>
                <td>${usuario.Puesto}</td>
                <td>******</td>
                <td>${usuario.ContraseñaTemp}</td>
                <td class="btn-container">
                    <button type="button" id="btn-eliminar" class="btn-eliminar" data-username="${usuario.NombreUsu}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(btn => {
            btn.addEventListener('click', e => {
                const nombreUsuario = btn.getAttribute('data-username');
                ipcRenderer.send('solicitar-eliminar-usuario', nombreUsuario);
            });
        });
    };

    mostrarUsuarios(userM);

    ipcRenderer.on('usuario-eliminado', (e, nombreUser) => {
        userM = userM.filter(u => u.NombreUsu !== nombreUser);
        mostrarUsuarios(userM);
    });

    ///BUSCAR USUARIOS
    const btnBuscar = document.querySelector('#Buscar');
    btnBuscar.addEventListener('click', () => {
        const userInput = document.querySelector('#f-user').value;
        const puestoInput = document.querySelector('#f-puesto').value;

        const filtro = usuarios.filter(usuario =>
            usuario.NombreUsu === userInput || usuario.Puesto === puestoInput
        );
        mostrarUsuarios(filtro);
    });

    //SALIR DE LA INTERFAZ
    const btn2 = document.querySelectorAll('#Salir');
    btn2.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('close_funcion', user);
        })
    });

});

ipcRenderer.on('solicitar-confirmacion', (e, usuario) => {
    const btnco = document.querySelectorAll('#confirmar');
    btnco.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('confirmar-eliminar-usuario', usuario);
            ipcRenderer.send('cerrar-ventana-confirmacion');
        })
    });
    const btnca = document.querySelectorAll('#cancelar');
    btnca.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('cerrar-ventana-confirmacion');
        })
    });
});