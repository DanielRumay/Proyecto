const { ipcRenderer } = require('electron');
const form = document.querySelector('form');
form.addEventListener('submit', e => {

    const userEmpl = document.querySelector('#usuario').value;
    const passwordEmpl = document.querySelector('#contraseña').value;

    const confirmUser = {
        user: userEmpl,
        password: passwordEmpl,
    };

    ipcRenderer.send('check-credentials', confirmUser);

    e.preventDefault();

});
const btns = document.querySelectorAll('#volver');
btns.forEach(btn => {
    btn.addEventListener('click', e => {
        ipcRenderer.send('close_error');
    })
});
const btn = document.querySelectorAll('#salir');
btn.forEach(btn => {
    btn.addEventListener('click', e => {
        ipcRenderer.send('close_confirmacion');
    })
});