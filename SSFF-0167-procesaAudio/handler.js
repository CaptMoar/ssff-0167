
const AWS = require("aws-sdk");
const path = require("path");
const transcribeService = new AWS.TranscribeService();
const dynamoDB = new AWS.DynamoDB();
const s3 = new AWS.S3();
const lambda = new AWS.Lambda({ region: 'us-west-2' });

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event))
  let status;
  const params = await computeParameters(event);

  callLambda(`{"srcBucket": "${params.inputBucket}", "srcKey": "${params.inputKey}"}`, 8)
  //await deleteVocabulary(params);
  await createVocabulary(event, params);

  for (var i = 0; true; i++) {
    let status = await transcribeService.getVocabulary({ VocabularyName: params.jobName }).promise();
    console.log(`[INFO] Waiting Vocabulary ${status.VocabularyState}`);
    if (status.VocabularyState == 'READY') break;
    if (status.VocabularyState == 'FAILED') return `[WARN] The vocabulary ${params.jobName} have a error.`;

    await wait();
  }

  //var get12 = await transcribeService.getTranscriptionJob({ TranscriptionJobName: params.jobName }).promise();
  //console.log(get12.TranscriptionJob.TranscriptionJobStatus)
  //await deleteTranscriptionJob(params);

  await transcribeAudio(params);

  return { code: '200' }
};

async function computeParameters(event) {
  let inputKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  const audioFile = path.basename(inputKey);
  const videoId = audioFile.substring(0, audioFile.length - 5);
  const inputBucket = event.Records[0].s3.bucket.name;
  const mediaFileUrl = "https://" + inputBucket + ".s3-us-west-2" + ".amazonaws.com/" + videoId + ".mp3";
  const outputBucket = "https://" + inputBucket + ".s3-us-west-2" + ".amazonaws.com/";

  const params =
  {
    inputKey: inputKey,
    audioFile: videoId + ".mp3",
    jobName: videoId,
    inputBucket: inputBucket,
    outputBucket: process.env.OUTPUT_BUCKET,
    mediaFileUrl: mediaFileUrl,
    region: process.env.REGION,
    transcribeLanguage: process.env.TRANSCRIBE_LANGUAGE,
    vocabularyName: videoId
  };

  console.log("[INFO] Computed initial parameters: %j", params);
  return params;
}

