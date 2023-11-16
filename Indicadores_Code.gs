function consultar_indicadores_drive(Informacion) {

  var filtro_nombre       = Informacion.filtro_nombre;
  var filtro_correo       = Informacion.filtro_correo;
  var filtro_carro        = Informacion.filtro_carro;

  var filtro_fecha_inicio = Informacion.filtro_fecha_inicio;
  var filtro_fecha_fin    = Informacion.filtro_fecha_fin;

  var pw_equipo           = Informacion.pw_equipo;
  var pw_area             = Informacion.pw_area;
  var pw_unidad           = Informacion.pw_unidad;
  var pw_acceso           = Informacion.pw_acceso;

  var fc = new Date();
  var text_fc = Utilities.formatDate(fc, "GMT1", "yyyy-MM-dd' 'HH:mm:ss' '");
  var fc_actual = text_fc.substring(8, 10) + '/' + text_fc.substring(5, 7) + '/' + text_fc.substring(0, 4) + ' ' + text_fc.substring(11, 19);
  var id_fecha = text_fc.substring(0, 4) + ' - ' + text_fc.substring(5, 7) + ' - ' + text_fc.substring(8, 10);

  var id = SpreadsheetApp.openById("1PKqc-p7DuQ1-yEy-0mloQiIlbIa8MTQwHEqvOfelbas");
  var ss = id.getSheetByName("Base");
  var data = ss.getRange(1, 1, ss.getRange("A1").getDataRegion().getLastRow(), ss.getLastColumn()).getValues();

  data.sort((a, b) => a[2].localeCompare(b[2])); //Ordenar según nombre

  Informacion.tabla_consulta = '' +
  '<table>' + 
  '  <tr>' + 
  '    <th>Fecha registro</th>' + 
  '    <th>Correo</th>' + 
  '    <th>Nombre</th>' + 
  '    <th>Dirección</th>' + 
  '    <th>Carro</th>' + 
  '    <th>Capacidad</th>' + 
  '    <th style = "width:10px;"></th>' + 
  '  </tr>' +
  '  <tr>' + 
  '  </tr>';

  var conjuntoNombres = [];
  var conjuntoCorreos = [];
  var conjuntoCarros = [];

  conjuntoCarros.push("Nissan");

  var contador_total = 0;
  var capacidad_total = 0;

  for (var i = 0; i < data.length; i++) {
     
    var fecha_registro      = data[i][0];
    var correo              = data[i][1];
    var nombre              = data[i][2];
    var direccion           = data[i][3];
    var carro               = data[i][4];
    var capacidad           = data[i][5];
    
    var validar = true;

    //Alimenta los filtros
    if (fecha_registro == "Timestamp") {
      validar = false;
    } else {
      if (conjuntoNombres.includes(nombre) == false) {
        conjuntoNombres.push(nombre);
      }
      if (conjuntoCorreos.includes(correo) == false) {
        conjuntoCorreos.push(correo);
      }
      if (conjuntoCarros.includes(carro) == false) {
        conjuntoCarros.push(carro);
      }
    }
    


    if (filtro_nombre != ""){ 
      if (nombre.toString().toUpperCase().indexOf(filtro_nombre.toString().toUpperCase()) == -1) { 
        validar = false;
      } 
    };
    if (filtro_correo != ""){ 
      if (correo.toString().toUpperCase().indexOf(filtro_correo.toString().toUpperCase()) == -1) { 
        validar = false;
      } 
    };
    if (filtro_carro != ""){ 
      if (carro.toString().toUpperCase().indexOf(filtro_carro.toString().toUpperCase()) == -1) { 
        validar = false;
      } 
    };

    if (filtro_fecha_inicio != "") {
      if (fecha_registro == "") {
        validar = false;
      } else {
        var fecha_inicio_time = new Date(filtro_fecha_inicio).getTime();
        var fecha_fin_time    = new Date(fecha_registro).getTime();
        
        var diff = fecha_fin_time - fecha_inicio_time;
        var diff = diff / (1000*60*60*24);// (1000*60*60*24) --> milisegundos -> segundos -> minutos -> horas -> días

        if (diff <= 0) {validar = false;}
      }
    }

    if (filtro_fecha_fin != "") {
      if (fecha_registro == "") {
        validar = false;
      } else {
        var fecha_fin_time    = new Date(filtro_fecha_fin).getTime();
        var fecha_inicio_time = new Date(fecha_registro).getTime();
        
        var diff = fecha_fin_time - fecha_inicio_time;
        var diff = diff / (1000*60*60*24);// (1000*60*60*24) --> milisegundos -> segundos -> minutos -> horas -> días

        if (diff + 1 < 0) {validar = false;}
      }
    }

    if (validar == true) {
      
      capacidad_total = (capacidad_total * 1) + (capacidad * 1);

      if (fecha_registro != "") {
        var fc = new Date(fecha_registro);
        var text_fc = Utilities.formatDate(fc, "GMT1", "yyyy-MM-dd' 'HH:mm:ss' '");
        var fecha_registro = text_fc.substring(8, 10) +'/'+ text_fc.substring(5, 7) +'/'+ text_fc.substring(0, 4);
      }; 

      Informacion.tabla_consulta = Informacion.tabla_consulta +
      '<tr>' +
      '  <td>' + fecha_registro + '</td>' +
      '  <td>' + correo + '</td>' +
      '  <td>' + nombre + '</td>' +
      '  <td>' + direccion + '</td>' +
      '  <td>' + carro + '</td>' +
      '  <td>' + capacidad + '</td>' +
      '  <td></td>';
      
      /*
      '  <td>' + 
      '    <div class = "informativo_pequeno_gris_boton col-lg-aut col-md-aut col-sm-aut col-xs-aut"' +
      '         onclick = "mostrar_ocultar_fila_tabla(' + "'fila_indicadores_" + id + "'" + ')"' + 
      '         title = "Ver detalle" style = "cursor: pointer;margin: 3px 0px 3px 0px;">' + 
      '      <i class="material-icons" style = "font-size:18px;padding: 0px">unfold_more</i>' +
      '    </div>' +
      '  </td>';
      */

      contador_total = contador_total + 1;

    } 
  }

  conjuntoNombres.sort();
  conjuntoCorreos.sort();
  conjuntoCarros.sort();
  

  var opciones_nombres = ""
  for (var u = 0; u < conjuntoNombres.length; u++) {
    opciones_nombres = opciones_nombres + '<option value="' + conjuntoNombres[u] + '">';
  }
  var opciones_correos = ""
  for (var u = 0; u < conjuntoCorreos.length; u++) {
    opciones_correos = opciones_correos + '<option value="' + conjuntoCorreos[u] + '">';
  }
  var opciones_carros = ""
  for (var u = 0; u < conjuntoCarros.length; u++) {
    opciones_carros = opciones_carros + '<option value="' + conjuntoCarros[u] + '">';
  }
  
  
  Informacion.opciones_nombres = opciones_nombres;
  Informacion.opciones_correos = opciones_correos;
  Informacion.opciones_carros = opciones_carros;

  Informacion.tabla_consulta = Informacion.tabla_consulta + '</table>';

  capacidad_total = (Math.round(capacidad_total * 10000))/10000;
  capacidad_total = capacidad_total * 100;
  capacidad_total = capacidad_total + " %"; 

  Informacion.tabla_consulta = "Total capacidad: " + capacidad_total + "<br><br>" + Informacion.tabla_consulta;

  return Informacion;
};



