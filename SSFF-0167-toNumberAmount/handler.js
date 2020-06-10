exports.handler = async (event) => {

  let texto = event.monto;
  texto = texto.toUpperCase();
  let valor = formatPesos(splitTextToConvert(texto));

  const response = {
    statusCode: 200,
    body: {
      "monto": event.monto,
      "texto": valor
    },
  };
  return response;
};

var normalize = (function () {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
    to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
    mapping = {};

  for (var i = 0, j = from.length; i < j; i++)
    mapping[from.charAt(i)] = to.charAt(i);

  return function (str) {
    var ret = [];
    for (var i = 0, j = str.length; i < j; i++) {
      var c = str.charAt(i);
      if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
      else ret.push(c);
    }
    return ret.join("");
  };
})();

function formatPesos(number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(number);
}


function getValor(text, dictionary) {
  let extracto;
  text = normalize(text).toUpperCase();
  dictionary.forEach((e) => {
    if (text.includes(e)) extracto = getMontoByDictionary(text, e);
  });
  return formatPesos(splitTextToConvert(extracto));
}

function getMontoByDictionary(text, e) {
  let io = text.indexOf(e) + e.length;
  let pesos = text.indexOf("PESOS", io);
  let returnable = text.substr(io, pesos - io).trim();
  return returnable === "" ? null : returnable;
}

function unidades(text) {
  switch (text) {
    case "UN":
      return 1;
    case "UNO":
      return 1;
    case "DOS":
      return 2;
    case "TRES":
      return 3;
    case "CUATRO":
      return 4;
    case "CINCO":
      return 5;
    case "SEIS":
      return 6;
    case "SIETE":
      return 7;
    case "OCHO":
      return 8;
    case "NUEVE":
      return 9;
  }
  return 0;
}

function decenas(text) {
  if (text.includes("DIECI")) return decenasDieci(text);

  if (text.includes("VEINTI")) return decenasVenti(text);

  switch (text) {
    case "DIEZ":
      return 10;
    case "ONCE":
      return 11;
    case "DOCE":
      return 12;
    case "TRECE":
      return 13;
    case "CATORCE":
      return 14;
    case "QUINCE":
      return 15;
    case "VEINTE":
      return 20;
    case "TREINTA":
      return 30;
    case "CUARENTA":
      return 40;
    case "CINCUENTA":
      return 50;
    case "SESENTA":
      return 60;
    case "SETENTA":
      return 70;
    case "OCHENTA":
      return 80;
    case "NOVENTA":
      return 90;
  }
  return unidades(text);
}

function decenasDieci(text) {
  text = text.trim().replace("DIECI", 1);
  let extracto = text.substring(text.indexOf("1") + 1);
  text = text.replace(extracto, unidades(extracto));
  return parseInt(text);
}

function decenasVenti(text) {
  text = text.trim().replace("VEINTI", 2);
  let extracto = text.substring(text.indexOf("2") + 1);
  text = text.replace(extracto, unidades(extracto));
  return parseInt(text);
}

function centenas(text) {
  switch (text) {
    case "CIEN":
      return 100;
    case "CIENTO":
      return 100;
    case "DOSCIENTOS":
      return 200;
    case "TRESCIENTOS":
      return 300;
    case "CUATROCIENTOS":
      return 400;
    case "QUINIENTOS":
      return 500;
    case "SEISCIENTOS":
      return 600;
    case "SETECIENTOS":
      return 700;
    case "OCHOCIENTOS":
      return 800;
    case "NOVECIENTOS":
      return 900;
  }
  return decenas(text);
}

function miles(text) {
  return text === "MIL" ? 1000 : centenas(text);
}

function millones(text) {
  return text === "MILLON" || text === "MILLONES" ? 1000000 : miles(text);
}

function convertTextToNumber(text, number) {
  if (text === "MILLON" || text === "MILLONES" || text === "MIL") {
    return number * millones(text);
  }
  return number + centenas(text);
}

function splitTextToConvert(text) {
  text = clearSpecialCaracters(text);
  let arr = text.split(" ");
  let numberConvert = 0;
  arr.forEach((e) => {
    numberConvert = convertTextToNumber(e, numberConvert);
  });
  return numberConvert;
}

function clearSpecialCaracters(text) {
  text = text.split(",").join("");
  text = text.split(".").join("");
  if (text.includes(" CIENTOS")) {
    text = text.replace(" CIENTOS", "CIENTOS");
  }
  return text;
}

const dictionaryMontoPie = ["SU REFINANCIAMIENTO DEBERA PAGAR LA SUMA DE",];
const dictionaryDeudaAcuerdo = ["EL MONTO A PAGAR SERA DE",];
const dictionaryValorCuota = ["MENSUALES+ Y SUCESIVAS DE",];
const dictionaryImpuesto = ["IMPUESTO DE TIMBRE Y ESTAMPILLAS POR",];
const dictionaryMontoDescuento = ["DESCUENTO EN SU MONTO POR",];
const dictionaryCupo = ["SU CUPO ES DE",];