async function createVocabulary(event, params) {
  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  const typeMatch = srcKey.match(/\.([^.]*)$/); //Archivo.formato
  const imageType = typeMatch[1].toLowerCase();
  let jsonObject;
  let phrases = ['INDIQUEME-SU-NOMBRE-COMPLETO',
    'INDIQUEME-SU-RUT',
    'INDIQUEME-SU-FECHA-DE-NACIMIENTO',
    'INDIQUEME-OTRO-TELEFONO',
    'TIENE-TARJETAS-ADICIONALES',
    'INDIQUEME-EL-NOMBRE-DE-SU-ADICIONAL',
    'INDIQUEME-SU-DIRECCION-POSTAL',
    'DIRECCION-FISICA',
    'LAS-CONDICIONES-GENERALES-DE-SU-REFINANCIAMIENTO',
    'ESTADO-DE-CUENTA-DE-LA-TARJETA-DE-CREDITO',
    'SU-ESTADO-DE-CUENTA-SERA-ENVIADO',
    'ABONO-MAYOR',
    'EL-MONTO-DE-LA-DEUDA-TOTAL-DE-SU-TARJETA',
    'SE-FIJAN',
    'CUOTAS-FIJAS-MENSUALES-Y-SUCESIVAS-DE',
    'LA-TASA-DE-INTERES',
    'LA-TASA-DE-INTERES-APLICADA-ES-DE',
    'POR-CIENTO-MENSUAL',
    'PRIMERA-CUOTA-EL-DIA',
    'LA-PRIMERA-FACTURACION',
    'IMPUESTO-DE-TIMBRE-Y-ESTAMPILLAS-POR',
    'PESOS',
    'REBAJA-EN-LA-COMISION-DE-ADMINISTRACION',
    'SEGUROS-VIGENTES',
    'CARGOS-PENDIENTES-DE-FACTURACION',
    'USTED-PODRA-RETRACTARSE',
    'USTED-TENDRA-DERECHO-A-RETRACTARSE',
    'NO-SERA-DEVUELTO-SU-MONTO',
    'VOLVER-A-QUEDAR-EN-SITUACION-DE-MOROSIDAD',
    'QUEDAR-EN-LA-MISMA-SITUACION-DE-MOROSIDAD',
    'ESTE-CONVENIO-BAJO-ESTAS-CONDICIONES',
    'SU-CONVENIO-DE-PAGO-YA-FUE-REGISTRADO',
    'CON-EL-NUMERO-DE-FOLIO',
    'QUIERE-QUE-SE-LO-REPITA',
    'MUCHAS-GRACIAS-POR-SU-TIEMPO-HASTA-LUEGO',
    'RUT'];

  if (imageType != "json") {
    console.log(`[WARN] Unsupported file type: ${imageType}`);
    return;
  }

  try {
    let params = {
      Bucket: srcBucket,
      Key: srcKey
    };
    let file = await s3.getObject(params).promise();
    jsonObject = JSON.parse(Buffer.from(JSON.parse(JSON.stringify(file.Body)).data).toString('utf8'));
    console.log(`[WARN] Load data from S3: ${JSON.stringify(jsonObject)}`);
  } catch (error) {
    console.log(`[WARN] ${error}`);
    return;
  }

  let auditoria = new Auditoria(jsonObject);

  let nombreTemp = jsonObject.NOMBRE.VALOR;

  (nombreTemp.split(' ')).forEach(element =>
    phrases.push(element)
  )

  auditoria.archivo = await callLambda(auditoria.archivo, 7);
  auditoria.rut = await callLambda(auditoria.rut, 1);
  auditoria.fechaNacimiento = await callLambda(auditoria.fechaNacimiento, 2);
  auditoria.primerVencimiento = await callLambda(auditoria.primerVencimiento, 2);
  auditoria.direccionPostal = '';
  auditoria.impuesto = await callLambda(auditoria.impuesto, 5);
  auditoria.deudaAcuerdo = await callLambda(auditoria.deudaAcuerdo, 5);
  auditoria.valorCuota = await callLambda(auditoria.valorCuota, 5);
  auditoria.tasaInteres = await callLambda(auditoria.tasaInteres, 6);
  auditoria.plazo = await callLambda(auditoria.plazo, 7);
  auditoria.nFolio = await callLambda(auditoria.nFolio, 7);
  auditoria.adicionales = '';
  auditoria.total = await callLambda(auditoria.total, 5);
  auditoria.capital = await callLambda(auditoria.capital, 5);
  auditoria.descuento = await callLambda(auditoria.descuento, 5);
  auditoria.pie = await callLambda(auditoria.pie, 5);
  auditoria.plazoPagoPie = await callLambda(auditoria.plazoPagoPie, 2);
  auditoria.montoPie = await callLambda(auditoria.montoPie, 5);


  for (var i in auditoria) {
    if (auditoria[i] != '' || !auditoria.archivo)
      phrases.push(auditoria[i]);
    else ``;
  }

  console.log(`[INFO] Inizializating phrases ${phrases}`);

  let vocabulary = {
    LanguageCode: 'es-ES',
    VocabularyName: params.jobName,
    Phrases: phrases
  };

  const cVocabulary = await transcribeService.createVocabulary(vocabulary).promise();
  console.log('[INFO] Start createVocabulary: ' + JSON.stringify(cVocabulary));
}

