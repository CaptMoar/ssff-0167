exports.handler = async (event) => {
  let numeros = (event.decimal).toUpperCase()
  numeros = formatTasa(convertTextToNumberDecimal(numeros))

  const response = {
    statusCode: 200,
    body: {
      "decimal": event.decimal,
      "texto": numeros
    },
  };
  return response;
};

const unidades = [
  { texto: "CERO", numero: 0 },
  { texto: "UN", numero: 1 },
  { texto: "UNO", numero: 1 },
  { texto: "DOS", numero: 2 },
  { texto: "TRES", numero: 3 },
  { texto: "CUATRO", numero: 4 },
  { texto: "CINCO", numero: 5 },
  { texto: "SEIS", numero: 6 },
  { texto: "SIETE", numero: 7 },
  { texto: "OCHO", numero: 8 },
  { texto: "NUEVE", numero: 9 },
];

const decenas = [
  { texto: "DIEZ", numero: 10 },
  { texto: "ONCE", numero: 11 },
  { texto: "DOCE", numero: 12 },
  { texto: "TRECE", numero: 13 },
  { texto: "CATORCE", numero: 14 },
  { texto: "QUINCE", numero: 15 },
  { texto: "VEINTE", numero: 20 },
  { texto: "TREINTA", numero: 30 },
  { texto: "CUARENTA", numero: 40 },
  { texto: "CINCUENTA", numero: 50 },
  { texto: "SESENTA", numero: 60 },
  { texto: "SETENTA", numero: 70 },
  { texto: "OCHENTA", numero: 80 },
  { texto: "NOVENTA", numero: 90 },
];

const centenas = [
  { texto: "CIEN", numero: 100 },
  { texto: "CIENTO", numero: 100 },
  { texto: "DOSCIENTOS", numero: 200 },
  { texto: "TRESCIENTOS", numero: 300 },
  { texto: "CUATROCIENTOS", numero: 400 },
  { texto: "QUINIENTOS", numero: 500 },
  { texto: "SEISCIENTOS", numero: 600 },
  { texto: "SETECIENTOS", numero: 700 },
  { texto: "OCHOCIENTOS", numero: 800 },
  { texto: "NOVECIENTOS", numero: 900 },
];

const miles = [{ texto: "MIL", numero: 1000 }];

const millones = [
  { texto: "MILLON", numero: 1000000 },
  { texto: "MILLONES", numero: 1000000 },
];

function esNumeroUnidad(text) {
  let obj = unidades.find((unidad) => unidad.texto === text);
  return obj == null ? "" : obj.numero;
}

function decenasDieci(text) {
  text = text.trim().replace("DIECI", 1);
  let extracto = text.substring(text.indexOf("1") + 1);
  text = text.replace(extracto, esNumeroUnidad(extracto));
  return parseInt(text);
}

function decenasVenti(text) {
  text = text.trim().replace("VEINTI", 2);
  let extracto = text.substring(text.indexOf("2") + 1);
  text = text.replace(extracto, esNumeroUnidad(extracto));
  return parseInt(text);
}

function esNumeroDecena(text) {
  if (text.includes("DIECI")) return decenasDieci(text);
  if (text.includes("VEINTI")) return decenasVenti(text);
  let obj = decenas.find((decena) => decena.texto === text);
  return obj == null ? esNumeroUnidad(text) : obj.numero;
}

function esNumeroCentena(text) {
  let obj = centenas.find((centena) => centena.texto === text);
  return obj == null ? esNumeroDecena(text) : obj.numero;
}

function esNumeroMiles(text) {
  let obj = miles.find((mil) => mil.texto === text);
  return obj == null ? esNumeroCentena(text) : obj.numero;
}

function esNumeroMillones(text) {
  let obj = millones.find((millon) => millon.texto === text);
  return obj == null ? esNumeroMiles(text) : obj.numero;
}

function splitText(text) {
  return (text = text.split(" "));
}

function convertText(text) {
  return esNumeroMillones(text);
}

function sumArr(arr) {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return arr.reduce(reducer);
}

function clearArr(arr) {
  return arr.filter((el) => el != null && el != "");
}

function clearSpecialCaracters(text) {
  text = text.split(",").join("");
  text = text.split(".").join("");
  console.log(text);
  if (text.includes(" CIENTOS")) {
    text = text.replace(" CIENTOS", "CIENTOS");
  }
  return text;
}

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

function joinArrToText(arr) {
  let text = "";
  let suma = false;
  let arreglo = [];
  for (let i = 0; i < arr.length; i++) {
    if (i < arr.length - 1) {
      if (arr[i].toString().length > arr[i + 1].toString().length) {
        arreglo.push(parseInt(arr[i]));
        suma = true;
      } else {
        if (suma) {
          arreglo.push(parseInt(arr[i]));
          text += sumArr(arreglo);
        } else {
          text += ("" + arr[i]);
        }
        suma = false;
      }
    } else {
      text += ("" + arr[i]);
    }
  }
  return text;
}

function convertTextToNumberDecimal(text) {
  text = clearSpecialCaracters(text);
  let arrText = splitText(text);
  let arrConvert = arrText.map(function (el) {
    if (el === "PUNTO") {
      return ".";
    } else {
      return convertText(el);
    }
  });
  return joinArrToText(clearArr(arrConvert));
}

function formatTasa(number) {
  return new Intl.NumberFormat("es-CL", {
    style: "decimal",
    currency: "CLP",
  }).format(number);
}

const dictionaryMontoPie = ["SU REFINANCIAMIENTO DEBERA PAGAR LA SUMA DE"];
const dictionaryDeudaAcuerdo = ["EL MONTO A PAGAR SERA DE"];
const dictionaryValorCuota = ["MENSUALES Y SUCESIVAS DE"];
const dictionaryTasaInteres = ["INTERES APLICADA ES DE"];
const dictionaryImpuesto = ["IMPUESTO DE TIMBRE Y ESTAMPILLAS POR"];

function getTasaInteresByDictionary(text, e) {
  let io = text.indexOf(e) + e.length;
  let porciento = text.indexOf("POR CIENTO", io);
  let returnable = text.substr(io, porciento - io).trim();
  return returnable === "" ? null : returnable;
}

function getTasaInteres(text) {
  let extracto;
  text = normalize(text).toUpperCase();
  dictionaryTasaInteres.forEach((e) => {
    if (text.includes(e)) extracto = getTasaInteresByDictionary(text, e);
  });
  return formatTasa(convertTextToNumberDecimal(extracto)) + "%";
}
