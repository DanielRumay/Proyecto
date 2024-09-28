const { ipcRenderer } = require('electron');


ipcRenderer.on('check-credentials', (e, userData) => {
    const cargoElement = document.querySelector('#cargo');

    cargoElement.textContent = userData.Puesto;
    const btns = document.querySelectorAll('#btnLogin');
    btns.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('close');
        })
    });
    const btn1 = document.querySelectorAll('#btnConsultaUsuarios');
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
            console.log(usuario);
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
                <td class="btn-container">
                    <button type="button" id="btn-modificar" class="btn-modificar" data-username="${usuario.NombreUsu}">Modificar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });

        // ---ELIMINAR USUARIO---
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(btn => {
            btn.addEventListener('click', e => {
                const nombreUsuario = btn.getAttribute('data-username');
                ipcRenderer.send('confirmar-eliminar-usuario', nombreUsuario);
            });
        });

        // ---MODIFICAR USUARIO---

        const botonesModificar = document.querySelectorAll('.btn-modificar');
        botonesModificar.forEach(btn => {
            btn.addEventListener('click', e => {
                const nombreUsuario = btn.getAttribute('data-username');

                ipcRenderer.send('form-actualizar-user', nombreUsuario);
                console.log(nombreUsuario);
            });
        });

    };

    mostrarUsuarios(userM)

    // ---BUSCAR USUARIOS---
    const btnBuscar = document.querySelector('#Buscar');
    btnBuscar.addEventListener('click', () => {
        const userInput = document.querySelector('#f-user').value;
        const puestoInput = document.querySelector('#f-puesto').value;
        const filtro = usuarios.filter(usuario => {
            const userMatches = userInput === '' || usuario.NombreUsu === userInput;
            const puestoMatches = puestoInput === '' || usuario.Puesto === puestoInput;
            return userMatches && puestoMatches;
        });
        mostrarUsuarios(filtro);

    });

    // Salir de la interfaz
    const btn2 = document.querySelectorAll('#Salir');
    btn2.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('close_funcion', user);
        });
    });

    // Abrir el formulario de registro de usuario
    const btnag = document.querySelectorAll('#GuardarU');
    btnag.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('form-user');
        });
    });

});

ipcRenderer.on('guardar-usuario', async (event) => {

    const form = document.getElementById('userForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const newUser = {
            NombreUsu: document.querySelector('#username').value,
            Nombre: document.querySelector('#name').value,
            Apellido: document.querySelector('#lastname').value,
            Contraseña: document.querySelector('#password').value,
            Puesto: document.querySelector('#puesto').value,
            ContraseñaTemp: document.querySelector('#tempPassword').value
        };
        ipcRenderer.send('agregar-usuario', newUser);
    })

});

ipcRenderer.on('modificar-usuario', async (event, userActual) => {
    const form = document.getElementById('userForm');
    document.querySelector('#username').value = userActual;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const newUser = {
            NombreUsu: document.querySelector('#username').value,
            Nombre: document.querySelector('#name').value,
            Apellido: document.querySelector('#lastname').value,
            Contraseña: document.querySelector('#password').value,
            Puesto: document.querySelector('#puesto').value,
            ContraseñaTemp: document.querySelector('#tempPassword').value
        };
        ipcRenderer.send('usuario-modificado', newUser, userActual);
    })

})

ipcRenderer.on('solicitar-confirmacion', (e) => {
    const btnco = document.querySelectorAll('#confirmar');
    btnco.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('cerrar-ventana-confirmacion');
        })
    });
});

const btns = document.querySelectorAll('#volver');
btns.forEach(btn => {
    btn.addEventListener('click', e => {
        ipcRenderer.send('cerrar-error');
    })
});