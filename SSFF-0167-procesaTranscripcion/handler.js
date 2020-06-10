const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();
const lambda = new AWS.Lambda({ region: 'us-west-2' });

const tempAuditoria = [];
const preguntasAuditoria = ["Nombre:", //OK
  "Rut:", //OK
  "FECHA NACIMIENTO",
  "ADDIONALES",
  "DIRECCION",
  "CORREOE LECTRONICO",
  "MENCIONA ABONO MAYOR",
  "Deuda Acuerdo:", //OK
  "Plazo:", //OK
  "Valor Cuota:", //OK
  "TASA DE INTERES",
  "Primer Vencimiento:", //OK
  "IMPUESTO",
  "ABONO",
  "SEGUROS VIGENTES",
  "DEVOLUCIONPIE",
  "DERECHO RETRACTO",
  "DEVOLUCION PIE",
  "MOROSIDAD",
  "Cliente dijo Si Acepto", //OK
  "Nº de folio", //OK
  "Ejecutivo se despide corporativamente", //OK
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "Capital:", //OK
  "Interes (=0):", //OK
  "Gastos de Cobranza (=0):", //OK
  "Descuento:", //OK
  "Pie:", //OK
  "Total", //????
  "",
  "",
  "",
  "Informo a cliente que si paga pie y acepta el acuerdo de pago será eliminado de Dicom", //OK
  "Informo a cliente que si no paga oportunamente alguna de las cuotas será nuevamente informado a Dicom" //OK
]

exports.handler = async (event) => {
  console.log(`[INFO] Starting process transcribtion with ${JSON.stringify(event)}`);
  let fileId = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  let idFinal = fileId.split('.');
  let texto;
  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  try {
    let params = {
      Bucket: srcBucket,
      Key: srcKey
    };
    let file = await s3.getObject(params).promise();
    let jsonObject = JSON.parse(Buffer.from(JSON.parse(JSON.stringify(file.Body)).data).toString('utf8'));
    texto = tryFn(() => JSON.stringify(jsonObject.results.transcripts[0].transcript));
    texto = texto.split('-').join(' ');
  } catch (error) {
    console.log(`[WARN] JSON parameters not found ${error}`);
    response.statusCode = 404;
    return response;
  }

  try {
    let params = {
      Bucket: "ssff-auditoria-convenios",
      Key: srcKey
    };
    let file = await s3.getObject(params).promise();
    let jsonObject = JSON.parse(Buffer.from(JSON.parse(JSON.stringify(file.Body)).data).toString('utf8'));
    //console.log(`[WARN] Load data from S3: ${JSON.stringify(jsonObject)}`);

    for (var key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        if (jsonObject[key].hasOwnProperty('PREGUNTA')) {
          tempAuditoria.push(jsonObject[key].PREGUNTA)
        }
      }
    }
  } catch (error) {
    console.log(`[WARN] ${error}`);
    return;
  }
  console.log(tempAuditoria)
  for (var i = 0; i < 45; i++) {
    let response = await this.deteccionRespuestas(texto, i + 1, idFinal[0]);
    if (response) { // && preguntasTemp[i] === preguntasAuditoria[i]
      console.log(`[INFO] [${i + 1}] ${preguntasAuditoria[i]} found : ${response}`);
      //let traduccion = await callLambda(response, 7);
      await this.insertDB(i, idFinal[0], baseAuditaria[i], response, response);
    }
  }

  let response = {
    statusCode: 200,
    body: JSON.stringify('[END] Succes execution'),
  };
  return response;
};