async function transcribeAudio(params) {
  try {
    var transcribeParams = {
      LanguageCode: "es-ES",
      Media: {
        MediaFileUri: params.mediaFileUrl
      },
      MediaFormat: "mp3",
      TranscriptionJobName: params.jobName,
      OutputBucketName: "0167-ssff-auditoria-convenios-transcript",
      Settings: {
        VocabularyName: params.jobName
        //ShowSpeakerLabels: true,
        //MaxSpeakerLabels: 2
      }
    };
    console.log("[INFO] about to launch Transcribe job with params: %j", transcribeParams);
    const transcribeResult = await transcribeService.startTranscriptionJob(transcribeParams).promise();
    console.log("[INFO] got startTranscriptionJob() response: %j", transcribeResult);
  }
  catch (error) {
    console.log("[ERROR] failed to transcribe audio", error);
    throw error;
  }
}

async function deleteVocabulary(params) {
  console.log(`[INFO] Inizializating delete vocabulary ${params}`);
  let stat = await transcribeService.getVocabulary({ VocabularyName: params.jobName }).promise();
  if (stat == 'PENDING' || stat == 'FAILED') {
    console.log("[INFO] Vocabulary is not necesary deleting:  " + JSON.stringify(params));
  } else {
    console.log("[INFO] Deleting vocabulary " + JSON.stringify(params));
    const transcribeResult = await transcribeService.deleteVocabulary({ VocabularyName: params.jobName }).promise();
  }
}

async function deleteTranscriptionJob(params) {
  console.log("[INFO] Deleting transcribe job " + JSON.stringify(params));
  const transcribeResult = await transcribeService.deleteTranscriptionJob({ TranscriptionJobName: params.jobName }).promise();
}

class Auditoria {
  constructor(req) {
    req = req || undefined;
    this.archivo = tryFn(() => req.ARCHIVO.VALOR);
    this.primerNombre = '';
    this.segundoNombre = '';
    this.primerApellido = '';
    this.segundoApellido = '';
    this.rut = tryFn(() => req.RUT.VALOR);
    this.fechaNacimiento = tryFn(() => req.FECHADENACIMIENTO.VALOR);
    this.adicionales = tryFn(() => req.ADICIONALES.VALOR);
    this.direccionPostal = tryFn(() => req.DIRECCIONPOSTAL.VALOR);
    this.aceptaSuscribirseCorreoElectronico = tryFn(() => req.ACEPTASUSCRIBIRELENVIODESUESTADODECUENTAALCORREOELECTRONICO.VALOR);
    this.mencionaAbonoMayor = tryFn(() => req.MENCIONOQUESIELABONOREALIZADOESMAYORALMONTOACORDADOSECURSARAELCONVENIOYLADIFERENCIASEABONARAASUCUENTA.VALOR);
    this.deudaAcuerdo = tryFn(() => req.DEUDAACUERDO.VALOR);
    this.plazo = tryFn(() => req.PLAZO.VALOR);
    this.valorCuota = tryFn(() => req.VALORCUOTA.VALOR);
    this.tasaInteres = tryFn(() => req.TASADEINTERES.VALOR);
    this.primerVencimiento = tryFn(() => req.PRIMERVENCIMIENTO.VALOR);
    this.impuesto = tryFn(() => req.IMPUESTO.VALOR);
    this.mencionaRebaja = tryFn(() => req.MENCIONOREBAJAENLACOMISIONDEADMINISTRACIONMANTENCION.VALOR);
    this.mencionaSeguro = tryFn(() => req.MENCIONOSEGUROSVIGENTES.VALOR);
    this.mencionaCargosPendientes = tryFn(() => req.MENCIONOCARGOSPENDIENTEDEFACTURACION.VALOR);
    this.mencionaDerechoRetracto = tryFn(() => req.MENCIONODERECHOARETRACTO.VALOR);
    this.mencionaDevolucionPie = tryFn(() => req.MENCIONONODEVOLUCIONDEPIE.VALOR);
    this.mencionaVolverMora = tryFn(() => req.MENCIONOVOLVERAAQUEDARENMORA.VALOR);
    this.siAcepto = tryFn(() => req.CLIENTEDIJOSIACEPTO.VALOR);
    this.nFolio = tryFn(() => req.NDEFOLIO.VALOR);
    this.despedida = tryFn(() => req.EJECUTIVOSEDESPIDECORPORATIVAMENTE.VALOR);
    this.montoPie = tryFn(() => req.MONTOPIE.VALOR);
    this.plazoPagoPie = tryFn(() => req.PLAZODELPAGODELPIE.VALOR);
    this.mencionaComision = tryFn(() => req.MENCIONOCOBROCOMISIONDEADMINISTRACIONMANTENCIONYSEGUROSVIGENTES.VALOR);
    this.mencionaTransaccion = tryFn(() => req.MENCIONOTRANSACCIONENUNACUOTA.VALOR);
    this.montoDescuento = tryFn(() => req.MONTODESCUENTO.VALOR);
    this.mencionaRefinanciamiento = tryFn(() => req.MENCIONOQUEDURANTESUREFINANCIAMIENTOSUTARJETAPRESTPESTARAHABILITADAPARACOMPRASSIEMPREQUETENGACUPODISPONIBLEPARAELLO.VALOR);
    this.mencionaRenegociacion = tryFn(() => req.MENCIONORENEGOCIACIONCONCIERREDECUENTA.VALOR);
    this.cupo = tryFn(() => req.CUPO.VALOR);
    this.mencionaBoletin = tryFn(() => req.MENCIONONOESTARENPUBLICADOENBOLETINCOMERCIALSN.VALOR);
    this.mencionaPagoOportuno = tryFn(() => req.MENCIONOELPAGOOPORTUNODELASPRIMERAS4CUOTASSN.VALOR);
    this.ciudadAperturaCuenta = tryFn(() => req.CIUDADAPERTURACUENTA.VALOR);
    this.direccionEnvio = tryFn(() => req.DIRECCIONDEENVIO.VALOR);
    this.capital = tryFn(() => req.CAPITAL.VALOR);
    this.interes = tryFn(() => req.INTERES.VALOR);
    this.gastoCobranza = tryFn(() => req.GASTODECOBRANZA.VALOR);
    this.descuento = tryFn(() => req.DESCUENTO.VALOR);
    this.pie = tryFn(() => req.PIE.VALOR);
    this.total = tryFn(() => req.TOTAL.VALOR);
    this.fechaPagoPie = tryFn(() => req.FECHAPAGOPIE.VALOR);
    this.informoPagoPie = tryFn(() => req.INFORMOACLIENTEQUESIPAGAPIEYACEPTAELACUERDODEPAGOSERAELIMINADODEDICOM.VALOR);
    this.informoPagoCuota = tryFn(() => req.INFORMOACLIENTEQUESIPAGAOPORTUNAMENTEALGUNADELASCUOTASSERANUEVAMENTEINFORMADOADICOM.VALOR);
  }
}

