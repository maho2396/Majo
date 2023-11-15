function doGet(request) {
  var template = HtmlService.createTemplateFromFile('Principal'); 
  return template.evaluate()
    .setFaviconUrl('https://brand.airbus.com/themes/custom/airbus_web_experience_ui/appicons/appicon-120x120.png')
    .setTitle('Proyecto Majito');
};

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};

function getAccessType() {
  var correo_usuario = Session.getActiveUser().getEmail();
  var AccessType = {};

  var fc = new Date();
  var text_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
  var fc_actual = text_fc.substring(8, 10) + '/' + text_fc.substring(5, 7) + '/' + text_fc.substring(0, 4) + ' ' + text_fc.substring(11, 19);
  
  var id = SpreadsheetApp.openById("1DP7bYFZan2trbdum4tQSQLQKTrgcqMg5UoU0BCQPyMk");
  var ss = id.getSheetByName("Accesos");
  var data = ss.getRange(1, 1, ss.getRange("A1").getDataRegion().getLastRow(), ss.getLastColumn()).getValues();
  
  var List_correo               = data.map(function(r){ return r[0]; });
  var List_nombre_completo      = data.map(function(r){ return r[1]; });
  var List_nombre               = data.map(function(r){ return r[2]; });
  var List_registro             = data.map(function(r){ return r[3]; });
  var List_area                 = data.map(function(r){ return r[4]; });
  var List_unidad               = data.map(function(r){ return r[5]; });
  var List_equipo               = data.map(function(r){ return r[6]; });
  var List_acceso               = data.map(function(r){ return r[7]; });
  var List_ingresos             = data.map(function(r){ return r[8]; });
  var List_ultimo_acceso        = data.map(function(r){ return r[9]; });
  var List_acceso_proyecto      = data.map(function(r){ return r[10]; });

  var position = List_correo.indexOf(correo_usuario);
  
  if (position > -1) {
    AccessType.row                  = position;
    AccessType.correo               = List_correo[position];
    AccessType.nombre_completo      = List_nombre_completo[position];
    AccessType.nombre               = List_nombre[position];
    AccessType.registro             = List_registro[position];
    AccessType.area                 = List_area[position];
    AccessType.unidad               = List_unidad[position];
    AccessType.equipo               = List_equipo[position];
    AccessType.acceso               = List_acceso[position];
    
    var valor_anterior = ss.getRange(position + 1, 9).getValue();
    if (valor_anterior == "") {valor_anterior = 0}; 
    ss.getRange(position + 1, 9).setValue(valor_anterior + 1);

    ss.getRange(position + 1, 10).setValue(fc_actual);

    

    if (AccessType.acceso == ""){
      AccessType.acceso = "Acceso consulta";
      ss.getRange(position + 1, 8).setValue("Acceso consulta");
    }
    
  } else {
    AccessType.row             = "";
    AccessType.correo          = correo_usuario;
    AccessType.nombre_completo = "";
    AccessType.nombre          = "";
    AccessType.registro        = "";
    AccessType.unidad          = "";
    AccessType.area            = "";
    AccessType.equipo          = "";

    AccessType.acceso          = "Acceso consulta";

    ss.appendRow([correo_usuario,"","","","","","","Acceso consulta",1,fc_actual]);
    
  };
  return AccessType;
};










function saveFile(obj) {
  var folders = DriveApp.getRootFolder().getFolders();
  var folderid = obj.folder;
  var correo_usuario = Session.getActiveUser().getEmail();    
  var posicion = correo_usuario.search("@");    
  var usuario = correo_usuario.substring(0, posicion);

  var fc = new Date();
  var t_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
  var fc_actual  = t_fc.substring(0, 4) + ' ' + t_fc.substring(5, 7) + ' ' + t_fc.substring(8, 10) + ' ' + t_fc.substring(11, 13) + ' ' + t_fc.substring(14, 16) + ' ' + t_fc.substring(17, 19);

  obj.fileName = fc_actual + " " + obj.proceso + " " + usuario + " " + obj.fileName;
  var blob = Utilities.newBlob(Utilities.base64Decode(obj.data), obj.mimeType, obj.fileName); 

  var Transfolder = DriveApp.getFolderById(folderid);
  var archivo_cargado = Transfolder.createFile(blob);
  var InfFile = {};
  
  InfFile.id = archivo_cargado.getId();
  InfFile.url = archivo_cargado.getUrl();
  InfFile.downloadurl = archivo_cargado.getDownloadUrl();

  return InfFile;
}


function convertir_formato_comma(numero){
  if (numero.toString().trim() != "") {
    
    var numero = numero.toString().trim();
    var position_punto = numero.indexOf(".");
    var largo_numero = numero.length;
    if (position_punto != -1) {
      if (largo_numero - position_punto == 1) {
          numero = numero + "00";
        } else if (largo_numero - position_punto == 2) {
          numero = numero + "0";
        } else if (largo_numero - position_punto == 3) {
          numero = numero;
        }
    } else {
      numero = numero + ".00";
    }

    Logger.log("numero: " + numero);
    
    var position_punto = numero.indexOf(".");
    var enteros = numero.substr(0, position_punto);
    var decimales = numero.substr(position_punto + 1, numero.length);
    var nuevo_numero = "." + decimales;

    Logger.log("enteros: " + enteros);
    Logger.log("decimales: " + decimales);
    Logger.log("nuevo_numero: " + nuevo_numero);

    if (enteros.length > 3) {
      do {
        nuevo_numero = "," + enteros.substr(enteros.length - 3, enteros.length) + nuevo_numero;
        enteros = enteros.substr(0, enteros.length - 3);
      }
      while (enteros.length > 3);
      
    }
    numero = enteros + nuevo_numero;
  }
  
  return numero;
}



function contador_ingresos(Informacion) {

  var correo_usuario  = Session.getActiveUser().getEmail();
  var nombre_elemento = Informacion.nombre_elemento;

  var id = SpreadsheetApp.openById("1lxhbfI3GPywTcFtN_pdexWUg6StiPbJqzGjZLVO_qvk");
  var ss = id.getSheetByName("Base");

  var fc = new Date();
  var text_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
  var fc_actual = text_fc.substring(8, 10) + '/' + text_fc.substring(5, 7) + '/' + text_fc.substring(0, 4) + ' ' + text_fc.substring(11, 19);
  //var id_fecha = text_fc.substring(0, 4) + ' - ' + text_fc.substring(5, 7) + ' - ' + text_fc.substring(8, 10);
  var id_fecha = text_fc.substring(0, 4) + text_fc.substring(5, 7) + text_fc.substring(8, 10) + text_fc.substring(11, 13) + text_fc.substring(14, 16)+ text_fc.substring(17, 19);

  ss.appendRow(["ConIng" + id_fecha,fc_actual,correo_usuario,nombre_elemento]);


  return;
}