module.exports.deteccionRespuestas = async (texto, coincidencia, id_audio) => {
  let textoCortado, preguntas, corte, traduccion, menciona;
  texto = normalize(texto.toUpperCase());
  switch (coincidencia) {
    case 1:
      //nombre
      preguntas = ["SU NOMBRE", "TU NOMBRE"];
      corte = ["RUT", "."];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 2:
      //rut
      preguntas = ["SU RUT", " RUT "]
      corte = ["TELEFONO", "ME INDICA"]
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 3:
      //fechaNacimiento
      preguntas = ["NACIMIENTO"]
      corte = ["TIENE"]
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 4:
      //adicionales
      preguntas = ["ADICIONALES"];
      corte = ["DIRECCION", " NO ", " SI "];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length) + corte[j].length);
            return textoCortado;
          }
        }
      }
      break;
    case 5:
      //direccionPostal
      preguntas = [" DIRECCION "];
      corte = [". "];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 6:
      //aceptaSuscribirseCorreoElectronico
      preguntas = ["EL ESTADO DE CUENTA"];
      corte = ["SI", "NO", "."];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 7:
      //mencionaAbonoMayor
      preguntas = ["ABONO MAYOR"];
      for (var i = 0; i < preguntas.length; i++) {
        texto.includes(preguntas[i]) ? menciona = "SI" : menciona = "NO";
      }
      return menciona;
    case 8:
      //Acuerdo deuda
      preguntas = ["TOTAL ACUERDO", "TOTAL"];
      corte = ["DESCUENTO", " PESOS", "MONTO", ",", "."];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 9:
      //plazo
      preguntas = ["CUOTAS", "PESOS EN "];
      corte = ["MENSUALES"];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 10:
      //valorCuota
      preguntas = ["CUOTAS FIJAS MENSUALES"];
      corte = ["PESOS"];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 11:
      //tasaInteres 
      preguntas = ["LA TASA DE INTERES APLICADA ES DE", "INTERES"];
      corte = ["PORCIENTO", "GASTOS DE COBRANZA"];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 12:
      //PrimerVencimiento
      preguntas = ["PRIMERA CUOTA EL DIA", "VENCIMIENTO"];
      corte = ["DOS MIL VEINTE"];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length) + corte[j].length);
            return textoCortado;
          }
        }
      }
      break;
    case 13:
      //impuesto  
      preguntas = ["IMPUESTO DE TIMBRE Y ESTAMPILLAS"];
      corte = ["PESOS"];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 14:
      //mencionaRebaja
      preguntas = ["REBAJA DEL"];
      for (var i = 0; i < preguntas.length; i++) {
        texto.includes(preguntas[i]) ? menciona = "SI" : menciona = "NO";
      }
      return menciona;
    case 15:
      //mencionaSeguro
      preguntas = ["SEGUROS VIGENTES"]
      for (var i = 0; i < preguntas.length; i++) {
        texto.includes(preguntas[i]) ? menciona = "SI" : menciona = "NO";
      }
      return menciona;
    case 16:
      //mencionaCargosPendientes
      preguntas = ["CARGOS PENDIENTES DE FACTURACION"];
      for (var i = 0; i < preguntas.length; i++) {
        texto.includes(preguntas[i]) ? menciona = "SI" : menciona = "NO";
      }
      return menciona;
    case 17:
      //mencionaDerechoRetracto
      preguntas = ["USTED PODRA RETRACTARSE"];
      for (var i = 0; i < preguntas.length; i++) {
        texto.includes(preguntas[i]) ? menciona = "SI" : menciona = "NO";
      }
      return menciona;
    case 18:
      //mencionaDevolucionPie
      preguntas = ["NO SERA DEVUELTO SU MONTO"]
      for (var i = 0; i < preguntas.length; i++) {
        texto.includes(preguntas[i]) ? menciona = "SI" : menciona = "NO";
      }
      return menciona;
    case 19:
      //mencionaVolverMora
      preguntas = ["MOROSIDAD"];
      for (var i = 0; i < preguntas.length; i++) {
        texto.includes(preguntas[i]) ? menciona = "SI" : menciona = "NO";
      }
      return menciona;
    case 20:
      //siAcepto
      preguntas = ["ACEPTA CONTRATAR", " ACEPTA "];
      corte = ["SI", ","];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 21:
      //nFolio
      preguntas = ["EL SIGUIENTE NUMERO DE FOLIO", "NUMERO DE FOLIO", "FOLIO"];
      corte = ["QUEDANDO", "QUEDADO", "SEÑOR"];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 22:
      //despedida
      preguntas = ["MUCHAS GRACIAS POR SU TIEMPO"]
      for (var i = 0; i < preguntas.length; i++) {
        texto.includes(preguntas[i]) ? menciona = "SI" : menciona = "NO";
      }
      return menciona;
    case 23:
      //montoPie
      break;
    case 24:
      //plazoPagoPie
      break;
    case 25:
      //mencionaComision
      break;
    case 26:
      //mencionaTransaccion
      break;
    case 27:
      //montoDescuento
      break;
    case 28:
      //mencionaRefinanciamiento
      break;
    case 29:
      //mencionaRenegociacion
      break;
    case 30:
      //cupo
      break;
    case 31:
      //mencionaBoletin
      break;
    case 32:
      //mencionaPagoOportuno
      break;
    case 33:
      //ciudadAperturaCuenta
      break;
    case 34:
      //direccionEnvio
      break;
    case 35:
      //capital
      preguntas = [" CAPITAL"];
      corte = [" PESOS", "."];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 36:
      //interes
      preguntas = ["INTERES"];
      corte = ["GASTOS DE COBRANZA", ",", "."];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length));
            return textoCortado;
          }
        }
      }
      break;
    case 37:
      //gastoCobranza
      preguntas = ["GASTOS DE COBRANZA"];
      corte = ["CERO"];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length) + corte[j].length);
            return textoCortado;
          }
        }
      }
      break;
    case 38:
      //descuento
      preguntas = [" DESCUENTO"];
      corte = [" PESOS"];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length, texto.indexOf(corte[j],
              texto.indexOf(preguntas[i]) + preguntas[i].length) + corte[j].length);
            return textoCortado;
          }
        }
      }
      break;
    case 39:
      //pie
      preguntas = [" PIE"];
      corte = [" PESOS"];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length) + corte[j].length);
            return textoCortado;
          }
        }
      }
      break;
    case 40:
      //total
      preguntas = [" MONTO DE", "SU MONTO ES DE "];
      corte = [" PESOS"];
      for (var i = 0; i < preguntas.length; i++) {
        for (var j = 0; j < corte.length; j++) {
          if (texto.includes(preguntas[i]) && texto.includes(corte[j])) {
            textoCortado = texto.substring(texto.indexOf(preguntas[i]) + preguntas[i].length,
              texto.indexOf(corte[j], texto.indexOf(preguntas[i]) + preguntas[i].length) + corte[j].length);
            return textoCortado;
          }
        }
      }
      break;
    case 41:
      //fechaPagoPie
      break;
    case 42:
      //informoPagoPie
      break;
    case 43:
      //informoPagoCuota
      break;
    case 44:
      //mencionaEliminadoDicom
      preguntas = ["ELIMINARAN ANTECEDENTES COMERCIALES"]
      for (var i = 0; i < preguntas.length; i++) {
        texto.includes(preguntas[i]) ? menciona = "SI" : menciona = "NO";
      }
      return menciona;
    case 45:
      //mencionaEliminadoDicom
      preguntas = ["QUEDARA EN DICOM"];
      for (var i = 0; i < preguntas.length; i++) {
        texto.includes(preguntas[i]) ? menciona = "SI" : menciona = "NO";
      }
      return menciona;
    default:
      break;
  }
}