const tryFn = (fn, fallback = null) => {
  try {
    return fn();
  } catch (error) {
    return fallback;
  }
}

function wait() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("hello"), 10000)
  });
}

async function callLambda(parametros, id) {
  let functionName, payLoad;
  switch (id) {
    case 1:
      functionName = `0167_SSFF_toTextRut`;
      payLoad = `{ "rut": "${parametros}" }`;
      break;
    case 2:
      functionName = '0167_SSFF_toTextDate';
      payLoad = `{ "fecha": "${parametros}" }`;
      break;
    case 3:
      functionName = '0167_SSFF_toTextAmount';
      payLoad = `{ "monto": "${parametros}" }`;
      break;
    case 4:
      functionName = '0167_SSFF_toTextAddress';
      payLoad = `{ "direccion": "${parametros}" }`;
      break;
    case 5:
      functionName = '0167_SSFF_toTextAmounts';
      payLoad = `{ "monto": "${parametros}" }`;
      break;
    case 6:
      functionName = '0167_SSFF_toTextPercent';
      payLoad = `{ "porcentaje": "${parametros}" }`;
      break;
    case 7:
      functionName = '0167_SSFF_toTextNumber';
      payLoad = `{ "numero": "${parametros}" }`;
      break;
    case 8:
      functionName = '0167_SSFF_Carga_Texto';
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
  if (id === 8) return '[INFO] Iniciando Carga Texto';
  else return JSON.parse(traduccion.Payload).body.texto;
}