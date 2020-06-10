const AWS = require("aws-sdk");
const s3 = new AWS.S3();
var dynamodb = new AWS.DynamoDB();

exports.handler = async (event, context) => {
  let srcBucket = event['srcBucket'];
  let srcKey = event['srcKey'];
  const varS3 = await getS3(srcBucket, srcKey)
  let auditoria = new Auditoria(varS3);
  let auditoriaPregunta = new AuditoriaPreguntas(varS3);
  let idAudio = auditoria.archivo;

  console.log(auditoria)
  console.log(auditoriaPregunta)

  await this.saveDataAudit(idAudio);

  for (var clave in auditoria) {
    if (auditoria.hasOwnProperty(clave)) {
      console.log("La clave es " + clave + " y el valor es " + auditoria[clave] + " la pregunta es " + auditoriaPregunta[clave]);
      await this.saveData(idAudio, clave, auditoria[clave], auditoriaPregunta[clave]);
    }
  }

  const response = {
    statusCode: 200,
  };
  return response;

}

async function getS3(srcBucket, srcKey) {
  let jsonObject;
  try {
    let params = {
      Bucket: srcBucket,
      Key: srcKey
    };
    let file = await s3.getObject(params).promise();
    jsonObject = JSON.parse(Buffer.from(JSON.parse(JSON.stringify(file.Body)).data).toString('utf8'));
    return jsonObject
  } catch (error) {
    console.log(`[WARN] ${error}`);
    return;
  }
}

module.exports.saveData = async (idAudio, pregunta, texto, preguntaOriginal) => {
  //console.log("IDAUDIO: "+idAudio+" PREGUNTA: "+pregunta+" TEXTO: "+ texto+ "PREGUNTAORIGINAL: "+preguntaOriginal)
  try {
    let params = {
      TableName: "ssff-comparacion",
      Item: {
        "id_audio": { "S": idAudio },
        "pregunta": { "S": pregunta },
        "texto": { "S": texto },
        "resultado": { "S": "null" },
        "preguntaOriginal": { "S": preguntaOriginal }
      }
    };
    return await dynamodb.putItem(params).promise();
  } catch (error) {
    console.log(`[WARN] ${error}`);
    return;
  }
};

module.exports.saveDataAudit = async (idAudio) => {
  try {
    let params = {
      TableName: "ssff-auditoria",
      Item: {
        "id_audio": { "S": idAudio },
        "auditado_bot": { "S": "NO" },
        "resultado_comp": { "S": "null" }
      }
    };
    return await dynamodb.putItem(params).promise();
  } catch (error) {
    console.log(`[WARN] ${error}`);
    return;
  }
};

