const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();
const lambda = new AWS.Lambda({ region: 'us-west-2' });

exports.handler = async (event) => {

  console.log("[INFO] Computed initial parameters: %j", event);
  var texto, tipo, tiempo, id_audio, id, pregunta = '';

  for (const record of event.Records) {
    console.log('[INFO] DynamoDB Record: %j', record.dynamodb);
    for (var clave in record.dynamodb) {
      if (record.dynamodb.hasOwnProperty(clave)) {
        //console.log("[INFO] La clave es: " + clave+ " y el valor es: " + record.dynamodb[clave]);
        if (clave == 'NewImage') {
          for (var clave2 in record.dynamodb[clave]) {
            if (record.dynamodb[clave].hasOwnProperty(clave2)) {
              //console.log("[INFO] La clave2 es: " + clave2+ " y el valor es: " + record.dynamodb[clave][clave2])
              if (clave2 == 'texto') {
                for (var clave3 in record.dynamodb[clave][clave2]) {
                  if (record.dynamodb[clave][clave2].hasOwnProperty(clave3)) {
                    //console.log("[INFO] La clave3 es: " + clave3+ " y el valor es: " + record.dynamodb[clave][clave2][clave3])      
                    texto = record.dynamodb[clave][clave2][clave3];
                  }
                }
              }
              if (clave2 == 'tipo') {
                for (var clave3 in record.dynamodb[clave][clave2]) {
                  if (record.dynamodb[clave][clave2].hasOwnProperty(clave3)) {
                    //console.log("[INFO] La clave3 es: " + clave3+ " y el valor es: " + record.dynamodb[clave][clave2][clave3])      
                    tipo = record.dynamodb[clave][clave2][clave3];
                  }
                }
              }
              if (clave2 == 'tiempo' && tipo == 'respuesta') {
                for (var clave3 in record.dynamodb[clave][clave2]) {
                  if (record.dynamodb[clave][clave2].hasOwnProperty(clave3)) {
                    //console.log("[INFO] La clave3 es: " + clave3+ " y el valor es: " + record.dynamodb[clave][clave2][clave3])      
                    tiempo = record.dynamodb[clave][clave2][clave3];
                  }
                }
              }
              if (clave2 == 'id_audio' && tipo == 'respuesta') {
                for (var clave3 in record.dynamodb[clave][clave2]) {
                  if (record.dynamodb[clave][clave2].hasOwnProperty(clave3)) {
                    //console.log("[INFO] La clave3 es: " + clave3+ " y el valor es: " + record.dynamodb[clave][clave2][clave3])      
                    id_audio = record.dynamodb[clave][clave2][clave3];
                  }
                }
              }
              if (clave2 == 'id' && tipo == 'respuesta') {
                for (var clave3 in record.dynamodb[clave][clave2]) {
                  if (record.dynamodb[clave][clave2].hasOwnProperty(clave3)) {
                    //console.log("[INFO] La clave3 es: " + clave3+ " y el valor es: " + record.dynamodb[clave][clave2][clave3])      
                    id = record.dynamodb[clave][clave2][clave3];
                  }
                }
              }
              if (clave2 == 'pregunta' && tipo == 'respuesta') {
                for (var clave3 in record.dynamodb[clave][clave2]) {
                  if (record.dynamodb[clave][clave2].hasOwnProperty(clave3)) {
                    //console.log("[INFO] La clave3 es: " + clave3+ " y el valor es: " + record.dynamodb[clave][clave2][clave3])      
                    pregunta = record.dynamodb[clave][clave2][clave3];
                  }
                }
                if (pregunta == 'nombre') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 7);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'rut') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 1);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'fechaNacimiento') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 2);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'adicionales') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 7);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'aceptaSuscribirseCorreoElectronico') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "SI"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'direccionPostal') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 4);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'montoPie') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'plazoPagoPie') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 2);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaAbonoMayor') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "la diferencia"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'deudaAcuerdo') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'plazo') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"monto": "${texto}", "tipo": "${pregunta}"}`, 5)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'valorCuota') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'tasaInteres') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 6);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'primerVencimiento') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 2);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'impuesto') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaComision') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "comision de administracion"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaCargosPendientes') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "no incluidos"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaDerechoRetracto') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "derecho"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaDevolucionPie') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "devuelto su monto"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaTransaccion') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "saldo adeudado"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaVolverMora') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "morosidad"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'siAcepto') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "SI ACEPTO"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'nFolio') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"monto": "${texto}", "tipo": "${pregunta}"}`, 5)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaRebaja') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "rebaja"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaSeguro') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "seguros vigentes"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaRefinanciamiento') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "refinanciamiento"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaRenegociacion') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "renegociacion"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaBoletin') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "boletin"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'mencionaPagoOportuno') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "pago oportuno"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'informoPagoPie') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "SI PAGA PIE Y CEPTA EL PAGO SERA ELIMINADO DE DICOM"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'informoPagoCuota') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "SI NO PAGA CUOTA SERA INFORMADO A DICOM"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'despedida') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(`{"texto": "${texto}", "pregunta": "MUCHAS GRACIAS POR SU TIEMPO HASTA LUEGO"}`, 8)
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'montoDescuento') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'cupo') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'capital') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'interes') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'gastoCobranza') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'descuento') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'pie') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'total') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 3);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'fechaPagoPie') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 2);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'ciudadAperturaCuenta') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 7);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }
                if (pregunta == 'direccionEnvio') {
                  console.log("[INFO] Start translate: " + pregunta);
                  let traduccion = await callLambda(texto, 4);
                  console.log("[INFO] End translate: " + traduccion);
                  await this.insertDB(id, id_audio, tiempo, texto, pregunta, traduccion);
                }

              }
            }
          }
        }
      }
    }



  }

  return `[INFO] Successfully processed ${event.Records.length} records.`;


};

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
    console.log(`[INFO] Start Lambda: ${JSON.stringify(params)}`);
    lambda.invoke(params, (err, data) => err ? reject(err) : resolve(data));
  });
  //if (id === 8) return '[INFO] Iniciando Carga Texto';
  //else 
  return JSON.parse(traduccion.Payload).body.texto;
}

module.exports.insertDB = async (id, id_audio, tiempo, texto, pregunta, traduccion) => {
  console.log('[INFO] Start Insert DynamoDB translate: ' + id_audio + ' pregunta: ' + pregunta);
  try {
    let params = {
      TableName: "ssff-traduccion",
      "Item": {
        "id": { "N": id },
        "id_audio": { "S": id_audio },
        "tiempo": { "S": tiempo },
        "texto": { "S": texto },
        "pregunta": { "S": pregunta },
        "traduccion": { "S": traduccion }
      }
    };
    return await dynamodb.putItem(params).promise();
  } catch (error) {
    console.log(`[WARN] ${error}`);
    return;
  }
};