function modificar_indicadores(Informacion) {

  var fc = new Date();
  var text_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
  var fc_actual = text_fc.substring(8, 10) + '/' + text_fc.substring(5, 7) + '/' + text_fc.substring(0, 4) + ' ' + text_fc.substring(11, 19);
  var id_fecha = text_fc.substring(0, 4) + ' - ' + text_fc.substring(5, 7) + ' - ' + text_fc.substring(8, 10);

  var id_consulta     = Informacion.id; 
  var pw_usuario      = Informacion.pw_usuario; 

  var pw_equipo       = Informacion.pw_equipo; 
  var pw_area         = Informacion.pw_area; 
  var pw_unidad       = Informacion.pw_unidad; 

  var correo_usuario  = Session.getActiveUser().getEmail();
  
  var conjuntoAreas = [];
  var conjuntoUnidades = [];
  var conjuntoEquipos = [];
  var conjuntoResponsables = [];
  var conjuntoNombres = [];
  var conjuntoTiposRecursos = [];

  conjuntoAreas.push("Riesgos");
  conjuntoUnidades.push("Retail Credit");
  conjuntoUnidades.push("Wholesale Credit");
  conjuntoUnidades.push("Collection, Mitigation & Workout");
  conjuntoUnidades.push("Non Financial Risk");
  conjuntoUnidades.push("Risk Transformation");
  conjuntoUnidades.push("Portfolio Management, Data & Reporting");
  conjuntoUnidades.push("Market, Structural & Fiduciary Risk");
  conjuntoUnidades.push("Risk Internal Control");
  conjuntoUnidades.push("Risk Solution Group");

  var id = SpreadsheetApp.openById("17aal0VWKR_q7jUDjNhzPFH_ihpUDXGLeue-cSspJ_T4");
  var ss = id.getSheetByName("Base");
  var data = ss.getRange(1, 1, ss.getRange("A1").getDataRegion().getLastRow(), ss.getLastColumn()).getValues();

  for (var i = 0; i < data.length; i++) {
     
    var id                   = data[i][0];
    var estado               = data[i][1];
    var area                 = data[i][2];
    var unidad               = data[i][3];
    var equipo               = data[i][4];
    var nombre               = data[i][5];
    var descripcion          = data[i][6];
    var fecha_creacion       = data[i][7];
    var fecha_modificacion   = data[i][8];
    var responsable          = data[i][9];
    var tipo_recurso         = data[i][10];
    var link_carpeta         = data[i][11];
    var link_ppt             = data[i][12];
    var link_excel           = data[i][13];
    var link_tablero         = data[i][14];
    var link_documento       = data[i][15];
    var link_video           = data[i][16];
    var link_site            = data[i][17];

    var validar = true;

    if (id == "ID" || estado == "Backlog" || estado == "Cancelado" || estado == "Apagado" || estado == "Proximamente"){
      validar = false;
    } else {
      if (conjuntoAreas.includes(area) == false) {
        conjuntoAreas.push(area);
      }
      if (conjuntoUnidades.includes(unidad) == false) {
        conjuntoUnidades.push(unidad);
      }
      if (conjuntoEquipos.includes(equipo) == false) {
        conjuntoEquipos.push(equipo);
      }
      if (conjuntoResponsables.includes(responsable) == false) {
        conjuntoResponsables.push(responsable);
      }
      if (conjuntoNombres.includes(nombre) == false) {
        conjuntoNombres.push(nombre);
      }
      if (conjuntoTiposRecursos.includes(tipo_recurso) == false) {
        conjuntoTiposRecursos.push(tipo_recurso);
      }

    }
  }

  conjuntoAreas.sort();
  conjuntoUnidades.sort();
  conjuntoEquipos.sort();
  conjuntoResponsables.sort();
  conjuntoNombres.sort();
  conjuntoTiposRecursos.sort();

  var opciones_areas = ""
  for (var u = 0; u < conjuntoAreas.length; u++) {
    opciones_areas = opciones_areas + '<option value="' + conjuntoAreas[u] + '">';
  }
  var opciones_unidades = ""
  for (var u = 0; u < conjuntoUnidades.length; u++) {
    opciones_unidades = opciones_unidades + '<option value="' + conjuntoUnidades[u] + '">';
  }
  var opciones_equipos = ""
  for (var u = 0; u < conjuntoEquipos.length; u++) {
    opciones_equipos = opciones_equipos + '<option value="' + conjuntoEquipos[u] + '">';
  }
  var opciones_responsables = ""
  for (var u = 0; u < conjuntoResponsables.length; u++) {
    opciones_responsables = opciones_responsables + '<option value="' + conjuntoResponsables[u] + '">';
  }
  var opciones_nombres = ""
  for (var u = 0; u < conjuntoNombres.length; u++) {
    opciones_nombres = opciones_nombres + '<option value="' + conjuntoNombres[u] + '">';
  }
  var opciones_tipos_recursos = ""
  for (var u = 0; u < conjuntoTiposRecursos.length; u++) {
    opciones_tipos_recursos = opciones_tipos_recursos + '<option value="' + conjuntoTiposRecursos[u] + '">';
  }
 
  var id = SpreadsheetApp.openById("17aal0VWKR_q7jUDjNhzPFH_ihpUDXGLeue-cSspJ_T4");
  var ss = id.getSheetByName("Base");
  var data = ss.getRange(1, 1, ss.getRange("A1").getDataRegion().getLastRow(), ss.getLastColumn()).getValues();

  var Array_id                       = data.map(function(r){ return r[0]; });
  var Array_estado                   = data.map(function(r){ return r[1]; });
  var Array_area                     = data.map(function(r){ return r[2]; });
  var Array_unidad                   = data.map(function(r){ return r[3]; });
  var Array_equipo                   = data.map(function(r){ return r[4]; });
  var Array_nombre                   = data.map(function(r){ return r[5]; });
  var Array_descripcion              = data.map(function(r){ return r[6]; });
  var Array_fecha_creacion           = data.map(function(r){ return r[7]; });
  var Array_fecha_modificacion       = data.map(function(r){ return r[8]; });
  var Array_responsable              = data.map(function(r){ return r[9]; });
  var Array_tipo_recurso             = data.map(function(r){ return r[10]; });
  var Array_link_carpeta             = data.map(function(r){ return r[11]; });
  var Array_link_ppt                 = data.map(function(r){ return r[12]; });
  var Array_link_excel               = data.map(function(r){ return r[13]; });
  var Array_link_tablero             = data.map(function(r){ return r[14]; });
  var Array_link_documento           = data.map(function(r){ return r[15]; });
  var Array_link_video               = data.map(function(r){ return r[16]; });
  var Array_link_site                = data.map(function(r){ return r[17]; });


  var valor_id                   = "";
  var valor_estado               = "";
  var valor_area                 = "";
  var valor_unidad               = "";
  var valor_equipo               = "";
  var valor_nombre               = "";
  var valor_descripcion          = "";
  var valor_fecha_creacion       = "";
  var valor_fecha_modificacion   = "";
  var valor_responsable          = "";
  var valor_tipo_recurso         = "";
  var valor_link_carpeta         = "";
  var valor_link_ppt             = "";
  var valor_link_excel           = "";
  var valor_link_tablero         = "";
  var valor_link_documento       = "";
  var valor_link_video           = "";
  var valor_link_site            = "";
  
  var opcion_eliminar            = "";

  if (id_consulta != ""){

    var position = Array_id.indexOf(id_consulta);
    if (position > -1) {

      var valor_id                   = Array_id[position];
      var valor_estado               = Array_estado[position];
      var valor_area                 = Array_area[position];
      var valor_unidad               = Array_unidad[position];
      var valor_equipo               = Array_equipo[position];
      var valor_nombre               = Array_nombre[position];
      var valor_descripcion          = Array_descripcion[position];
      var valor_fecha_creacion       = Array_fecha_creacion[position];
      var valor_fecha_modificacion   = Array_fecha_modificacion[position];
      var valor_responsable          = Array_responsable[position];
      var valor_tipo_recurso         = Array_tipo_recurso[position];
      var valor_link_carpeta         = Array_link_carpeta[position];
      var valor_link_ppt             = Array_link_ppt[position];
      var valor_link_excel           = Array_link_excel[position];
      var valor_link_tablero         = Array_link_tablero[position];
      var valor_link_documento       = Array_link_documento[position];
      var valor_link_video           = Array_link_video[position];
      var valor_link_site            = Array_link_site[position];

      if (valor_fecha_creacion != "") {
        var fc = new Date(valor_fecha_creacion);
        var text_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
        valor_fecha_creacion = text_fc.substring(0, 4) + "-" + text_fc.substring(5, 7) + "-" + text_fc.substring(8, 10);
      };

      if (valor_fecha_modificacion != "") {
        var fc = new Date(valor_fecha_modificacion);
        var text_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
        valor_fecha_modificacion = text_fc.substring(0, 4) + "-" + text_fc.substring(5, 7) + "-" + text_fc.substring(8, 10);
      };

      var opcion_eliminar = '' + 
      '        <div class="col-lg-aut col-md-aut col-sm-aut col-xs-aut" style = "padding: 10px 30px 10px 0px;">' +
      '          <button onclick = "eliminar_indicadores();"' + 
      '                  class = "button_red texto_centrado" style = "border-radius: 4px 4px 4px 4px;padding: 0px;">' +
      '            <i class="material-icons" style = "font-size:18px;padding: 10px 5px 10px 15px;">cancel</i>' +
      '            <b style = "padding: 10px 20px 15px 5px;">Eliminar</b>' +
      '          </button>' +
      '        </div>';


      

    } else {
      var valor_id = "Error: No se encontró el ID";

    };

  } else {
    var fc = new Date();
    var text_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
    valor_fecha_inicio = text_fc.substring(0, 4) + "-" + text_fc.substring(5, 7) + "-" + text_fc.substring(8, 10);

    var valor_id                  = "[Por crear]";

    var valor_estado               = "Activo";
    var valor_area                 = "Riesgos";
    var valor_unidad               = "";
    var valor_equipo               = "";
    var valor_nombre               = "";
    var valor_descripcion          = "";
    var valor_fecha_creacion       = "";
    var valor_fecha_modificacion   = "";
    var valor_responsable          = pw_usuario;
    var valor_tipo_recurso         = "";
    var valor_link_carpeta         = "";
    var valor_link_ppt             = "";
    var valor_link_excel           = "";
    var valor_link_tablero         = "";
    var valor_link_documento       = "";
    var valor_link_video           = "";
    var valor_link_site            = "";

  }



  Informacion.ventana = '' +
    '<div class="col-lg-1-5 col-md-1 col-sm-0-5 col-xs-0-5"></div>' +
    '<div class="col-lg-9 col-md-10 col-sm-11 col-xs-11" style = "padding: 0px;">' +
    '  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>' +
    '  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 navegador4">' +
    '    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>' +

    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;" >ID:</div>' + 
    '      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style = "padding: 4px;text-align: left;" id = "id_registro">' + valor_id + '</div>' +
    
    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 8px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5" style = "height: 1px;padding:0px;"></div>' + 
    '      <div class="col-lg-11 col-md-11 col-sm-11 col-xs-11" style = "height: 1px;padding:0px;background-color: #AEB6BF;"></div>' + 

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;" >Área:</div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 0px;" >' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" list = "listado_areas" id = "area" value = "' +
              valor_area + '">' +
    '        <datalist id="listado_areas">' + opciones_areas + '</datalist>' +
    '      </div>' +
    '      <div class="col-lg-1-5 col-md-1-5 col-sm-1-5 col-xs-1-5" style = "padding: 4px;text-align: left;color:#028484;padding-left: 10px;">Unidad:</div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 0px;" >' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" list = "listado_unidades" id = "unidad" value = "' +
              valor_unidad + '">' +
    '        <datalist id="listado_unidades">' + opciones_unidades + '</datalist>' +
    '      </div>' +
    '      <div class="col-lg-1-5 col-md-1-5 col-sm-1-5 col-xs-1-5" style = "padding: 4px;text-align: left;color:#028484;padding-left: 10px;">Equipo:</div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 0px;" >' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" list = "listado_equipos" id = "equipo" value = "' +
              valor_equipo + '">' +
    '        <datalist id="listado_equipos">' + opciones_equipos + '</datalist>' +
    '      </div>' +

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;" >Nombre:</div>' + 
    '      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style = "padding: 0px;">' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" list = "listado_nombres" id = "nombre" value = "' +
              valor_nombre + '">' +
    '        <datalist id="listado_nombres">' + opciones_nombres + '</datalist>' +
    '      </div>' +

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;">Descripción</div>' + 
    '      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style = "padding: 0px;">' +
    '        <textarea class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '                  rows = "3" style = "font-size:12px;width:100%; resize:none;padding: 5px;"' + 
    '                  id = "descripcion">' + valor_descripcion + '</textarea>' +
    '      </div>' +


    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;" >Fecha creación:</div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 0px;">' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               type = "date" style = "font-size:12px;padding: 3px;" id = "fecha_creacion" value = "' +
              valor_fecha_creacion + '">' +
    '      </div>' +
    '      <div class="col-lg-1-5 col-md-1-5 col-sm-1-5 col-xs-1-5" style = "padding: 4px;text-align: left;color:#028484;padding-left: 10px;">Fecha modificación:</div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 0px;">' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               type = "date" style = "font-size:12px;padding: 3px;" id = "fecha_modificacion" value = "' +
              valor_fecha_modificacion + '" disabled>' +
    '      </div>' +

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;">Responsable:</div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 0px;" >' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" list = "listado_responsables" id = "responsable" value = "' +
              valor_responsable + '">' +
    '        <datalist id="listado_responsables">' + opciones_responsables + '</datalist>' +
    '      </div>' +
    '      <div class="col-lg-1-5 col-md-1-5 col-sm-1-5 col-xs-1-5" style = "padding: 4px;text-align: left;color:#028484;padding-left: 10px;">Tipo recurso:</div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 0px;">' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" list = "listado_tipos_recursos" id = "tipo_recurso" value = "' +
              valor_tipo_recurso + '">' +
    '        <datalist id="listado_tipos_recursos">' + opciones_tipos_recursos + '</datalist>' +
    '      </div>' +


    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;">Link Carpeta:</div>' + 
    '      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style = "padding: 0px;">' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" id = "link_carpeta" value = "' +
              valor_link_carpeta + '">' +
    '      </div>' +

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;">Link Presentación:</div>' + 
    '      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style = "padding: 0px;">' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" id = "link_ppt" value = "' +
              valor_link_ppt + '">' +
    '      </div>' +

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;">Link Excel:</div>' + 
    '      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style = "padding: 0px;">' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" id = "link_excel" value = "' +
              valor_link_excel + '">' +
    '      </div>' +

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;">Link Tablero:</div>' + 
    '      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style = "padding: 0px;">' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" id = "link_tablero" value = "' +
              valor_link_tablero + '">' +
    '      </div>' +

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;">Link Documento:</div>' + 
    '      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style = "padding: 0px;">' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" id = "link_documento" value = "' +
              valor_link_documento + '">' +
    '      </div>' +

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;">Link Video:</div>' + 
    '      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style = "padding: 0px;">' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" id = "link_video" value = "' +
              valor_link_video + '">' +
    '      </div>' +

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5"></div>' + 
    '      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style = "padding: 4px;text-align: left;color:#028484;">Link Site:</div>' + 
    '      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style = "padding: 0px;">' +
    '        <input class = "col-lg-12 col-md-12 col-sm-12 col-xs-12"' + 
    '               style = "font-size:12px;padding: 3px;" id = "link_site" value = "' +
              valor_link_site + '">' +
    '      </div>' +



    

    '      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "height: 6px;width: 100%;padding: 0px;"></div>' +
    '      <div class="col-lg-0-5 col-md-0-5 col-sm-0-5 col-xs-0-5">' +
    '      </div>' +
    '      <div class="col-lg-10 col-md-11 col-sm-11 col-xs-11" style = "padding-left:2px;">' +
    
    '        <div class="col-lg-aut col-md-aut col-sm-aut col-xs-aut" style = "padding: 10px 30px 10px 0px;">' +
    '          <button onclick = "guardar_modificar_indicadores();"' + 
    '                  class = "button texto_centrado" style = "border-radius: 4px 4px 4px 4px;padding: 0px;">' +
    '            <i class="material-icons" style = "font-size:18px;padding: 10px 5px 10px 15px;">save</i>' +
    '            <b style = "padding: 10px 20px 15px 5px;">Guardar cambios</b>' +
    '          </button>' +
    '        </div>' +

    '        <div class="col-lg-aut col-md-aut col-sm-aut col-xs-aut" style = "padding: 10px 30px 10px 0px;">' +
    '          <button onclick = "limpiar_notificacion();"' + 
    '                  class = "button texto_centrado" style = "border-radius: 4px 4px 4px 4px;padding: 0px;">' +
    '            <i class="material-icons" style = "font-size:18px;padding: 10px 5px 10px 15px;">backspace</i>' +
    '            <b style = "padding: 10px 20px 15px 5px;">Cerrar</b>' +
    '          </button>' +
    '        </div>' +

    opcion_eliminar +
    

    '      </div>' +

    '      <div id = "alerta_guardar_inf" class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style = "font-size:12px;padding: 3px;"></div>' +
    '    </div>' +
    '  </div>' +
    '</div>';

    /*
    '        <div class="col-lg-aut col-md-aut col-sm-aut col-xs-aut" style = "padding: 10px 30px 10px 0px;">' +
    '          <button onclick = "guardar_modificar_sprintplanning();"' + 
    '                  class = "button texto_centrado" style = "border-radius: 4px 4px 4px 4px;padding: 0px;">' +
    '            <i class="material-icons" style = "font-size:18px;padding: 10px 5px 10px 15px;">save</i>' +
    '            <b style = "padding: 10px 20px 15px 5px;">Guardar cambios</b>' +
    '          </button>' +
    '        </div>' +


    */






  return Informacion;

}




