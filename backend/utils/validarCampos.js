const validarCampos = (campos) => {
    return Object.values(campos).every(campo => campo);
};

module.exports = { validarCampos };