let minhaVariavelGlobal = 0;

module.exports = {
  get: () => minhaVariavelGlobal,
  set: (valor) => {
    minhaVariavelGlobal = valor;
  }
};