function guardar_modificar_indicadores(Informacion) {
  var fc = new Date();
  var text_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
  var fc_actual = text_fc.substring(8, 10) + '/' + text_fc.substring(5, 7) + '/' + text_fc.substring(0, 4) + ' ' + text_fc.substring(11, 19);
  var hr_actual = text_fc.substring(11, 16);
  var fc_actual_hm = text_fc.substring(8, 10) + '/' + text_fc.substring(5, 7) + '/' + text_fc.substring(0, 4) + ' ' + text_fc.substring(11, 16);
  var id_fecha = text_fc.substring(0, 4) + text_fc.substring(5, 7) + text_fc.substring(8, 10) + text_fc.substring(11, 13) + text_fc.substring(14, 16)+ text_fc.substring(17, 19);

  var correo_usuario = Session.getActiveUser().getEmail();
    
  var id_registro         = Informacion.id_registro;

  var area                = Informacion.area;
  var unidad              = Informacion.unidad;
  var equipo              = Informacion.equipo;

  var nombre              = Informacion.nombre;
  var descripcion         = Informacion.descripcion;

  var fecha_creacion      = Informacion.fecha_creacion;
  var fecha_modificacion  = Informacion.fecha_modificacion;

  var responsable         = Informacion.responsable;
  var tipo_recurso        = Informacion.tipo_recurso;

  var link_carpeta        = Informacion.link_carpeta;
  var link_ppt            = Informacion.link_ppt;
  var link_excel          = Informacion.link_excel;
  var link_tablero        = Informacion.link_tablero;
  var link_documento      = Informacion.link_documento;
  var link_video          = Informacion.link_video;
  var link_site           = Informacion.link_site;

  var id = SpreadsheetApp.openById("17aal0VWKR_q7jUDjNhzPFH_ihpUDXGLeue-cSspJ_T4");
  var ss = id.getSheetByName("Base");

  var data = ss.getRange(1, 1, ss.getRange("A1").getDataRegion().getLastRow(), ss.getLastColumn()).getValues();

  var Array_id                       = data.map(function(r){ return r[0]; });
  
  if (id_registro != "") {
    var position = Array_id.indexOf(id_registro);
    if (position > -1) {
      Informacion.row = position;
      Informacion.resultado = true;

      if(fecha_creacion != "") {
        var fc_fecha_inicio = new Date(fecha_creacion);
        var text_fecha_inicio = Utilities.formatDate(fc_fecha_inicio, "GMT-0", "yyyy-MM-dd' 'HH:mm:ss' '");
        fecha_creacion = text_fecha_inicio.substring(8, 10) + '/' + text_fecha_inicio.substring(5, 7) + '/' + text_fecha_inicio.substring(0, 4) + ' ' + text_fecha_inicio.substring(11, 19);
      }


      var fc_fecha_fin = new Date();
      var text_fecha_fin = Utilities.formatDate(fc_fecha_fin, "GMT-0", "yyyy-MM-dd' 'HH:mm:ss' '");
      fecha_modificacion = text_fecha_fin.substring(8, 10) + '/' + text_fecha_fin.substring(5, 7) + '/' + text_fecha_fin.substring(0, 4) + ' ' + text_fecha_fin.substring(11, 19);

      ss.getRange(position + 1, 2).setValue("Activo");
      ss.getRange(position + 1, 3).setValue("'" + area);
      ss.getRange(position + 1, 4).setValue("'" + unidad);
      ss.getRange(position + 1, 5).setValue("'" + equipo);

      ss.getRange(position + 1, 6).setValue("'" + nombre);
      ss.getRange(position + 1, 7).setValue("'" + descripcion);

      ss.getRange(position + 1, 8).setValue(fecha_creacion);
      ss.getRange(position + 1, 9).setValue(fecha_modificacion);
      ss.getRange(position + 1, 10).setValue("'" + responsable);
      ss.getRange(position + 1, 11).setValue("'" + tipo_recurso);

      ss.getRange(position + 1, 12).setValue("'" + link_carpeta);
      ss.getRange(position + 1, 13).setValue("'" + link_ppt);
      ss.getRange(position + 1, 14).setValue("'" + link_excel);
      ss.getRange(position + 1, 15).setValue("'" + link_tablero);
      ss.getRange(position + 1, 16).setValue("'" + link_documento);
      ss.getRange(position + 1, 17).setValue("'" + link_video);
      ss.getRange(position + 1, 18).setValue("'" + link_site);

    } else {
      Informacion.row = "";
      Informacion.resultado = false;
    };

  } else {

    Informacion.resultado = true;

    if(fecha_creacion != "") {
      var fc_fecha_inicio = new Date(fecha_creacion);
      var text_fecha_inicio = Utilities.formatDate(fc_fecha_inicio, "GMT-0", "yyyy-MM-dd' 'HH:mm:ss' '");
      fecha_creacion = text_fecha_inicio.substring(8, 10) + '/' + text_fecha_inicio.substring(5, 7) + '/' + text_fecha_inicio.substring(0, 4) + ' ' + text_fecha_inicio.substring(11, 19);
    }

    
    var fc_fecha_fin = new Date();
    var text_fecha_fin = Utilities.formatDate(fc_fecha_fin, "GMT-0", "yyyy-MM-dd' 'HH:mm:ss' '");
    var fecha_modificacion = text_fecha_fin.substring(8, 10) + '/' + text_fecha_fin.substring(5, 7) + '/' + text_fecha_fin.substring(0, 4) + ' ' + text_fecha_fin.substring(11, 19);
    

    ss.appendRow(["MR_Tab" + id_fecha,"Activo","'" + area,"'" + unidad,"'" + equipo,"'" + nombre,"'" + descripcion,
    fecha_creacion,fecha_modificacion,"'" + responsable,"'" + tipo_recurso,"'" + link_carpeta,"'" + link_ppt,"'" + link_excel,
    "'" + link_tablero,"'" + link_documento,"'" + link_video,"'" + link_site]);


  }




  return Informacion;

}



function eliminar_indicadores(Informacion){
  var fc = new Date();
  var text_fc = Utilities.formatDate(fc, "GMT-5", "yyyy-MM-dd' 'HH:mm:ss' '");
  var id_registro       = Informacion.id_registro;

  var id = SpreadsheetApp.openById("17aal0VWKR_q7jUDjNhzPFH_ihpUDXGLeue-cSspJ_T4");
  var ss = id.getSheetByName("Base");

  var data = ss.getRange(1, 1, ss.getRange("A1").getDataRegion().getLastRow(), ss.getLastColumn()).getValues();
  var Array_id = data.map(function(r){ return r[0]; });

  var position = Array_id.indexOf(id_registro);
  
  if (position > -1) {
    ss.getRange(position + 1, 2).setValue("Cancelado");
  } 
  return Informacion;
}
