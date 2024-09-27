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

let proveeM = [];

ipcRenderer.on('gestion-proveedor', (event, proveedores, user) => {
    proveeM = proveedores;
    const tablaBody = document.querySelector('#ProveedoresBody');
    tablaBody.innerHTML = '';

    const mostrarProveedores = (proveedoresParaMostrar) => {
        const tablaBody = document.querySelector('#ProveedoresBody');
        tablaBody.innerHTML = '';
        proveedoresParaMostrar.forEach(proveedor => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${proveedor.ID_Proveedor}</td>
                <td>${proveedor.Nombre}</td>
                <td>${proveedor.Contacto}</td>
                <td class="text-center">${proveedor.Disponibilidad}</td> <!-- Clase añadida -->
                <td class="btn-container">
                    <button type="button" id="btn-modificar" class="btn-modificar" data-proveedor="${proveedor.Nombre}">Modificar</button>
                </td>
                <td class="btn-container">
                    <button type="button" id="btn-verServicios" class="btn-verServicios" data-proveedor="${proveedor.Nombre}">Ver Servicios</button>
                </td>
                <td class="btn-container">
                    <button type="button" id="btn-eliminar-proveedor" class="btn-eliminar-proveedor" data-proveedor="${proveedor.Nombre}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });

        const botonesModificarProveedor = document.querySelectorAll('.btn-modificar');
        botonesModificarProveedor.forEach(btn => {
            btn.addEventListener('click', e => {
                const nombreProveedor = btn.getAttribute('data-proveedor');

                ipcRenderer.send('form-actualizar-proveedor', nombreProveedor);
                console.log(nombreProveedor);
            });
        });
              // ---ELIMINAR PROVEEDOR---
            const botonesEliminar = document.querySelectorAll('.btn-eliminar-proveedor');
            botonesEliminar.forEach(btn => {
              btn.addEventListener('click', e => {
                    const Nombre = btn.getAttribute('data-proveedor');
                  ipcRenderer.send('e-proveedor');
                  ipcRenderer.send('confirmar-eliminar-proveedor', Nombre);
              });
            });

    };
    mostrarProveedores(proveeM);
    // ---BUSCAR PROVEEDORES---
const btnBuscarp = document.querySelector('#Buscarp');
btnBuscarp.addEventListener('click', () => {
    const provInput = document.querySelector('#f-proveedor').value; // Obtener el valor del campo de búsqueda de proveedor
    const dispoInput = document.querySelector('#f-disponibilidad').value; // Obtener el valor del filtro de disponibilidad
    
    const filtropro = proveedores.filter(proveedor => {
        const provMatches = provInput === '' || proveedor.Nombre === provInput; // Verifica si el nombre coincide
        const dispoMatches = dispoInput === 'Todos' || 
                             (dispoInput === 'Sí' && proveedor.Disponibilidad === 'Sí') || 
                             (dispoInput === 'No' && proveedor.Disponibilidad === 'No'); // Verifica la disponibilidad

        return provMatches && dispoMatches; // Retorna verdadero si ambos coinciden
    });

    mostrarProveedores(filtropro); // Muestra los proveedores filtrados
});

    // Salir de la interfaz
    const btn2 = document.querySelectorAll('#Salir');
    btn2.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('close_funcion', user);
        });
    });

    // Abrir el formulario de registro de proveedor
    const btnag = document.querySelectorAll('#btnAgregar');
    btnag.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('form-prov');
        });
    });

});

const btnes = document.querySelectorAll('#volver');
btnes.forEach(btn => {
    btn.addEventListener('click', e => {
        ipcRenderer.send('cerrar-error2');
    })
});

ipcRenderer.on('guardar-proveedor', async (event) => {

    const form = document.getElementById('provForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const newProv = {
            Nombre: document.querySelector('#namep').value,
            Contacto: document.querySelector('#contacto').value,
            Disponibilidad: document.querySelector('#disponibilidad').value,
        };
        ipcRenderer.send('agregar-proveedor', newProv);
    })
});

ipcRenderer.on('solicitar-confirmacionp', (e) => {
    const btnco = document.querySelectorAll('#confirmar');
    btnco.forEach(btn => {
        btn.addEventListener('click', e => {
            ipcRenderer.send('cerrar-ventana-confirmacionp');
        })
    });
});

const btns = document.querySelectorAll('#volver');
btns.forEach(btn => {
    btn.addEventListener('click', e => {
        ipcRenderer.send('cerrar-error2');
    })
});