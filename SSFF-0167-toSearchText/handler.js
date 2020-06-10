var AWS = require("aws-sdk");

exports.handler = async (event) => {

  let texto = removeAccents(event.texto.toUpperCase());
  let pregunta = removeAccents(event.pregunta.toUpperCase());
  let arr = [];
  let busqueda = 0;

  do {
    let indexes = [];
    let frase;

    if (texto.includes(pregunta)) {
      arr.push('SI')
      indexes.push(texto.indexOf(pregunta, busqueda))
      indexes.push(texto.indexOf(pregunta, busqueda) + pregunta.length)
      busqueda = texto.indexOf(pregunta, busqueda) + pregunta.length - 1;
      frase = texto.substr(busqueda, texto.indexOf('.', texto.indexOf(pregunta, busqueda)));
      indexes.push(frase)

      arr.push(indexes)
    } else {
      arr.push('NO')
      break
    }

  } while (texto.includes(pregunta, busqueda));

  const response = {
    statusCode: 200,
    body: {
      "textoLargo": event.texto,
      "frase": event.pregunta,
      "texto": arr[0]
    },
  };
  return response;
};

function removeAccents(strAccents) {
  var strAccents = strAccents.split('');
  var strAccentsOut = new Array();
  var strAccentsLen = strAccents.length;
  var accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüŠšŸÿýŽž";
  var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuSsYyyZz";
  for (var y = 0; y < strAccentsLen; y++) {
    if (accents.indexOf(strAccents[y]) != -1) {
      strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
    } else
      strAccentsOut[y] = strAccents[y];
  }
  strAccentsOut = strAccentsOut.join('');

  return strAccentsOut;
}