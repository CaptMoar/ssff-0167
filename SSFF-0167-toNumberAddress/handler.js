exports.handler = async (event) => {
  let telefono = '';
  let texto = event.direccion;
  let countAr = true;
  texto = texto.toUpperCase();
  texto = separadorDecenas(texto);
  texto = limpiarTexto(texto);
  texto = decena(texto);
  var arr = texto.split(' ')
  arr.forEach(element => {
    let numero = diccionario(element)
    if (!isNaN(numero)) {
      if (countAr) {
        telefono = telefono + " " + numero
        countAr = false
      } else {
        telefono = telefono + numero
      }
    } else {
      telefono = telefono + " " + numero
    }
  });
  const response = {
    statusCode: 200,
    body: {
      "direccion": event.texto,
      "texto": telefono
    },
  };
  return response;
};

function limpiarTexto(texto) {
  texto = texto.trimLeft().trimRight()
  texto = texto.split('.').join('')
  texto = texto.split(',').join('')

  return texto
}

function diccionario(texto) {
  var response = texto
  texto === 'VEINTEY' ? response = '2' : null;
  texto === 'VEINTE' ? response = '20' : null;
  texto === 'UNO' ? response = '1' : null;
  texto === 'DOS' ? response = '2' : null;
  texto === 'DO' ? response = '2' : null;
  texto === 'TRES' ? response = '3' : null;
  texto === 'TRE' ? response = '3' : null;
  texto === 'CUATRO' ? response = '4' : null;
  texto === 'CINCO' ? response = '5' : null;
  texto === 'SEIS' ? response = '6' : null;
  texto === 'SEI' ? response = '6' : null;
  texto === 'SIETE' ? response = '7' : null;
  texto === 'OCHO' ? response = '8' : null;
  texto === 'NUEVE' ? response = '9' : null;
  texto === 'NUE' ? response = '9' : null;
  texto === 'DIEZY' ? response = '10' : null;
  texto === 'DIECI' ? response = '1' : null;
  texto === 'DIEZ' ? response = '10' : null;
  texto === 'DIE' ? response = '10' : null;
  texto === 'ONCE' ? response = '11' : null;
  texto === 'DOCE' ? response = '12' : null;
  texto === 'TRECE' ? response = '13' : null;
  texto === 'CATORCE' ? response = '14' : null;
  texto === 'QUINCE' ? response = '15' : null;
  texto === 'TREINTAY' ? response = '3' : null;
  texto === 'TREINTA' ? response = '30' : null;
  texto === 'CUARENTAY' ? response = '4' : null;
  texto === 'CUARENTA' ? response = '40' : null;
  texto === 'CINCUENTAY' ? response = '5' : null;
  texto === 'CINCUENTA' ? response = '50' : null;
  texto === 'SESENTAY' ? response = '6' : null;
  texto === 'SESENTA' ? response = '60' : null;
  texto === 'SETENTAY' ? response = '7' : null;
  texto === 'SETENTA' ? response = '70' : null;
  texto === 'OCHENTAY' ? response = '8' : null;
  texto === 'OCHENTA' ? response = '80' : null;
  texto === 'NOVENTAY' ? response = '9' : null;
  texto === 'NOVENTA' ? response = '90' : null;
  return response;
}

function decena(texto) {
  return texto.split(' Y').join('Y')
}

function separadorDecenas(texto) {
  texto = texto.split('DIECI').join('DIECI ')
  texto = texto.split('VEINTI').join('VEINTI ')
  texto = texto.split('TREINTAI').join('TREINTAI ')
  texto = texto.split('CUARENTAI').join('CUARENTAI ')
  texto = texto.split('CINCUENTAI').join('CINCUENTAI ')
  texto = texto.split('SESENTAI').join('SESENTAI ')
  texto = texto.split('SETENTAI').join('SETENTAI ')
  texto = texto.split('OCHENTAI').join('OCHENTAI ')
  texto = texto.split('NOVENTAI').join('NOVENTAI ')
  return texto
}