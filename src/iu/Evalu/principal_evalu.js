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
    const btnConsultarProtoEvalu = document.querySelector('#btnConsultarProtoEvalu');
    btnConsultarProtoEvalu.addEventListener('click', e =>{
        ipcRenderer.send('open-consultar-prototiposEvalu', userData);
    })
});

let prototipo = [];

ipcRenderer.on('gestion-prototipos', (event,prototipos,user)=>{
    prototipo = prototipos;
    const tablaBody = document.querySelector('#PrototiposBody');
    tablaBody.innerHTML = '';

    const agruparPrototipos = (prototipos) => {
        const agrupados = {};
        
        prototipos.forEach(prototipo => {
            if (!agrupados[prototipo.ID_Prototipo]) {
                agrupados[prototipo.ID_Prototipo] = {
                    ...prototipo,
                    Destinos: new Set(),
                    Proveedores: new Set(),
                    Servicios: new Set(),
                };
            }
            
            agrupados[prototipo.ID_Prototipo].Destinos.add(prototipo.Nombre_Destino || 'No disponible');
            agrupados[prototipo.ID_Prototipo].Proveedores.add(prototipo.Proveedores || 'No disponible');
            agrupados[prototipo.ID_Prototipo].Servicios.add(prototipo.Servicios || 'No disponible');
        });
        
        return Object.values(agrupados).map(prot => ({
            ...prot,
            Destinos: Array.from(prot.Destinos).join(', '),
            Proveedores: Array.from(prot.Proveedores).join(', '),
            Servicios: Array.from(prot.Servicios).join(', '),
        }));
    };


    const mostrarPrototipos = (prototiposParaMostrar) => {
        console.log(prototiposParaMostrar);
        tablaBody.innerHTML = '';
    
        prototiposParaMostrar.forEach(prototipo => {
            console.log(prototipo); // Muestra cada prototipo en la consola
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${prototipo.ID_Prototipo}</td>
                <td>${prototipo.Nombre_Prototipo}</td>
                <td>${prototipo.Destinos || 'No disponible'}</td>
                <td>${prototipo.Proveedores || 'No disponible'}</td>
                <td>${prototipo.Servicios || 'No disponible'}</td>
                <td class="btn-container">
                    <button type="button" id="btn-aceptar" class="btn-aceptar" data-prototipo="${prototipo.Nombre}">Aceptar</button>
                </td>
                <td class="btn-container">
                    <button type="button" id="btn-modificar" class="btn-modificar" data-prototipo="${prototipo.ID_Proveedor}">Modificar</button>
                </td>
                <td class="btn-container">
                    <button type="button" id="btn-eliminar-proto" class="btn-eliminar-proto" data-prototipo="${prototipo.Nombre}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    };
    const prototiposAgrupados = agruparPrototipos(prototipo);
    mostrarPrototipos(prototiposAgrupados);
});

/*const btns = document.querySelectorAll('#volver');
btns.forEach(btn => {
    btn.addEventListener('click', e => {
        ipcRenderer.send('cerrar-error4');
    })
});*/

const btv = document.querySelectorAll('#volverEvaluador');
btv.forEach(btn =>{
    btn.addEventListener('click', e =>{
        ipcRenderer.send('cerrar-ventana-evaluador');
    })
})