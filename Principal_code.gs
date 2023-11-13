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






function consultar_ciclo_actual(Informacion) {
  var id_inf = SpreadsheetApp.openById("1SkmLCWgAjVSf2hdtQwZKE47rffwU2XNDe_oBJHo9Zg4");
  var ss_inf = id_inf.getSheetByName("Información");

  Informacion.ciclo_actual = ss_inf.getRange(2, 3).getValue();
  return Informacion;
}


function getProjects(Informacion) {
  var id = SpreadsheetApp.openById("1SkmLCWgAjVSf2hdtQwZKE47rffwU2XNDe_oBJHo9Zg4");
  var ss = id.getSheetByName("Base");
  var data = ss.getRange(1, 1, ss.getRange("A1").getDataRegion().getLastRow(), ss.getLastColumn()).getValues();

  data.sort((a, b) => a[9].localeCompare(b[9])); //Ordenar según mvp
  data.sort((a, b) => a[8].localeCompare(b[8])); //Ordenar según epica
  data.sort((a, b) => b[10].localeCompare(a[10])); //Ordenar según tipo tarea
  data.sort((a, b) => a[6].localeCompare(b[6]));   //Ordenar según responsable
  data.sort((a, b) => a[5].localeCompare(b[5]));   //Ordenar según sprint

  var fc = new Date();
  var text_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
  var fc_actual = text_fc.substring(8, 10) + '/' + text_fc.substring(5, 7) + '/' + text_fc.substring(0, 4) + ' ' + text_fc.substring(11, 19);
  var id_fecha = text_fc.substring(0, 4) + ' - ' + text_fc.substring(5, 7) + ' - ' + text_fc.substring(8, 10);
  
  var mes_fecha = text_fc.substring(5, 7) * 1;
  var ano_fecha = text_fc.substring(0, 4) * 1;
  ano_fecha = ano_fecha.toString();

  var id_inf = SpreadsheetApp.openById("1SkmLCWgAjVSf2hdtQwZKE47rffwU2XNDe_oBJHo9Zg4");
  var ss_inf = id_inf.getSheetByName("Información");

  var sprint_actual = ss_inf.getRange(2, 3).getValue();

  var filtro_unidad        = Informacion.filtro_unidad;
  var filtro_area          = Informacion.filtro_area;
  var filtro_equipo        = Informacion.filtro_equipo;
  var filtro_responsable   = Informacion.filtro_responsable;
  var filtro_estado        = Informacion.filtro_estado;
  //var filtro_sprint      = Informacion.filtro_sprint;
  var filtro_sprint        = sprint_actual;
  var filtro_tipo_tarea    = Informacion.filtro_tipo_tarea;
  var filtro_subtipo_tarea = Informacion.filtro_subtipo_tarea;
  var filtro_proyecto      = Informacion.filtro_proyecto;

  Informacion.conjuntoUnidad = [];
  Informacion.conjuntoArea = [];
  Informacion.conjuntoServiceline = [];
  Informacion.conjuntoEquipo = [];
  Informacion.conjuntoResponsable = [];
  Informacion.conjuntoSprint = [];
  Informacion.conjuntoProyectos = [];

  Informacion.conjuntoSprint.push(sprint_actual);

  for (var i = 0; i < data.length; i++) {
    var id                   = data[i][0];   
    var unidad               = data[i][1];  
    var area                 = data[i][2];   
    var service_line         = data[i][3];   
    var equipo               = data[i][4];
    var sprint               = data[i][5];
    var responsable          = data[i][6];
    var correo               = data[i][7];
    var epica                = data[i][8];
    var mvp                  = data[i][9];
    var tipo_tarea           = data[i][10];
    var subtipo_tarea        = data[i][11];
    var estado               = data[i][12];
    var valor                = data[i][13];
    var bitacora             = data[i][14];
    var fecha_ingreso        = data[i][15];
    var fecha_actualizacion  = data[i][16];
    var fecha_limite         = data[i][17];
    var prioridad_alta       = data[i][18];
    var planificacion        = data[i][19];
    var sub_unidad_atendida  = data[i][20];
    var fecha_cierre         = data[i][21];
    var dias_estimados       = data[i][22];
    var dias_atencion        = data[i][23];
    var dependencia          = data[i][24];

        
    var validar = true;

    if (id == "ID"){validar = false;}
    if (estado == "Cancelado" || estado == "Backlog"){validar = false;}

    if (filtro_unidad == ""){} else { 
      if (unidad.toUpperCase().indexOf(filtro_unidad.toUpperCase()) > -1) {}else{validar = false;} 
    };
    if (filtro_area == ""){} else { 
      if (area.toUpperCase().indexOf(filtro_area.toUpperCase()) > -1) {}else{validar = false;} 
    };
    if (filtro_equipo == ""){} else { 
      if (equipo.toUpperCase().indexOf(filtro_equipo.toUpperCase()) > -1) {}else{validar = false;} 
    };
    if (filtro_responsable == ""){} else { 
      if (responsable.toUpperCase().indexOf(filtro_responsable.toUpperCase()) > -1) {}else{validar = false;} 
    };
    if (filtro_estado == ""){} else { 
      if (filtro_estado == "En atención"){
        if (estado == "Done") {validar = false;} 
      }else{
        if (estado.toUpperCase() == filtro_estado.toUpperCase()) {}else{validar = false;} 
      }
    };
    if (filtro_sprint == ""){} else { 
      if (sprint.toString().toUpperCase().indexOf(filtro_sprint.toString().toUpperCase()) > -1) {}else{validar = false;} 
    };
    if (filtro_tipo_tarea == ""){} else { 
      if (tipo_tarea.toUpperCase().indexOf(filtro_tipo_tarea.toUpperCase()) > -1) {}else{validar = false;} 
    };
    if (filtro_subtipo_tarea == ""){} else { 
      if (subtipo_tarea.toUpperCase().indexOf(filtro_subtipo_tarea.toUpperCase()) > -1) {}else{validar = false;} 
    };

    if (filtro_proyecto == ""){} else { 
      if (epica.toUpperCase().indexOf(filtro_proyecto.toUpperCase()) > -1) {}else{validar = false;} 
    };

    if (id != "ID") {
      var validar_sprint = Informacion.conjuntoSprint.includes(sprint);
      if (validar_sprint == false) {
        Informacion.conjuntoSprint.push(sprint);
      }
    }




    var validar_responsable = Informacion.conjuntoResponsable.includes(responsable);
    if (validar_responsable == false) {
      Informacion.conjuntoResponsable.push(responsable);
    }
    

    if (validar == true) {

      

      var validar_unidad = Informacion.conjuntoUnidad.includes(unidad);
      if (validar_unidad == false) {
        Informacion.conjuntoUnidad.push(unidad);
      }
      var validar_area = Informacion.conjuntoArea.includes(area);
      if (validar_area == false) {
        Informacion.conjuntoArea.push(area);
      }
      var validar_service_line = Informacion.conjuntoServiceline.includes(service_line);
      if (validar_service_line == false) {
        Informacion.conjuntoServiceline.push(service_line);
      }
      var validar_equipo = Informacion.conjuntoEquipo.includes(equipo);
      if (validar_equipo == false) {
        Informacion.conjuntoEquipo.push(equipo);
      }

      var validar_epica = Informacion.conjuntoProyectos.includes(epica);
      if (validar_epica == false) {
        Informacion.conjuntoProyectos.push(epica);
      }
    }

  }

  return Informacion;

}