class Auditoria {
  constructor(req) {
    req = req || undefined;
    this.archivo = tryFn(() => req.ARCHIVO.VALOR);
    this.nombre = tryFn(() => req.NOMBRE.VALOR);
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

class AuditoriaPreguntas {
  constructor(req) {
    req = req || undefined;
    this.archivo = tryFn(() => req.ARCHIVO.PREGUNTA);
    this.nombre = tryFn(() => req.NOMBRE.PREGUNTA);
    this.rut = tryFn(() => req.RUT.PREGUNTA);
    this.fechaNacimiento = tryFn(() => req.FECHADENACIMIENTO.PREGUNTA);
    this.adicionales = tryFn(() => req.ADICIONALES.PREGUNTA);
    this.direccionPostal = tryFn(() => req.DIRECCIONPOSTAL.PREGUNTA);
    this.aceptaSuscribirseCorreoElectronico = tryFn(() => req.ACEPTASUSCRIBIRELENVIODESUESTADODECUENTAALCORREOELECTRONICO.PREGUNTA);
    this.mencionaAbonoMayor = tryFn(() => req.MENCIONOQUESIELABONOREALIZADOESMAYORALMONTOACORDADOSECURSARAELCONVENIOYLADIFERENCIASEABONARAASUCUENTA.PREGUNTA);
    this.deudaAcuerdo = tryFn(() => req.DEUDAACUERDO.PREGUNTA);
    this.plazo = tryFn(() => req.PLAZO.PREGUNTA);
    this.valorCuota = tryFn(() => req.VALORCUOTA.PREGUNTA);
    this.tasaInteres = tryFn(() => req.TASADEINTERES.PREGUNTA);
    this.primerVencimiento = tryFn(() => req.PRIMERVENCIMIENTO.PREGUNTA);
    this.impuesto = tryFn(() => req.IMPUESTO.PREGUNTA);
    this.mencionaRebaja = tryFn(() => req.MENCIONOREBAJAENLACOMISIONDEADMINISTRACIONMANTENCION.PREGUNTA);
    this.mencionaSeguro = tryFn(() => req.MENCIONOSEGUROSVIGENTES.PREGUNTA);
    this.mencionaCargosPendientes = tryFn(() => req.MENCIONOCARGOSPENDIENTEDEFACTURACION.PREGUNTA);
    this.mencionaDerechoRetracto = tryFn(() => req.MENCIONODERECHOARETRACTO.PREGUNTA);
    this.mencionaDevolucionPie = tryFn(() => req.MENCIONONODEVOLUCIONDEPIE.PREGUNTA);
    this.mencionaVolverMora = tryFn(() => req.MENCIONOVOLVERAAQUEDARENMORA.PREGUNTA);
    this.siAcepto = tryFn(() => req.CLIENTEDIJOSIACEPTO.PREGUNTA);
    this.nFolio = tryFn(() => req.NDEFOLIO.PREGUNTA);
    this.despedida = tryFn(() => req.EJECUTIVOSEDESPIDECORPORATIVAMENTE.PREGUNTA);
    this.montoPie = tryFn(() => req.MONTOPIE.PREGUNTA);
    this.plazoPagoPie = tryFn(() => req.PLAZODELPAGODELPIE.PREGUNTA);
    this.mencionaComision = tryFn(() => req.MENCIONOCOBROCOMISIONDEADMINISTRACIONMANTENCIONYSEGUROSVIGENTES.PREGUNTA);
    this.mencionaTransaccion = tryFn(() => req.MENCIONOTRANSACCIONENUNACUOTA.PREGUNTA);
    this.montoDescuento = tryFn(() => req.MONTODESCUENTO.PREGUNTA);
    this.mencionaRefinanciamiento = tryFn(() => req.MENCIONOQUEDURANTESUREFINANCIAMIENTOSUTARJETAPRESTPESTARAHABILITADAPARACOMPRASSIEMPREQUETENGACUPODISPONIBLEPARAELLO.PREGUNTA);
    this.mencionaRenegociacion = tryFn(() => req.MENCIONORENEGOCIACIONCONCIERREDECUENTA.PREGUNTA);
    this.cupo = tryFn(() => req.CUPO.PREGUNTA);
    this.mencionaBoletin = tryFn(() => req.MENCIONONOESTARENPUBLICADOENBOLETINCOMERCIALSN.PREGUNTA);
    this.mencionaPagoOportuno = tryFn(() => req.MENCIONOELPAGOOPORTUNODELASPRIMERAS4CUOTASSN.PREGUNTA);
    this.ciudadAperturaCuenta = tryFn(() => req.CIUDADAPERTURACUENTA.PREGUNTA);
    this.direccionEnvio = tryFn(() => req.DIRECCIONDEENVIO.PREGUNTA);
    this.capital = tryFn(() => req.CAPITAL.PREGUNTA);
    this.interes = tryFn(() => req.INTERES.PREGUNTA);
    this.gastoCobranza = tryFn(() => req.GASTODECOBRANZA.PREGUNTA);
    this.descuento = tryFn(() => req.DESCUENTO.PREGUNTA);
    this.pie = tryFn(() => req.PIE.PREGUNTA);
    this.total = tryFn(() => req.TOTAL.PREGUNTA);
    this.fechaPagoPie = tryFn(() => req.FECHAPAGOPIE.PREGUNTA);
    this.informoPagoPie = tryFn(() => req.INFORMOACLIENTEQUESIPAGAPIEYACEPTAELACUERDODEPAGOSERAELIMINADODEDICOM.PREGUNTA);
    this.informoPagoCuota = tryFn(() => req.INFORMOACLIENTEQUESIPAGAOPORTUNAMENTEALGUNADELASCUOTASSERANUEVAMENTEINFORMADOADICOM.PREGUNTA);
  }
}

const tryFn = (fn, fallback = null) => {
  try {
    return fn();
  } catch (error) {
    return fallback;
  }
} 
