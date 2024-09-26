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
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${usuario.NombreUsu}</td>
                <td>${usuario.Nombre}</td>
                <td>${usuario.Apellido}</td>
                <td>${usuario.Puesto}</td>
                <td>******</td>
                <td>${usuario.ContraseñaTemp}</td>
                <td class="btn-container">
                <button type="button" class="btn-eliminar" data-username="${usuario.NombreUsu}">Eliminar</button>
            </td>
            <td class="btn-container">
                <button type="button" class="btn-modificar" data-username="${usuario.NombreUsu}">Modificar</button>
            </td>
            `;
            tablaBody.appendChild(fila);
        });
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(btn => {
            btn.addEventListener('click', e => {
                const nombreUsuario = btn.getAttribute('data-username');
                ipcRenderer.send('confirmar-eliminar-usuario', nombreUsuario);
            });
        });
        const botonesModificar = document.querySelectorAll('.btn-modificar');
        botonesModificar.forEach(btn => {
            btn.addEventListener('click', e => {
                 const nombreUsuario = btn.getAttribute('data-username');
                 const usuarioModificar = usuariosParaMostrar.find(usuario => usuario.NombreUsu === nombreUsuario);
                
                   if (usuarioModificar) {
                //  // Enviar los datos del usuario a modificar para abrir el formulario
                    ipcRenderer.send('modificar-usuario', usuarioModificar);
                  }
            });
        });
    };
    mostrarUsuarios(userM);
    // Buscar usuarios
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

    ipcRenderer.on('actualizar-user', (event, nombreUsuario) => {
        userM = userM.filter(u => u.NombreUsu !== nombreUsuario);
        mostrarUsuarios(userM);
    });
});



ipcRenderer.on('guardar-usuario', async (event, esModificacion, usuarioOriginal) => {
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

        if (esModificacion) {
            // Actualiza el usuario en la base de datos
            ipcRenderer.send('actualizar-usuario', { nuevo: newUser, original: usuarioOriginal });
        } else {
            // Agrega un nuevo usuario
            ipcRenderer.send('agregar-usuario', newUser);
        }
    });
});


ipcRenderer.on('cargar-datos-usuario', (event, usuario) => {

    document.querySelector('#username').value = usuario.NombreUsu;
    document.querySelector('#name').value = usuario.Nombre;
    document.querySelector('#lastname').value = usuario.Apellido;
    document.querySelector('#password').value = usuario.Contraseña;
    document.querySelector('#puesto').value = usuario.Puesto;
    document.querySelector('#tempPassword').value = usuario.ContraseñaTemp;

});

ipcRenderer.on('solicitar-confirmacion', (e) => {
    const btnco = document.querySelectorAll('#confirmar');
    btnco.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('cerrar-ventana-confirmacion');
        })
    });
});