function consolidar_informacion_burndown(){

  var id = SpreadsheetApp.openById("1SkmLCWgAjVSf2hdtQwZKE47rffwU2XNDe_oBJHo9Zg4");
  var ss = id.getSheetByName("Base");
  var data = ss.getRange(1, 1, ss.getRange("A1").getDataRegion().getLastRow(), ss.getLastColumn()).getValues();
  var ss_burndown = id.getSheetByName("Burndown");
  var data_burndown = ss_burndown.getRange(1, 1, ss_burndown.getRange("A1").getDataRegion().getLastRow(), ss_burndown.getLastColumn()).getValues();

  data.sort((a, b) => a[9].localeCompare(b[9])); //Ordenar según mvp
  data.sort((a, b) => a[8].localeCompare(b[8])); //Ordenar según epica
  data.sort((a, b) => b[10].localeCompare(a[10])); //Ordenar según tipo tarea
  data.sort((a, b) => a[6].localeCompare(b[6]));   //Ordenar según responsable
  data.sort((a, b) => a[5].localeCompare(b[5]));   //Ordenar según sprint

  var fc = new Date();
  var numeroDia = new Date().getDay();

  Logger.log('numeroDia' + numeroDia);

  if (numeroDia == 1 ||
      numeroDia == 2 ||
      numeroDia == 3 ||
      numeroDia == 4 ||
      numeroDia == 5) {
    var text_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
    var fc_actual = text_fc.substring(8, 10) + '/' + text_fc.substring(5, 7) + '/' + text_fc.substring(0, 4) + ' ' + text_fc.substring(11, 19);
    //var id_fecha = text_fc.substring(0, 4) + ' - ' + text_fc.substring(5, 7) + ' - ' + text_fc.substring(8, 10);
    var id_fecha = text_fc.substring(0, 4) + text_fc.substring(5, 7) + text_fc.substring(8, 10) + text_fc.substring(11, 13) + text_fc.substring(14, 16)+ text_fc.substring(17, 19);
    var fc_actual_hm = text_fc.substring(8, 10) + '/' + text_fc.substring(5, 7) + '/' + text_fc.substring(0, 4) + ' ' + text_fc.substring(11, 16);

    var dia_fecha = text_fc.substring(8, 10) * 1;
    var mes_fecha = text_fc.substring(5, 7) * 1;
    var ano_fecha = text_fc.substring(0, 4) * 1;
    dia_fecha = dia_fecha.toString();
    ano_fecha = ano_fecha.toString();

    if (mes_fecha == 1){mes_fecha = "01";};
    if (mes_fecha == 2){mes_fecha = "02";};
    if (mes_fecha == 3){mes_fecha = "03";};
    if (mes_fecha == 4){mes_fecha = "04";};
    if (mes_fecha == 5){mes_fecha = "05";};
    if (mes_fecha == 6){mes_fecha = "06";};
    if (mes_fecha == 7){mes_fecha = "07";};
    if (mes_fecha == 8){mes_fecha = "08";};
    if (mes_fecha == 9){mes_fecha = "09";};
    if (mes_fecha == 10){mes_fecha = "10";};
    if (mes_fecha == 11){mes_fecha = "11";};
    if (mes_fecha == 12){mes_fecha = "12";};

    if (dia_fecha.length == 1) {dia_fecha =  "0" + dia_fecha;}

    var sprint_actual = ano_fecha + " " + mes_fecha + " " + dia_fecha;
    
    var id_inf = SpreadsheetApp.openById("1SkmLCWgAjVSf2hdtQwZKE47rffwU2XNDe_oBJHo9Zg4");
    var ss_inf = id_inf.getSheetByName("Información");
    var sprint_actual = ss_inf.getRange(2, 3).getValue();

    var Informacion = {};

    Informacion.conjuntoUnidad = [];
    Informacion.conjuntoArea = [];
    Informacion.conjuntoServiceline = [];
    Informacion.conjuntoEquipo = [];
    Informacion.conjuntoSprint = [];

    for (var i = 0; i < data.length; i++) {
      var id                   = data[i][0];   
      var unidad               = data[i][1];  
      var area                 = data[i][2];   
      var service_line         = data[i][3];   
      var equipo               = data[i][4];
      var sprint               = data[i][5];
      var responsable          = data[i][6];
      var correo               = data[i][7];
      var epica                = data[i][8];
      var mvp                  = data[i][9];
      var tipo_tarea           = data[i][10];
      var subtipo_tarea        = data[i][11];
      var estado               = data[i][12];
      var valor                = data[i][13];
      var bitacora             = data[i][14];
      var fecha_ingreso        = data[i][15];
      var fecha_actualizacion  = data[i][16];
      var fecha_limite         = data[i][17];
      var prioridad_alta       = data[i][18];
      var planificacion        = data[i][19];
      var sub_unidad_atendida  = data[i][20];
      var fecha_cierre         = data[i][21];
      var dias_estimados       = data[i][22];
      var dias_atencion        = data[i][23];
      var dependencia          = data[i][24];


      var validar = true;
      if (id == "ID") {validar = false;}

      if (validar == true) {
        var validar_unidad = Informacion.conjuntoUnidad.includes(unidad);
        if (validar_unidad == false) {
          Informacion.conjuntoUnidad.push(unidad);
        };
        var validar_area = Informacion.conjuntoArea.includes(area);
        if (validar_area == false) {
          Informacion.conjuntoArea.push(area);
        };
        var validar_service_line = Informacion.conjuntoServiceline.includes(service_line);
        if (validar_service_line == false) {
          Informacion.conjuntoServiceline.push(service_line);
        };
        var validar_equipo = Informacion.conjuntoEquipo.includes(equipo);
        if (validar_equipo == false) {
          Informacion.conjuntoEquipo.push(equipo);
        };
        var validar_sprint = Informacion.conjuntoSprint.includes(sprint);
        if (validar_sprint == false) {
          Informacion.conjuntoSprint.push(sprint);
        };
      }

    }

    var contador = 0; 

    for (var u = 0; u < Informacion.conjuntoEquipo.length; u++) {
      var equipo_seleccionado = Informacion.conjuntoEquipo[u];

      if (equipo_seleccionado == "Risk Transformation") {
        var valor_unidad = "";
        var valor_area = "";
        var valor_service_line = "";
        var valor_equipo = "";
        var valor_sprint = "";

        var mvps_comprometidos = 0;
        var mvps_terminados = 0;
        var mvps_pendientes = 0;
        var mvps_no_iniciado = 0;
        var mvps_bloqueados = 0;
        
        for (var i = 0; i < data.length; i++) {
          var id                   = data[i][0];   
          var unidad               = data[i][1];  
          var area                 = data[i][2];   
          var service_line         = data[i][3];   
          var equipo               = data[i][4];
          var sprint               = data[i][5];
          var responsable          = data[i][6];
          var correo               = data[i][7];
          var epica                = data[i][8];
          var mvp                  = data[i][9];
          var tipo_tarea           = data[i][10];
          var subtipo_tarea        = data[i][11];
          var estado               = data[i][12];
          var valor                = data[i][13];
          var bitacora             = data[i][14];
          var fecha_ingreso        = data[i][15];
          var fecha_actualizacion  = data[i][16];
          var fecha_limite         = data[i][17];
          var prioridad_alta       = data[i][18];
          var planificacion        = data[i][19];
          var sub_unidad_atendida  = data[i][20];
          var fecha_cierre         = data[i][21];
          var dias_estimados       = data[i][22];
          var dias_atencion        = data[i][23];
              
          var validar = true;

          if (id == "ID"){validar = false;}
          if (estado == "Cancelado" || estado == "Backlog"){validar = false;}
          if (equipo_seleccionado != equipo){validar = false;}
          if (sprint != sprint_actual){validar = false;}

          if (validar == true) {
            mvps_comprometidos = mvps_comprometidos + 1;
            if (estado == "To Do"){mvps_no_iniciado = mvps_no_iniciado + 1};
            if (estado == "Doing"){mvps_pendientes = mvps_pendientes + 1};
            if (estado == "Done"){mvps_terminados = mvps_terminados + 1};
            if (estado == "Stopper"){mvps_bloqueados = mvps_bloqueados + 1};

            var valor_unidad = unidad;
            var valor_area = area;
            var valor_service_line = service_line;
            var valor_equipo = equipo;
            var valor_sprint = sprint;
            

          }

        }

        Logger.log("equipo_seleccionado: " + equipo_seleccionado + " - " + sprint_actual + " - " + fc_actual);
        Logger.log("mvps_comprometidos: " + mvps_comprometidos);
        Logger.log("mvps_no_iniciado: " + mvps_no_iniciado);
        Logger.log("mvps_pendientes: " + mvps_pendientes);
        Logger.log("mvps_terminados: " + mvps_terminados);
        Logger.log("mvps_bloqueados: " + mvps_bloqueados);

        ss_burndown.appendRow(["SpBurndown" + id_fecha + contador,valor_unidad,valor_area,valor_service_line,valor_equipo,"'" + valor_sprint,
                              fc_actual,"'" + mes_fecha + " - " + dia_fecha,
                              mvps_comprometidos,mvps_no_iniciado,mvps_pendientes,mvps_terminados,mvps_bloqueados]);

        contador = contador + 1;         

      }

                    

    }




  }


  return Informacion;
}






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


