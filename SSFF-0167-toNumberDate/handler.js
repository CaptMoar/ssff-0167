exports.handler = async (event) => {
  let fecha = ''
  let texto = event.fecha;

  texto = texto.toUpperCase();
  texto = separadorDecenas(texto);
  texto = decena(texto);
  texto = milenio(texto);
  texto = texto.split(', ').join(' , ')

  var arr = texto.split(" ");
  arr.forEach(i => {
    fecha = fecha + (textos(limpiarTexto(i)));
    console.log(textos(limpiarTexto(i)))
  });
  console.log(fecha)
  //do {
  //    fecha.startsWith('/') ? fecha = fecha.substring(1) : fecha = fecha;
  //} while (fecha.startsWith('/'));
  fecha = fecha.split('/');
  let fechaFinal = unidad(fecha[0]) + "/" + unidad(fecha[1]) + "/" + año(fecha[2])

  const response = {
    statusCode: 200,
    body: {
      "fecha": event.fecha,
      "texto": fechaFinal
    },
  };
  return response;
};

function textos(texto) {
  let traduccion = ''
  texto === 'VEINTEY' ? traduccion = '2' : null;
  texto === 'VEINTI' ? traduccion = '2' : null;
  texto === 'VEINTE' ? traduccion = '20' : null;
  texto === 'CIEN' ? traduccion = '1' : null;
  texto === 'MIL' ? traduccion = '1' : null;
  texto === 'DOSMIL' ? traduccion = '' : null;
  texto === 'NOVECIENTOS' ? traduccion = '9' : null;
  texto === 'ENERO' ? traduccion = '01' : null;
  texto === 'FEBRERO' ? traduccion = '02' : null;
  texto === 'MARZO' ? traduccion = '03' : null;
  texto === 'ABRIL' ? traduccion = '04' : null;
  texto === 'MAYO' ? traduccion = '05' : null;
  texto === 'JUNIO' ? traduccion = '06' : null;
  texto === 'JULIO' ? traduccion = '07' : null;
  texto === 'AGOSTO' ? traduccion = '08' : null;
  texto === 'SEPTIEMBRE' ? traduccion = '09' : null;
  texto === 'OCTUBRE' ? traduccion = '10' : null;
  texto === 'NOVIEMBRE' ? traduccion = '11' : null;
  texto === 'DICIEMBRE' ? traduccion = '12' : null;
  texto === 'UN' ? traduccion = '1' : null;
  texto === 'UNO' ? traduccion = '1' : null;
  texto === 'DOS' ? traduccion = '2' : null;
  texto === 'DO' ? traduccion = '2' : null;
  texto === 'TRES' ? traduccion = '3' : null;
  texto === 'TRE' ? traduccion = '3' : null;
  texto === 'CUATRO' ? traduccion = '4' : null;
  texto === 'CINCO' ? traduccion = '5' : null;
  texto === 'SEIS' ? traduccion = '6' : null;
  texto === 'SEI' ? traduccion = '6' : null;
  texto === 'SIETE' ? traduccion = '7' : null;
  texto === 'OCHO' ? traduccion = '8' : null;
  texto === 'NUEVE' ? traduccion = '9' : null;
  texto === 'NUE' ? traduccion = '9' : null;
  texto === 'DIEZY' ? traduccion = '1' : null;
  texto === 'DIECI' ? traduccion = '1' : null;
  texto === 'DIEZ' ? traduccion = '10' : null;
  texto === 'DIE' ? traduccion = '10' : null;
  texto === 'ONCE' ? traduccion = '11' : null;
  texto === 'DOCE' ? traduccion = '12' : null;
  texto === 'TRECE' ? traduccion = '13' : null;
  texto === 'CATORCE' ? traduccion = '14' : null;
  texto === 'QUINCE' ? traduccion = '15' : null;
  texto === 'TREINTAY' ? traduccion = '3' : null;
  texto === 'TREINTI' ? traduccion = '3' : null;
  texto === 'TREINTA' ? traduccion = '30' : null;
  texto === 'CUARENTAY' ? traduccion = '4' : null;
  texto === 'CUARENTAI' ? traduccion = '4' : null;
  texto === 'CUARENTA' ? traduccion = '40' : null;
  texto === 'CINCUENTAY' ? traduccion = '5' : null;
  texto === 'CINCUENTI' ? traduccion = '5' : null;
  texto === 'CINCUENTA' ? traduccion = '50' : null;
  texto === 'SESENTAY' ? traduccion = '6' : null;
  texto === 'SESENTAI' ? traduccion = '6' : null;
  texto === 'SESENTA' ? traduccion = '60' : null;
  texto === 'SETENTAY' ? traduccion = '7' : null;
  texto === 'SETENTI' ? traduccion = '7' : null;
  texto === 'SETENTA' ? traduccion = '70' : null;
  texto === 'OCHENTAY' ? traduccion = '8' : null;
  texto === 'OCHENTI' ? traduccion = '8' : null;
  texto === 'OCHENTA' ? traduccion = '80' : null;
  texto === 'NOVENTI' ? traduccion = '9' : null;
  texto === 'NOVENTA' ? traduccion = '90' : null;
  texto === 'DEL' ? traduccion = '/' : null;
  texto === '/' ? traduccion = '/' : null;
  texto === ',' ? traduccion = '/' : null;
  texto === 'DE' ? traduccion = '/' : null;
  texto === 'DEMIL' ? traduccion = '/1' : null;
  return traduccion;
}

function unidad(texto) {
  if (texto === '' || texto === undefined) {
    return null;
  } else {
    if (texto.length == 1) {
      texto = "0" + texto;
      return texto;
    } else {
      return texto;
    }
  }
}

function año(texto) {
  if (texto == 0) {
    return 2000;
  } else {
    if (texto.toString().length == 4) {
      return texto
    } else {
      let year = new Date().getFullYear()
      var validador = year - texto
      if (validador >= 2000 && validador < 2010) {
        var añoFinal = validador.toString().substring(0, 2) + texto
      } else if (validador < 2000) {
        var añoFinal = validador.toString().substring(0, 2) + texto
      } else {
        var añoFinal = validador.toString().substring(0, 2) + "0" + texto
      }
      return añoFinal
    }
  }
}

function limpiarTexto(texto) {
  texto = reemplazarVio(texto);
  texto = reemplazarPuntos(texto);
  //texto = reemplazarComas(texto);
  texto = reemplazarEspacioDoble(texto);

  return texto
}

function reemplazarPuntos(texto) {
  return texto.split('.').join('')
}

function reemplazarComas(texto) {
  return texto.split(',').join('');
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

function milenio(texto) {
  return texto.split('DOS MIL').join('DOSMIL')
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

function reemplazarMillon(texto) {
  return texto.split('MILLON').join('')
}

function reemplazarMillones(texto) {
  return texto.split('MILLONES').join('')
}