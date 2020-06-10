exports.handler = async (event) => {

  let textoLimpio = removeAccents(event.texto.split('.').join('').toUpperCase().trimLeft().trimRight())

  const response = {
    statusCode: 200,
    body: {
      "textoOriginal": event.texto,
      "texto": textoLimpio
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