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

// ipcRenderer.on('gestion-proveedor', (e, userData) => {
//     const btnVolver = document.querySelector('#btnVolver');
//     btnVolver.addEventListener('click', e => {
//         ipcRenderer.send('cerrar-consultar-proveedores', userData);
//     });
// });

let proveeM = [];

ipcRenderer.on('gestion-proveedor', (event, proveedores, user) => {
    proveeM = proveedores;
    const tablaBody = document.querySelector('#ProveedoresBody');
    tablaBody.innerHTML = '';

    const mostrarProveedores = async (proveedoresParaMostrar) => {
        const tablaBody = document.querySelector('#ProveedoresBody');
        tablaBody.innerHTML = '';
        for (const proveedor of proveedoresParaMostrar) {
            const fila = document.createElement('tr');

            // Llama a 'obtener-datos' y espera la respuesta
            const response = await ipcRenderer.invoke('obtener-datos-servicio', proveedor.ID_Proveedor);

            const datos = response.nombres;
            const disponibilidad = response.disponibilidad.map(d => d === 1 ? 'Disponible' : 'No disponible');
            const precios = response.precios;
            fila.innerHTML = `
                <td>${proveedor.ID_Proveedor}</td>
                <td>${proveedor.Nombre}</td>
                <td>${proveedor.Contacto}</td>
                <td>${datos.length > 0 ? datos.join(', ') : 'Sin Servicios'}</td> <!-- Cambia aquí -->
                <td>${disponibilidad.length > 0 ? disponibilidad.join(', ') : 'No disponible'}
                <td>${precios.length > 0 ? precios.join('<br>') : 'Sin Precio'}</td> 
                <td class="btn-container">
                    <button type="button" id="btn-modificar" class="btn-modificar" data-proveedor="${proveedor.Nombre}">Modificar</button>
                </td>
                <td class="btn-container">
                    <button type="button" id="btn-agregarServicio" class="btn-agregarServicio" data-proveedor="${proveedor.ID_Proveedor}">Agregar Servicio</button>
                    <br><br>
                    <button type="button" id="btn-verServicios" class="btn-verServicios" data-proveedor="${proveedor.ID_Proveedor}">Modificar Servicio</button>
                    </td>
                <td class="btn-container">
                    <button type="button" id="btn-eliminar-proveedor" class="btn-eliminar-proveedor" data-proveedor="${proveedor.Nombre}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        }

        const botonesModificarProveedor = document.querySelectorAll('.btn-modificar');
        botonesModificarProveedor.forEach(btn => {
            btn.addEventListener('click', e => {
                const nombreProveedor = btn.getAttribute('data-proveedor');
                ipcRenderer.send('form-actualizar-proveedor', nombreProveedor);
            });
        });
        // ---ELIMINAR PROVEEDOR---
        const botonesEliminar = document.querySelectorAll('.btn-eliminar-proveedor');
        botonesEliminar.forEach(btn => {
            btn.addEventListener('click', e => {
                const Nombre = btn.getAttribute('data-proveedor');
                ipcRenderer.send('confirmar-eliminar-proveedor', Nombre);
            });
        });
        // AGREGAR SERVICIO
        const botonesServicio = document.querySelectorAll('.btn-agregarServicio');
        botonesServicio.forEach(btn => {
            btn.addEventListener('click', e => {
                const ID_Proveedor = btn.getAttribute('data-proveedor');
                ipcRenderer.send('form-servicios', ID_Proveedor);
            })
        })
        // MODIFICAR SERVICIO
        const botonModificarServicio = document.querySelectorAll('.btn-verServicios');
        botonModificarServicio.forEach(btn => {
            btn.addEventListener('click', e => {
                const ID_Proveedor = btn.getAttribute('data-proveedor');
                ipcRenderer.send('form-actualizar-servicios', ID_Proveedor);
            })
        })

    };
    mostrarProveedores(proveeM);
    // ---BUSCAR PROVEEDORES---
    const btnBuscarp = document.querySelector('#Buscarp');
    btnBuscarp.addEventListener('click', () => {
        const provInput = document.querySelector('#f-proveedor').value; // Obtener el valor del campo de búsqueda de proveedor

        const filtropro = proveedores.filter(proveedor => {
            const provMatches = provInput === '' || proveedor.Nombre === provInput; // Verifica si el nombre coincide
            return provMatches
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

ipcRenderer.on('guardar-proveedor', async (event) => {

    const form = document.getElementById('provForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const newProv = {
            Nombre: document.querySelector('#namep').value,
            Contacto: document.querySelector('#contacto').value,
        };
        ipcRenderer.send('agregar-proveedor', newProv);
    })
});
ipcRenderer.on('modificar-proveedor', async (e, prov) => {
    const form = document.getElementById('provForm');
    document.querySelector('#namep').value = prov;

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const newProv = {
            Nombre: document.querySelector('#namep').value,
            Contacto: document.querySelector('#contacto').value,
            Disponibilidad: document.querySelector('#disponibilidad').value,
        };
        console.log(prov);
        console.log(newProv);
        ipcRenderer.send('proveedor-modificado', newProv, prov);
    })
});

ipcRenderer.on('servicios-proveedor', async (e, ID_Proveedor) => {
    const form = document.getElementById('serviciosForm');
    form.addEventListener('submit', function (event) {
        const servicios = [];
        const precios = [];
        const disponibilidades = [];
        if (document.getElementById('alojamiento').checked) {
            servicios.push('Alojamiento');
            precios['Alojamiento'] = parseFloat(document.getElementById('precio-alojamiento').value);
            disponibilidades['Alojamiento'] = document.getElementById('disponibilidad-alojamiento').value === '1' ? 1 : 0;
        }
        if (document.getElementById('transporte').checked) {
            servicios.push('Transporte');
            precios['Transporte'] = parseFloat(document.getElementById('precio-transporte').value);
            disponibilidades['Transporte'] = document.getElementById('disponibilidad-transporte').value === '1' ? 1 : 0;
        }

        if (document.getElementById('turismo').checked) {
            servicios.push('Turismo');
            precios['Turismo'] = parseFloat(document.getElementById('precio-turismo').value);
            disponibilidades['Turismo'] = document.getElementById('disponibilidad-turismo').value === '1' ? 1 : 0;
        }

        event.preventDefault();
        const Servicio_Proveedor = {
            servicios: servicios,
            id_proveedor: ID_Proveedor,
            precio: precios,
            disponibilidad: disponibilidades
        };
        console.log(Servicio_Proveedor);
        ipcRenderer.send('servicios-dProveedor', Servicio_Proveedor);
    });
})

ipcRenderer.on('modificar-servicios-proveedor', (e, serviciosCombinados, ID_Proveedor) => {
    const form = document.getElementById('serviciosForm');

    serviciosCombinados.forEach(servicio => {

        const servicioId = servicio.nombre.toLowerCase();
        console.log(servicioId);
        const checkbox = document.getElementById(servicio.nombre.toLowerCase());
        const precioInput = document.getElementById(`precio-${servicioId}`);
        const disponibilidadSelect = document.getElementById(`disponibilidad-${servicioId}`);

        if (checkbox) {
            checkbox.checked = servicio.disponibilidad === 1;
        }
        if (precioInput) {
            precioInput.value = servicio.precio;
        }
        if (disponibilidadSelect) {
            disponibilidadSelect.value = servicio.disponibilidad === 1 ? '1' : '0';
        }
    });
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const serviciosActualizados = serviciosCombinados.map(servicio => {
            const servicioId = servicio.nombre.toLowerCase();
            return {
                nombre: servicio.nombre,
                precio: parseFloat(document.getElementById(`precio-${servicioId}`).value),
                disponibilidad: document.getElementById(`disponibilidad-${servicioId}`).value
            };
        });
        ipcRenderer.send('actualizar-servicio-proveedor', serviciosActualizados, ID_Proveedor);
    });
})

ipcRenderer.on('solicitar-confirmacionp', (e) => {
    const btnco = document.querySelectorAll('#confirmarP');
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
