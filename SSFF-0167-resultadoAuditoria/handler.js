var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  let id_audio = event.idAudio;
  let respuesta = await buscaRespuestas(id_audio)
  let auditoria = await procesaRespuesta(respuesta, id_audio)
  return (auditoria)
};

async function buscaRespuestas(id_audio) {
  try {
    var params = {
      KeyConditionExpression: 'id_audio = :id_audio',
      ExpressionAttributeValues: {
        ':id_audio': { 'S': id_audio }
      },
      TableName: "ssff-comparacion"
    };
    var result = await dynamodb.query(params).promise()
    console.log('[INFO] successful database response - ID: ' + id_audio)
    return JSON.stringify(result);
  }
  catch (error) {
    console.error('[ERROR] database - ID: ' + id_audio + " - ERROR: " + error);
  }
}

async function procesaRespuesta(respuesta, id_audio) {
  try {
    let response = JSON.parse(respuesta)
    let resp = [], evaluacion
    for (var i = 0; i < response.Count; i++) {
      evaluacion = await evaluarResultado(response.Items[i].resultado.N)
      if (response.Items[i].preguntaOriginal.S == 'ARCHIVO') {
        resp.push(i + "_" + response.Items[i].preguntaOriginal.S)
        resp.push(i + "_" + id_audio)
      }
      else {
        resp.push(i + "_" + response.Items[i].preguntaOriginal.S)
        resp.push(i + "_" + evaluacion)
      }
    }
    console.log('[INFO] successful response processing - ID: ' + id_audio)
    return resp;
  }
  catch (error) {
    console.error('[ERROR] processing - ID: ' + id_audio + " - ERROR: " + error);
  }
}

async function evaluarResultado(resultado) {
  try {
    let evaluacion
    if (resultado == null || resultado == undefined) {
      evaluacion = 'NO'
    }
    else if (resultado > 50) {
      evaluacion = 'SI'
    }
    else {
      evaluacion = 'NO'
    }
    console.log('[INFO] successful result processing - resultado: ' + resultado)
    return evaluacion;
  }
  catch (error) {
    console.error('[ERROR] result - Resultado: ' + resultado + " - ERROR: " + error);
  }
}