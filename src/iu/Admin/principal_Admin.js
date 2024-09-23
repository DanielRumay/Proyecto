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

let userM =[];

ipcRenderer.on('datos-usuarios', (event, usuarios, user) => {
    userM = usuarios;
    const tablaBody = document.querySelector('#usuariosBody');
    tablaBody.innerHTML = '';

    ///CARGAR USUARIOS
    const mostrarUsuarios = (usuariosParaMostrar) => {
        const tablaBody = document.querySelector('#usuariosBody');
        console.log('usuarios');
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
                ipcRenderer.send('eliminar-usuario', nombreUsuario, user);
            });
        });
    };

    mostrarUsuarios(userM);

    ipcRenderer.on('usuario-eliminado', (event, nombreUsuario) => {
        userM = userM.filter(u => u.NombreUsu !== nombreUsuario);
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
    })

    //SALIR DE LA INTERFAZ
    const btn2 = document.querySelectorAll('#Salir');
    btn2.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('close_funcion', user);
        })
    });

});
mostrarUsuarios(userM);

const btnco = document.querySelectorAll('#confirmarEliminar');
btnco.forEach(btn => {
    btn.addEventListener('click', e => {
        ipcRenderer.send('confirmar-usuario');
    })
});
const btnca = document.querySelectorAll('#cancelarEliminar');
btnca.forEach(btn => {
    btn.addEventListener('click', e => {
        ipcRenderer.send('confirmar-usuario');
    })
});




