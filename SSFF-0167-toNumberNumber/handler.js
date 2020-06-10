exports.handler = async (event) => {
  let numero = ''
  let texto = event.numero;
  let valido;
  texto = texto.toUpperCase();
  var arr = texto.split(" ");

  arr.forEach(i => numero = numero + (textos(limpiarTexto(i))))

  const response = {
    statusCode: 200,
    body: {
      "valido": valido,
      "texto": numero
    },
  };
  return response;
};

function textos(texto) {

  texto === 'CIEN' ? texto = '1' : null;
  texto === 'CIENTO' ? texto = '1' : null;
  texto === 'DOSCIENTOS' ? texto = '2' : null;
  texto === 'TRECIENTOS' ? texto = '3' : null;
  texto === 'CUATROCIENTOS' ? texto = '4' : null;
  texto === 'QUINIENTOS' ? texto = '5' : null;
  texto === 'SEISCIENTOS' ? texto = '6' : null;
  texto === 'SETECIENTOS' ? texto = '7' : null;
  texto === 'OCHOCIENTOS' ? texto = '8' : null;
  texto === 'UN' ? texto = '1' : null;
  texto === 'UNO' ? texto = '1' : null;
  texto === 'DOS' ? texto = '2' : null;
  texto === 'DO' ? texto = '2' : null;
  texto === 'TRES' ? texto = '3' : null;
  texto === 'TRE' ? texto = '3' : null;
  texto === 'CUATRO' ? texto = '4' : null;
  texto === 'CINCO' ? texto = '5' : null;
  texto === 'SEIS' ? texto = '6' : null;
  texto === 'SEI' ? texto = '6' : null;
  texto === 'SIETE' ? texto = '7' : null;
  texto === 'OCHO' ? texto = '8' : null;
  texto === 'NUEVE' ? texto = '9' : null;
  texto === 'NUE' ? texto = '9' : null;
  texto === 'CERO' ? texto = '0' : null;
  texto === 'DIEZ' ? texto = '10' : null;
  texto === 'ONCE' ? texto = '11' : null;
  texto === 'DOCE' ? texto = '12' : null;
  texto === 'TRECE' ? texto = '13' : null;
  texto === 'CATORCE' ? texto = '14' : null;
  texto === 'QUINCE' ? texto = '15' : null;
  texto === 'VEINTE' ? texto = '2' : null;
  texto === 'TREINTA' ? texto = '3' : null;
  texto === 'CUARENTA' ? texto = '4' : null;
  texto === 'CINCUENTA' ? texto = '5' : null;
  texto === 'SESENTA' ? texto = '6' : null;
  texto === 'SETENTA' ? texto = '7' : null;
  texto === 'OCHENTA' ? texto = '8' : null;
  texto === 'NOVENTA' ? texto = '9' : null;
  texto === 'CIEN' ? texto = '1' : null;
  texto === 'DOSCIENTOS' ? texto = '2' : null;
  texto === 'TRECIENTOS' ? texto = '3' : null;
  texto === 'CUATROCIENTOS' ? texto = '4' : null;
  texto === 'QUINIENTOS' ? texto = '5' : null;
  texto === 'SEISCIENTOS' ? texto = '6' : null;
  texto === 'SETECIENTOS' ? texto = '7' : null;
  texto === 'OCHOCIENTOS' ? texto = '8' : null;

  return texto;
}

function limpiarTexto(texto) {

  texto = reemplazarMillones(texto);
  texto = reemplazarMillon(texto);
  texto = reemplazarMil(texto);
  texto = reemplazarY(texto);
  texto = reemplazarGuion(texto);
  texto = reemplazarVio(texto);
  texto = reemplazarPuntos(texto);
  texto = reemplazarComas(texto);
  texto = reemplazarEspacioDoble(texto);

  return texto
}

function reemplazarPuntos(texto) {
  return texto.split('.').join('')
}

function reemplazarComas(texto) {
  return texto.split(',').join('')
}

function reemplazarY(texto) {
  return texto.split('Y').join('')
}

function reemplazarVio(texto) {
  return texto.split('VIO').join('')
}

function reemplazarGuion(texto) {
  return texto.split('GUION').join('')
}

function reemplazarEspacioDoble(texto) {
  return texto.split('  ').join('')
}

function reemplazarMil(texto) {
  return texto.split('MIL').join('')
}

function reemplazarMillon(texto) {
  return texto.split('MILLON').join('')
}

function reemplazarMillones(texto) {
  return texto.split('MILLONES').join('')
}