function consultar_inicio_noticias() {

  var Informacion = {};

  var fc = new Date();
  var text_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
  var fc_actual = text_fc.substring(8, 10) + '/' + text_fc.substring(5, 7) + '/' + text_fc.substring(0, 4) + ' ' + text_fc.substring(11, 19);
  var id_fecha = text_fc.substring(0, 4) + ' - ' + text_fc.substring(5, 7) + ' - ' + text_fc.substring(8, 10);

  var id = SpreadsheetApp.openById("10Qa2klx-vfaBQDuk9fTWxG50oWwzmoD1t8vt5ynbpsQ");
  var ss = id.getSheetByName("Base");
  var data = ss.getRange(1, 1, ss.getRange("A1").getDataRegion().getLastRow(), ss.getLastColumn()).getValues();

  var noticia_indicadores = "";
  var noticia_items = "";
  var noticia_contador = 0;

  //conjuntoNoticias.push("");

  for (var i = 0; i < data.length; i++) {

    var id        = data[i][0];
    var estado    = data[i][1];
    var tema      = data[i][2];
    var enlace    = data[i][3];
    var imagen    = data[i][4];
    var titulo    = data[i][5];
    var subtitulo = data[i][6];
    
    var validar = true;

    if (estado != "Activo"){validar = false;}
    if (tema == "Tema"){validar = false;}

    if (validar == true) {

      Logger.log("tema: " + tema);

      if (noticia_indicadores == ""){
        noticia_indicadores = noticia_indicadores + 
        '<li data-target="#carouselExampleIndicators" data-slide-to="' + noticia_contador + '" style="cursor: pointer;" class="active"></li>';
        
        noticia_items = noticia_items +
        '<div class="carousel-item active"' +
        '      style = "cursor: pointer;"' +
        '      onclick="contador_ingresos(' + "'" + tema + "'" + ');cargar_pagina_web_libre(' + "'" + enlace + "'" + ')">' +
        '  <img class="d-block w-100 fondo_imagen_carrusel" style = "background-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(' + "'" + imagen + "'" + ');">' +
        '  <div class="carousel-caption d-none d-md-block">' +
        '    <h4 style = "color:white;text-align:center;font-family:' + "'Lato'" + ', sans-serif;text-shadow: 1px 1px 5px black;font-size:30px;">' + titulo + '</h4>' +
        '    <p style = "color:white;text-align:center;font-family:' + "'Lato'" + ', sans-serif;text-shadow: 1px 1px 5px black;font-size:16px;">' + subtitulo + '</p>' +
        '  </div>' +
        '</div>';
        
        noticia_contador = noticia_contador + 1;

      } else {
        noticia_indicadores = noticia_indicadores +
        '<li data-target="#carouselExampleIndicators" data-slide-to="' + noticia_contador + '" style="cursor: pointer;"></li>';

        noticia_items = noticia_items +
        '<div class="carousel-item"' +
        '      style = "cursor: pointer;"' +
        '      onclick="contador_ingresos(' + "'" + tema + "'" + ');cargar_pagina_web_libre(' + "'" + enlace + "'" + ')">' +
        '  <img class="d-block w-100 fondo_imagen_carrusel" style = "background-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(' + "'" + imagen + "'" + ');">' +
        '  <div class="carousel-caption d-none d-md-block">' +
        '    <h4 style = "color:white;text-align:center;font-family:' + "'Lato'" + ', sans-serif;text-shadow: 1px 1px 5px black;font-size:30px;">' + titulo + '</h4>' +
        '    <p style = "color:white;text-align:center;font-family:' + "'Lato'" + ', sans-serif;text-shadow: 1px 1px 5px black;font-size:16px;">' + subtitulo + '</p>' +
        '  </div>' +
        '</div>';

        noticia_contador = noticia_contador + 1;
      }




    } 
  }

  Logger.log("noticia_indicadores: " + noticia_indicadores);
  Logger.log("noticia_items: " + noticia_items);

  
  Informacion.noticia_indicadores = noticia_indicadores;
  Informacion.noticia_items = noticia_items; 

  return Informacion;
  
};