async function callLambda(parametros, id) {
  let functionName, payLoad;
  switch (id) {
    case 1:
      functionName = `0167_SSFF_toNumberRut`;
      payLoad = `{ "rut": "${parametros}" }`;
      break;
    case 2:
      functionName = '0167_SSFF_toNumberDate';
      payLoad = `{ "fecha": "${parametros}" }`;
      break;
    case 3:
      functionName = '0167_SSFF_toNumberAmount';
      payLoad = `{ "monto": "${parametros}" }`;
      break;
    case 4:
      functionName = '0167_SSFF_toNumberAddress';
      payLoad = `{ "direccion": "${parametros}" }`;
      break;
    case 5:
      functionName = '0167_SSFF_toNumberNumber';
      payLoad = `{ "numero": "${parametros}" }`;
      break;
    case 6:
      functionName = '0167_SSFF_toNumberDecimal';
      payLoad = `{ "decimal": "${parametros}" }`;
      break;
    case 7:
      functionName = '0167_SSFF_toText';
      payLoad = `{ "texto": "${parametros}" }`;
      break;
    case 8:
      functionName = '0167_SSFF_toSearchText';
      payLoad = `${parametros}`;
      break;

    default:
      return 'Ingreso invalido';
  }

  const traduccion = await new Promise((resolve, reject) => {
    const params = {
      FunctionName: functionName,
      InvocationType: "RequestResponse",
      LogType: 'Tail',
      Payload: payLoad,
    };
    //console.log(`[INFO] Start Lambda: ${JSON.stringify(params)}`);
    lambda.invoke(params, (err, data) => err ? reject(err) : resolve(data));
  });
  return JSON.parse(traduccion.Payload).body.texto;
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

const tryFn = (fn, fallback = null) => {
  try {
    return fn();
  } catch (error) {
    return fallback;
  }
}

module.exports.insertDB = async (id, id_audio, pregunta, texto, traduccion) => {
  //console.log('[INFO] Start Insert DynamoDB translate: ' + id_audio + ' pregunta: ' + pregunta);
  try {
    let params = {
      TableName: "ssff-traduccion",
      "Item": {
        "id": { 'N': JSON.stringify(id) },
        "id_audio": { "S": id_audio },
        "pregunta": { "S": pregunta },
        "texto": { "S": texto },
        "traduccion": { "S": traduccion }
      }
    };
    return await dynamodb.putItem(params).promise();
  } catch (error) {
    console.log(`[WARN] Error on ssff-traduccion insert ${error}`);
    return;
  }
};

const baseAuditaria = ["nombre",
  "rut",
  "fechaNacimiento",
  "adicionales",
  "direccionPostal",
  "aceptaSuscribirseCorreoElectronico",
  "mencionaAbonoMayor",
  "acuerdoDeuda",
  "plazo",
  "valorCuota",
  "tasaInteres",
  "PrimerVencimiento",
  "impuesto",
  "mencionaRebaja",
  "mencionaSeguro",
  "mencionaCargosPendientes",
  "mencionaDerechoRetracto",
  "mencionaDevolucionPie",
  "mencionaVolverMora",
  "siAcepto",
  "nFolio",
  "despedida",
  "montoPie",
  "plazoPagoPie",
  "mencionaComision",
  "mencionaTransaccion",
  "montoDescuento",
  "mencionaRefinanciamiento",
  "mencionaRenegociacion",
  "cupo",
  "mencionaBoletin",
  "mencionaPagoOportuno",
  "ciudadAperturaCuenta",
  "direccionEnvio",
  "capital",
  "interes",
  "gastoCobranza",
  "descuento",
  "pie",
  "total",
  "fechaPagoPie",
  "informoPagoPie",
  "informoPagoCuota",
  "mencionaEliminadoDicom",
  "mencionaEliminadoDicom"];
