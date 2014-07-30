	  
      var jeep = {};
      jeep.webdb = {};
      jeep.webdb.db = null;
	  var latitude = null;
	  var longitude = null;
	  var user_submission_num = 1;
	  var cur_user_id = 0;
	  var data_pri = 1;
	  var AllUsers = [];
	  var AllUsersDataCap = [];
	  
	  // For Server
	  var url_extention = "http://uashmama.mi-project.info/apponly/include/";
	  
	  //For Local
	  //var url_extention = "include/";
	  
	  var adminID = 0;
	  var loggedAdminName = null;
	  var loggedAdminPass= null;
	  var counter = 0;
	  
	  $( document ).bind( "mobileinit", function() {
		  // Make your jQuery Mobile framework configuration changes here!
	  	  $.support.cors = true;
		  $.mobile.allowCrossDomainPages = true;
	  });
	 
      
      jeep.webdb.open = function() {
		var shortname = "uashmamaDB";
		var version =  "1.0";
		var description =  "uashmamaDB";
        var dbSize = 5 * 1024 * 1024; // 5MB
        jeep.webdb.db = openDatabase(shortname, version, description, dbSize);
      }
      // Create All Tables
      jeep.webdb.createTables = function() {
        var db = jeep.webdb.db;
        // Create data_type Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS data_type('id' INTEGER PRIMARY KEY ASC, 'data_type' VARCHAR(255))", []);
		});
		
		// Create input_info Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS input_info('id' INTEGER PRIMARY KEY ASC, 'data_type_id' INTEGER, 'label' VARCHAR(255), 'required' INTEGER, 'input_name' VARCHAR(255))", []);
		});
		
		// Create proj_input Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS proj_input('id' INTEGER PRIMARY KEY ASC, 'input_info_id' INTEGER, 'project_id' INTEGER)", []);
		});
		
		// Create user Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS user('id' INTEGER PRIMARY KEY ASC, 'name' VARCHAR(255), 'date_time_in' DATETIME, 'cur_lat' VARCHAR(255), 'cur_long' VARCHAR(255), 'date_time_out' DATETIME)", []);
		});
		
		// Create super_user Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS super_user('id' INTEGER PRIMARY KEY ASC, 'user_name' VARCHAR(255), 'password' VARCHAR(255), 'email' VARCHAR(255))", []);
		});
		
		// Create admin Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS admin('id' INTEGER PRIMARY KEY ASC, 'super_user_id' INTEGER, 'user_name' VARCHAR(255), 'password' VARCHAR(255), 'active' INTEGER, 'email' VARCHAR(255))", []);
		});
		
		// Create project Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS project('id' INTEGER PRIMARY KEY ASC, 'admin_id' INTEGER, 'name' VARCHAR(255), 'big_logo' VARCHAR(255), 'small_logo' VARCHAR(255), 'project_logo' VARCHAR(255), 'background' VARCHAR(255), 'start_date' DATETIME, 'end_date' DATETIME, 'date_time_created' DATETIME)", []);
		});
		
		// Create project_data_capture Table
		db.transaction(function(tx) {
		  tx.executeSql("CREATE TABLE IF NOT EXISTS project_data_capture('id' INTEGER PRIMARY KEY ASC, 'proj_input_id' INTEGER, 'user_id' INTEGER, 'user_submission_num' INTEGER, 'project_id' INTEGER, 'value' VARCHAR(255), 'cur_lat' VARCHAR(255), 'cur_long' VARCHAR(255), 'date_time_created' DATETIME)", []);
		});
		
      }
	
	  // Lat and Long Function
	  function latLong(){
		  if (navigator.geolocation) {
			  navigator.geolocation.getCurrentPosition(function(position){
				  document.getElementById('lat').value = position.coords.latitude;
				  document.getElementById('long').value = position.coords.longitude;
			  });
		  } else { 
			  alert("Geolocation is not supported by this browser.");
		  }
		  latitude = document.getElementById('lat').value;
		  longitude = document.getElementById('long').value;
	  }
	  // run geolocation for form to be populated
	  latLong();
      
	  jeep.webdb.addUser = function(userText, latitude, longitude) {
		
        var db = jeep.webdb.db;
        db.transaction(function(tx){
			
			var date_time_in = new Date();
			
			tx.executeSql("INSERT INTO user(name, date_time_in, cur_lat, cur_long) VALUES (?,?,?,?)",
				[userText, date_time_in, latitude, longitude],
				jeep.webdb.onUserSuccess,
				jeep.webdb.onError
			);
         });
      }
	  
	  jeep.webdb.addDataType = function(dataType) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
		
			tx.executeSql("INSERT INTO data_type(data_type) VALUES (?)",
				[dataType],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 alert("New Input Type: " + dataType + " Added");
      }
	  
	  jeep.webdb.addInputInfo = function(dataTypeID,inputLabel,inputRequired,inputName) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
		
			tx.executeSql("INSERT INTO input_info(data_type_id, label, required, input_name) VALUES (? , ?, ?, ?)",
				[dataTypeID,inputLabel,inputRequired,inputName],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		 alert("New Input: " + inputLabel + " Created");
      }
	  
	  jeep.webdb.addProjectInput = function(inputInfoID,projectID) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
		
			tx.executeSql("INSERT INTO proj_input(input_info_id, project_id) VALUES (?, ?)",
				[inputInfoID,projectID],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
      }
	  
	  jeep.webdb.addProject = function(admin_id, name, big_logo, small_logo, project_logo, background, start_date, end_date) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
		  
			var date_time_created = new Date();
		
			tx.executeSql("INSERT INTO project(admin_id, name, big_logo, small_logo, project_logo, background, start_date, end_date, date_time_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
				[admin_id, name, big_logo, small_logo, project_logo, background, start_date, end_date, date_time_created],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		 alert("Project " + name + " Added, Starting On: " + start_date);
      }
	  
	  jeep.webdb.addProjectDataCapture = function(proj_input_id, user_id, user_submission_num, project_id, value, cur_lat, cur_long) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
		  
			var date_time_created = new Date();
		
			tx.executeSql("INSERT INTO project_data_capture(proj_input_id, user_id, user_submission_num, project_id, value, cur_lat, cur_long, date_time_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
				[proj_input_id, user_id, user_submission_num, project_id, value, cur_lat, cur_long, date_time_created],
				jeep.webdb.onChangeSuccess,
				jeep.webdb.onError
			);
			
         });
      }
	  
	  jeep.webdb.addSuperUser = function(user_name, paswrd, email) {
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
			tx.executeSql("INSERT INTO super_user(user_name, password, email) VALUES (?, ?, ?)",
				[user_name, paswrd, email],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
      }
	  
	  jeep.webdb.addAdmin = function(super_user_id, user_name, paswrd, email) {
		
		var active = 1;
		
        var db = jeep.webdb.db;
          db.transaction(function(tx){
			tx.executeSql("INSERT INTO admin(super_user_id, user_name, password, active, email) VALUES (?, ?, ?, ?, ?)",
				[super_user_id,user_name, paswrd, active, email],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
      }
	  
	  jeep.webdb.addUpdateUserOut = function(cur_user_name) {
		  
          var db = jeep.webdb.db;
          db.transaction(function(tx){
		  
			var date_time_created = new Date();
			
			//var cur_user_name = GetUrlValue('username');
		
			tx.executeSql("UPDATE user SET date_time_out = ? WHERE name = ?",
				[date_time_created, cur_user_name],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
      }
	  
	  // Init Mock data
	  jeep.webdb.initTables = function() {
		
        var db = jeep.webdb.db;
		// Init data_type data
        db.transaction(function(tx){
		
			tx.executeSql("INSERT INTO data_type(data_type) VALUES ('text')",
				[],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		// Init input_info data
		 db.transaction(function(tx){
			
			tx.executeSql("INSERT INTO input_info(data_type_id, label, required, input_name) VALUES (1 , 'Name', 1, 'text_name')",
				[],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		// Init proj_input data
		 db.transaction(function(tx){
			
			tx.executeSql("INSERT INTO proj_input(input_info_id, project_id) VALUES (1, 1)",
				[],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		 // Init user data
		 db.transaction(function(tx){
			
			var date_time_in = new Date();
			
			tx.executeSql("INSERT INTO user(name, date_time_in, cur_lat, cur_long) VALUES ('Promoter Name',?,?,?)",
				[date_time_in, latitude, longitude],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		 // Init super_user data
		 db.transaction(function(tx){
			
			tx.executeSql("INSERT INTO super_user(user_name, password, email) VALUES ('admin', 'admin', 'admin@admin.com')",
				[],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		 // Init admin data
		 db.transaction(function(tx){
			
			tx.executeSql("INSERT INTO admin(super_user_id, user_name, password, active, email) VALUES (1, 'jeep_admin', 'jeep_admin', 1, 'admin@admin.com')",
				[],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			 
         });
		 
		 // Init project data
		 db.transaction(function(tx){
			
			var date_time_in = new Date();
			tx.executeSql("INSERT INTO project(admin_id, name, big_logo, small_logo, project_logo, background, start_date, end_date,date_time_created) VALUES (1, 'My Project', 'Big Logo', 'Small Logo', 'Project Logo', 'background', ?, ?, ?)",
				[date_time_in,date_time_in,date_time_in],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
		 // Init project_data_capture data
		 db.transaction(function(tx){
			
			var date_time_in = new Date();
			
			tx.executeSql("INSERT INTO project_data_capture(proj_input_id, user_id, user_submission_num, project_id, value, cur_lat, cur_long, date_time_created) VALUES (1, 1, 1, 1, 'My Name', ?, ?, ?)",
				[latitude,longitude,date_time_in],
				jeep.webdb.onSuccess,
				jeep.webdb.onError
			);
			
         });
		 
      }
      
      jeep.webdb.onError = function(tx, e) {
        alert("There has been an error: " + e.message);
      }
	  
	  jeep.webdb.onUserSuccess = function(tx, r) {
        // re-render the data.
		var url = "project_items.html";
		var projID = $("#projID").val()
		var data_url = "username="+document.getElementById('user').value;
		$.mobile.changePage(url,{ transition: "slide", type: 'get', data: data_url, changeHash: true});
		$(document).on("pagecontainerload",function(event,data){
		  initProjItems();
		  
		});
		$(document).on("pageshow",function(){
		  jeep.webdb.open();
		  jeep.webdb.getCurUserId(loadCurUserId);
		  $("#projID").val(projID);
		  $("#user").val("");
		});
		
      }
      
      jeep.webdb.onSuccess = function(tx, r) {
        // re-render the data.
        /*
		jeep.webdb.getAllprojectItems(loadprojectItems);
		jeep.webdb.getAllDataTypes(loadAllDataTypes);
		jeep.webdb.getAllProjects(loadAllProjects);
		jeep.webdb.getAllProjects(loadAllProjectsForData);
		jeep.webdb.getAllInputInfo(loadAllInputInfo);
		jeep.webdb.getAllCapData(loadAllCapData);
		*/
      }
	  
	  jeep.webdb.onChangeSuccess = function(tx, r) {
        // re-render the data.
		jeep.webdb.getAllCapData(loadAllCapData);
      }
	  
	  jeep.webdb.getAdmin = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
          tx.executeSql("SELECT * FROM `admin`", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getLogedAdmin = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
		  
		  var cur_name = loggedAdminName ;
		  var cur_password = loggedAdminPass;
		  
          tx.executeSql("SELECT id FROM `admin` WHERE user_name = ? AND password = ?", [cur_name, cur_password], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getCurUserId = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
		
		  var cur_user_name = GetUrlValue('username');
		  
          tx.executeSql("SELECT id FROM `user` WHERE name = ?", [cur_user_name], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getAllUsers = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {  
          tx.executeSql("SELECT * FROM `user`", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getAllUserDataCap = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {  
          tx.executeSql("SELECT * FROM `project_data_capture` INNER JOIN `user` ON user.id = project_data_capture.user_id ", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getAllCapData = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
		  var project_id = $('#projID').val();
			  tx.executeSql("SELECT DISTINCT `Tet`.`user_submission_num`, `Tet`.`user_id`, `input_name`, `value`, `cur_lat`, `cur_long`, `date_time_created` FROM (SELECT DISTINCT `project_data_capture`.`user_submission_num`, `project_data_capture`.`user_id` FROM `project_data_capture`) AS Tet CROSS JOIN `proj_input` INNER JOIN `input_info` ON `input_info`.`id` = `proj_input`.`input_info_id` LEFT JOIN `project_data_capture` ON `project_data_capture`.`proj_input_id` = `proj_input`.`id` AND `Tet`.`user_id` = `project_data_capture`.`user_id` WHERE `project_data_capture`.`project_id` = 1  OR `project_data_capture`.`project_id` IS NULL ORDER BY 1,2, value ASC", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getAllInputInfo = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
          tx.executeSql("SELECT * FROM input_info ORDER BY input_name", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  jeep.webdb.getAllProjects = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
          tx.executeSql("SELECT id, name, start_date FROM project ORDER BY start_date ASC", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
      jeep.webdb.getAllDataTypes = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
          tx.executeSql("SELECT * FROM data_type", [], renderFunc,
              jeep.webdb.onError);
        });
      }
	  
	  
	  jeep.webdb.getAllprojectItems = function(renderFunc) {
        var db = jeep.webdb.db;
        db.transaction(function(tx) {
		  
		  var project_id = $('#projID').val();
		  
          tx.executeSql("SELECT proj_input.id AS id, label, required, input_name, data_type FROM `proj_input` INNER JOIN `input_info` ON proj_input.input_info_id = input_info.id INNER JOIN `data_type` ON input_info.data_type_id = data_type.id WHERE project_id=? ORDER BY  proj_input.id;", [project_id], renderFunc,
              jeep.webdb.onError);
        });
      }
      
      jeep.webdb.deleteTodo = function(id) {
        var db = jeep.webdb.db;
        db.transaction(function(tx){
          tx.executeSql("DELETE FROM user WHERE ID=?", [id],
              jeep.webdb.onSuccess,
              jeep.webdb.onError);
          });
      }
	  
	  function loadAdmin(tx, rs) {
        var rowOutput_Name = [];
		var rowOutput_Password = [];
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput_Name.push(renderAdminName(rs.rows.item(i)));
		  rowOutput_Password.push(renderAdminPassword(rs.rows.item(i)));
        }
		
		if((rowOutput_Name.indexOf($('#user_name').val()) > -1) && (rowOutput_Password.indexOf($('#password').val()) > -1)){
			var url = "choose_action.html";
			$.mobile.changePage(url,{ transition: "slide"});
			$(document).on("pagecontainerload",function(event,data){
			});
			$(document).on("pageshow",function(){
			  initDB();
			  loadServDataType();
			  loadServInputInfo();
			  loadServProject();
			  loadServProjectDataCapture();
			  loadServProjInput();
			  loadServSuperUser();
			  loadServUser();
			  getLogedAdmin();
			});
		}
		else{
			alert('Your Username or password does not match');
		}
		
      }
	  
	  function loadCurAdmin(tx, rs) {
        var rowOutput = "";
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput = renderCurAdminId(rs.rows.item(i));
        }
		$("#adminID").val(rowOutput);
		adminID = rowOutput;
      }
	  
	  function loadCurUserId(tx, rs) {
        var rowOutput = "";
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput = renderCurUserId(rs.rows.item(i));
        }
		$("#curuserid").val(rowOutput);
		cur_user_id = rowOutput;
      }
      
      function loadprojectItems(tx, rs) {
	  
		var lasttitle = '';
        var rowOutput = '<fieldset data-role="controlgroup">';
		
		for (var i=0; i < rs.rows.length; i++) {
		  if(lasttitle == rs.rows.item(i).input_name){
			  rowOutput += renderTodo(rs.rows.item(i));
			  lasttitle = rs.rows.item(i).input_name;
		  }
		  else{
			  if(rowOutput != '<fieldset data-role="controlgroup">' && (rs.rows.item(i).data_type == 'radio' || rs.rows.item(i).data_type == 'checkbox')){
				rowOutput += '</fieldset><fieldset data-role="controlgroup" data-type="horizontal">'+renderTodo(rs.rows.item(i));
				lasttitle = rs.rows.item(i).input_name;
			  }
			  else if(rowOutput != '<fieldset data-role="controlgroup">' && (rs.rows.item(i).data_type != 'radio' || rs.rows.item(i).data_type != 'checkbox')){
				rowOutput += '</fieldset><fieldset data-role="controlgroup">'+renderTodo(rs.rows.item(i));
				lasttitle = rs.rows.item(i).input_name;
			  }
			  else{
				if(rs.rows.item(i).data_type == 'radio' || rs.rows.item(i).data_type == 'checkbox'){
					rowOutput = '<fieldset data-role="controlgroup" data-type="horizontal">';
					rowOutput += renderTodo(rs.rows.item(i));
					lasttitle = rs.rows.item(i).input_name;
				}
				else{
					rowOutput += renderTodo(rs.rows.item(i));
					lasttitle = rs.rows.item(i).input_name;
				}
			  }
		  }

        }
		rowOutput += '</fieldset><br/>';
		$("#projectItems").html('').append(rowOutput + '<input type="hidden" id="curuserid" value="0"/><input type="hidden" id="userSubnum" value="1"/><button data-role="button" data-theme="b" data-mini="true" data-icon="check" data-iconpos="right" onclick="updateUserSubMission();">Sign Up</button>').trigger('create');
      
		
	  }
	  
	   function loadAllDataTypes(tx, rs) {
        var rowOutput = "";
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput += renderDataTypeSelec(rs.rows.item(i));
        }
		$("#data_type_select").html('').append(rowOutput).trigger('create');
      }
	  
	  function loadAllProjectsForUser(tx, rs) {
        var rowOutput = "";
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput += renderProjectsForUser(rs.rows.item(i));
        }
		$("#project_for_data").html('').append(rowOutput).trigger('create');
      }
	  
	  function loadAllProjectsForData(tx, rs) {
        var rowOutput = "";
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput += renderProjectsForData(rs.rows.item(i));
        }
		$("#project_for_data").html('').append(rowOutput).trigger('create');
      }
	  
	  function loadAllProjects(tx, rs) {
        var rowOutput = "";
        var project_select = document.getElementById("project_select");
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput += renderProjectsSelec(rs.rows.item(i));
        }
      
        project_select.innerHTML = rowOutput;
      }
	  
	  function loadAllInputInfo(tx, rs) {
	  
		var lasttitle = '';
        var rowOutput = '<fieldset data-role="controlgroup">';
		
		for (var i=0; i < rs.rows.length; i++) {
		  if(lasttitle == rs.rows.item(i).input_name){
			  rowOutput += renderInputsSelec(rs.rows.item(i));
			  lasttitle = rs.rows.item(i).input_name;
		  }
		  else{
			  if(rowOutput != '<fieldset data-role="controlgroup">'){
				rowOutput += '</fieldset><br/><hr/><br/><fieldset data-role="controlgroup">'+'<legend>'+rs.rows.item(i).input_name+'</legend>'+renderInputsSelec(rs.rows.item(i));
				lasttitle = rs.rows.item(i).input_name;
			  }
			  else{
				rowOutput += '<legend>'+rs.rows.item(i).input_name+'</legend>'+renderInputsSelec(rs.rows.item(i));
				lasttitle = rs.rows.item(i).input_name;
			  }
		  }

        }
		rowOutput += '</fieldset>';
		$("#select_inputs_area").html('').append(rowOutput).trigger('create');
		
      }
	  
	  function loadAllCapData(tx, rs) {
		//alert("Loading All Data Cap");
		
		var lastsub = 0;
		var lastuserid = 0;
		var lasttitle = [];
        var rowOutput = "<thead><tr>";
		
		for (var i=0; i < rs.rows.length; i++) {
		  if(lasttitle.indexOf(rs.rows.item(i).input_name) == -1){
			  rowOutput += renderCapDatahead(rs.rows.item(i));
			  lasttitle.push(rs.rows.item(i).input_name);
			  data_pri++;
		  }
		  

        }
		
		rowOutput += "</tr></thead><tbody><tr>";
		
        for (var j=0; j < rs.rows.length; j++) {
		
		  if(lastsub == rs.rows.item(j).user_submission_num && lastuserid == rs.rows.item(j).user_id){
			  rowOutput += renderCapDataRow(rs.rows.item(j));
			  lastsub = rs.rows.item(j).user_submission_num;
			  lastuserid = rs.rows.item(j).user_id;
		  }
		  else{
			  rowOutput += "</tr>";
			  rowOutput += "<tr>";
			  rowOutput += renderCapDataRow(rs.rows.item(j));
			  lastsub = rs.rows.item(j).user_submission_num;
			  lastuserid = rs.rows.item(j).user_id;
		  }
        }
        rowOutput += "</tr></tbody>";
		$("#render_data").html('').append(rowOutput).trigger('create');
      }
	  
	  function renderAdminName(row) {
        return row.user_name;
      }
	  
	  function renderAdminPassword(row) {
        return row.password;
      }
	  
	  function renderCapDatahead(row) {
        return "<th data-priority='"+data_pri+"'> " + row.input_name  + "</th>";
      }
	  
	  function renderCapDataRow(row) {
        return "<td> " + row.value + "</td>";
      }
	  
      function renderInputsSelec(row) {
        return "<input type='checkbox' value='"+row.id+"' name='select_inputs' id='select_inputs_" + row.label  + "_" + row.id  + "' /> <label for='select_inputs_" + row.label  + "_" + row.id  + "'>" + row.label  + " </label>";
      }
	  
	  function renderProjectsForUser(row) {
        return '<button class="btnBigger" data-role="button" data-theme="b" data-icon="carat-r" data-iconpos="right" onclick="goUserProj('+row.id+');"> '+ row.name  +'</button>';
      }
	  
	  function renderProjectsForData(row) {
        return '<button class="btnBigger" data-role="button" data-theme="b" data-icon="carat-r" data-iconpos="right" onclick="goViewProjData('+row.id+');">View '+ row.name  +' Data </button>';
      }
	  function renderProjectsUser(row) {
        return '<button class="btnBigger" data-role="button" data-theme="b" data-icon="carat-r" data-iconpos="right" on>'+ row.name  +'</button>';
      }
	  
	  function renderProjectsSelec(row) {
        return "<option value='"+row.id+"'>" + row.name  + " "+ row.start_date.substring(0, 15) +" </option>";
      }
	  
      function renderDataTypeSelec(row) {
        return "<option value='"+row.id+"'>" + row.data_type  + " </option>";
      }
	  
	  function renderCurUserId(row) {
        return row.id;
      }
	  
	  function renderAllUsers(row) {
        return [row.id, row.name, row.date_time_in, row.cur_lat, row.cur_long, row.date_time_out];
      }
	  
	  function renderAllUsersDataCap(row) {
        return [row.id, row.proj_input_id, row.user_id, row.user_submission_num, row.project_id, row.value, row.cur_lat, row.cur_long, row.date_time_created, row.name];
      }
	  
	  function renderCurAdminId(row) {
		  alert(row.id);
        return row.id;
      }
	  
	  
	  function renderTodo(row) {
		if(row.data_type == "radio"){	
			if(row.required = 1){
				return "<label for='"+row.label+"_"+row.id+"'>"+row.label+"</label><input onchange='addProjectDataCapture(" + row.id  + ", GetUserId(), GetProjId(),this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' value='"+row.label+"' id='"+row.label+"_"+row.id+"' required>";
			}
			else{
				return "<label for='"+row.label+"_"+row.id+"' >"+row.label+"</label><input onchange='addProjectDataCapture(" + row.id  + ", GetUserId(), GetProjId(),this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' value='"+row.label+"' id='"+row.label+"_"+row.id+"'>";
			}
		}
		else if(row.data_type == "checkbox"){
			if(row.required = 1){
				return "<input onchange='addProjectDataCapture(" + row.id  + ", GetUserId(), GetProjId(),this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' value='"+row.label+"' id='"+row.label+"_"+row.id+"' data-role='input' data-theme='b' required /><label for='"+row.label+"_"+row.id+"'>"+row.label+"</label>";
			}
			else{
				return "<input onchange='addProjectDataCapture(" + row.id  + ", GetUserId(), GetProjId(),this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' value='"+row.label+"' id='"+row.label+"_"+row.id+"' data-role='input' data-theme='b' /><label for='"+row.label+"_"+row.id+"'>"+row.label+"</label>";
			}
		}
		else{
			if(row.required = 1){
				return "<input onchange='addProjectDataCapture(" + row.id  + ",  GetUserId(), GetProjId(),this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' placeholder='"+row.label+"' data-role='input' data-theme='b' required />";
			}
			else{
				return "<input onchange='addProjectDataCapture(" + row.id  + ",  GetUserId(), GetProjId(),this.value)' type='" + row.data_type  + "' name='"+row.input_name+"' placeholder='"+row.label+"' data-role='input' data-theme='b' />";
			}
		}
      }
	  
      
      function init() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				jeep.webdb.open();
				jeep.webdb.createTables();
				//jeep.webdb.initTables();
				jeep.webdb.getAllprojectItems(loadprojectItems);
				jeep.webdb.getAllDataTypes(loadAllDataTypes);
				jeep.webdb.getAllProjects(loadAllProjects);
				jeep.webdb.getAllProjects(loadAllProjectsForData);
				jeep.webdb.getAllInputInfo(loadAllInputInfo);
				jeep.webdb.getAllCapData(loadAllCapData);
				
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				alert("The transaction failed for reasons unrelated to the database.");
			}
			else if(e == 1){
				// DATABASE_ERR
				alert("The statement failed for database reasons.");
			}
			else if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				alert("The statement failed because the data returned from the database was too large.");
			}
			else if(e == 4){
				// QUOTA_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 5){
				// SYNTAX_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				alert("Statement failed due to a constraint failure.");
			}
			else if(e == 7){
				// TIMEOUT_ERR
				alert("A lock for the transaction could not be obtained in a reasonable time.");
			}
			else {
				alert("Unknown error "+e+".");
			}
			return;
		}
      }
	  
	  function initDB() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				jeep.webdb.open();
				jeep.webdb.createTables();
				//jeep.webdb.initTables();
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				alert("The transaction failed for reasons unrelated to the database.");
			}
			else if(e == 1){
				// DATABASE_ERR
				alert("The statement failed for database reasons.");
			}
			else if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				alert("The statement failed because the data returned from the database was too large.");
			}
			else if(e == 4){
				// QUOTA_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 5){
				// SYNTAX_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				alert("Statement failed due to a constraint failure.");
			}
			else if(e == 7){
				// TIMEOUT_ERR
				alert("A lock for the transaction could not be obtained in a reasonable time.");
			}
			else {
				alert("Unknown error "+e+".");
			}
			return;
		}
      }
	  
	  function initProjItems() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				jeep.webdb.open();
				jeep.webdb.getAllprojectItems(loadprojectItems);
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				alert("The transaction failed for reasons unrelated to the database.");
			}
			else if(e == 1){
				// DATABASE_ERR
				alert("The statement failed for database reasons.");
			}
			else if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				alert("The statement failed because the data returned from the database was too large.");
			}
			else if(e == 4){
				// QUOTA_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 5){
				// SYNTAX_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				alert("Statement failed due to a constraint failure.");
			}
			else if(e == 7){
				// TIMEOUT_ERR
				alert("A lock for the transaction could not be obtained in a reasonable time.");
			}
			else {
				alert("Unknown error "+e+".");
			}
			return;
		}
      }
	  
	  function initLinkInputToProject() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				jeep.webdb.open();
				jeep.webdb.getAllProjects(loadAllProjects);
				jeep.webdb.getAllInputInfo(loadAllInputInfo);
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				alert("The transaction failed for reasons unrelated to the database.");
			}
			else if(e == 1){
				// DATABASE_ERR
				alert("The statement failed for database reasons.");
			}
			else if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				alert("The statement failed because the data returned from the database was too large.");
			}
			else if(e == 4){
				// QUOTA_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 5){
				// SYNTAX_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				alert("Statement failed due to a constraint failure.");
			}
			else if(e == 7){
				// TIMEOUT_ERR
				alert("A lock for the transaction could not be obtained in a reasonable time.");
			}
			else {
				alert("Unknown error "+e+".");
			}
			return;
		}
      }
	  
	  function createNewInput() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				jeep.webdb.open();
				jeep.webdb.getAllDataTypes(loadAllDataTypes);
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				alert("The transaction failed for reasons unrelated to the database.");
			}
			else if(e == 1){
				// DATABASE_ERR
				alert("The statement failed for database reasons.");
			}
			else if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				alert("The statement failed because the data returned from the database was too large.");
			}
			else if(e == 4){
				// QUOTA_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 5){
				// SYNTAX_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				alert("Statement failed due to a constraint failure.");
			}
			else if(e == 7){
				// TIMEOUT_ERR
				alert("A lock for the transaction could not be obtained in a reasonable time.");
			}
			else {
				alert("Unknown error "+e+".");
			}
			return;
		}
      }
	  
	  function initDataType() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				jeep.webdb.open();
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				alert("The transaction failed for reasons unrelated to the database.");
			}
			else if(e == 1){
				// DATABASE_ERR
				alert("The statement failed for database reasons.");
			}
			else if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				alert("The statement failed because the data returned from the database was too large.");
			}
			else if(e == 4){
				// QUOTA_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 5){
				// SYNTAX_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				alert("Statement failed due to a constraint failure.");
			}
			else if(e == 7){
				// TIMEOUT_ERR
				alert("A lock for the transaction could not be obtained in a reasonable time.");
			}
			else {
				alert("Unknown error "+e+".");
			}
			return;
		}
      }
	  
	  function createProject() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				jeep.webdb.open();
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				alert("The transaction failed for reasons unrelated to the database.");
			}
			else if(e == 1){
				// DATABASE_ERR
				alert("The statement failed for database reasons.");
			}
			else if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				alert("The statement failed because the data returned from the database was too large.");
			}
			else if(e == 4){
				// QUOTA_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 5){
				// SYNTAX_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				alert("Statement failed due to a constraint failure.");
			}
			else if(e == 7){
				// TIMEOUT_ERR
				alert("A lock for the transaction could not be obtained in a reasonable time.");
			}
			else {
				alert("Unknown error "+e+".");
			}
			return;
		}
      }
	  
	  function uploadData() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				jeep.webdb.open();
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				alert("The transaction failed for reasons unrelated to the database.");
			}
			else if(e == 1){
				// DATABASE_ERR
				alert("The statement failed for database reasons.");
			}
			else if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				alert("The statement failed because the data returned from the database was too large.");
			}
			else if(e == 4){
				// QUOTA_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 5){
				// SYNTAX_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				alert("Statement failed due to a constraint failure.");
			}
			else if(e == 7){
				// TIMEOUT_ERR
				alert("A lock for the transaction could not be obtained in a reasonable time.");
			}
			else {
				alert("Unknown error "+e+".");
			}
			return;
		}
      }
	  
	  function downloadData() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				jeep.webdb.open();
				jeep.webdb.getAllProjects(loadAllProjectsForData);
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				alert("The transaction failed for reasons unrelated to the database.");
			}
			else if(e == 1){
				// DATABASE_ERR
				alert("The statement failed for database reasons.");
			}
			else if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				alert("The statement failed because the data returned from the database was too large.");
			}
			else if(e == 4){
				// QUOTA_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 5){
				// SYNTAX_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				alert("Statement failed due to a constraint failure.");
			}
			else if(e == 7){
				// TIMEOUT_ERR
				alert("A lock for the transaction could not be obtained in a reasonable time.");
			}
			else {
				alert("Unknown error "+e+".");
			}
			return;
		}
      }
	  
	  function downloadDataUser() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				jeep.webdb.open();
				jeep.webdb.getAllProjects(loadAllProjectsForUser);
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				alert("The transaction failed for reasons unrelated to the database.");
			}
			else if(e == 1){
				// DATABASE_ERR
				alert("The statement failed for database reasons.");
			}
			else if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				alert("The statement failed because the data returned from the database was too large.");
			}
			else if(e == 4){
				// QUOTA_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 5){
				// SYNTAX_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				alert("Statement failed due to a constraint failure.");
			}
			else if(e == 7){
				// TIMEOUT_ERR
				alert("A lock for the transaction could not be obtained in a reasonable time.");
			}
			else {
				alert("Unknown error "+e+".");
			}
			return;
		}
      }
	  
	  function viewData() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				jeep.webdb.open();
				jeep.webdb.getAllCapData(loadAllCapData);
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 0){
				// UNKNOWN_ERR
				alert("The transaction failed for reasons unrelated to the database.");
			}
			else if(e == 1){
				// DATABASE_ERR
				alert("The statement failed for database reasons.");
			}
			else if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			}
			else if(e == 3){
				// TOO_LARGE_ERR
				alert("The statement failed because the data returned from the database was too large.");
			}
			else if(e == 4){
				// QUOTA_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 5){
				// SYNTAX_ERR
				alert("The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
			}
			else if(e == 6){
				// CONSTRAINT_ERR
				alert("Statement failed due to a constraint failure.");
			}
			else if(e == 7){
				// TIMEOUT_ERR
				alert("A lock for the transaction could not be obtained in a reasonable time.");
			}
			else {
				alert("Unknown error "+e+".");
			}
			return;
		}
      }
	  
	  function getAdmin() {
        jeep.webdb.getAdmin(loadAdmin);
        //user.value = "";
      }
	  
	   function getLogedAdmin() {
        jeep.webdb.getLogedAdmin(loadCurAdmin);
        //user.value = "";
      }
      
      function addUser() {
        var user = document.getElementById("user");
		latitude = document.getElementById('lat');
		longitude = document.getElementById('long');
        jeep.webdb.addUser(user.value, latitude.value, longitude.value);
        //user.value = "";
      }
	  
	  function addDataType() {
        var data_type = document.getElementById("data_type");
        jeep.webdb.addDataType(data_type.value);
        data_type.value = "";
      }
	  
	  function addInputInfo() {
        var data_type_select = document.getElementById("data_type_select");
		var input_label = document.getElementById("input_label");
		var input_group_name = document.getElementById("input_group_name");
		var rec_feild = document.getElementById("rec_feild");
		jeep.webdb.addInputInfo(data_type_select.value,input_label.value,rec_feild.value,input_group_name.value );
        data_type_select.value ='';
		input_label.value = '';
		rec_feild.value = '';
		input_group_name.value = '';
      }
	  
	  function addProjectInput() {
		
		var project_select = document.getElementById("project_select");
		var inputsSelected = '';
		var select_inputs_checkboxes = document.getElementsByName('select_inputs');
		
		for (var i=0;i<select_inputs_checkboxes.length;i++) {
		  if (select_inputs_checkboxes[i].checked){
			jeep.webdb.addProjectInput(select_inputs_checkboxes[i].value,project_select.value);
			inputsSelected += select_inputs_checkboxes[i].value + '\n';
		  }
		}
		
		alert("The Following Inputs have been added to "+ $("#project_select option:selected").html()+" \n " + inputsSelected);
		
      }
	  
	  function addProject() {
	  
		var admin_id = document.getElementById("admin_id").value;
		
		var project_name = document.getElementById("project_name").value;
		var big_logo = document.getElementById("big_logo").value;
		var small_logo = document.getElementById("small_logo").value;
		var project_logo = document.getElementById("project_logo").value;
		var background = document.getElementById("background").value;
		var start_date = document.getElementById("start_date").value;
		var end_date = document.getElementById("end_date").value;
		
		jeep.webdb.addProject(admin_id, project_name, big_logo, small_logo, project_logo, background, start_date, end_date);
      }
	  
	  function addSuperUser() {
		var user_name = document.getElementById("user_name").value;
		var paswrd = document.getElementById("password").value;
		var conf_password = document.getElementById("conf_password").value;
		var email = document.getElementById("email").value;
		
		if(paswrd == conf_password){
			jeep.webdb.addSuperUser(user_name, paswrd, email);
			user_name = '';
			paswrd = '';
			conf_password = '';
			email = '';
		}
		else{
			alert("Passwords do not match");
		}
      }
	  
	  function addAdmin() {
		var super_user_id = 1;
		var user_name = document.getElementById("admin_user_name").value;
		var paswrd = document.getElementById("admin_password").value;
		var conf_password = document.getElementById("admin_conf_password").value;
		var email = document.getElementById("admin_email").value;
		
		if(paswrd == conf_password){
			jeep.webdb.addAdmin(super_user_id, user_name, paswrd, email);
			user_name = '';
			paswrd = '';
			conf_password = '';
			email = '';
		}
		else{
			alert("Passwords do not match");
		}
      }
	  
	  function addProjectDataCapture(proj_input_id, user_id, project_id,val) {
		
		cur_lat = document.getElementById('lat').value;
		cur_long = document.getElementById('long').value;
		
		userSubnum = document.getElementById('userSubnum').value;
		
		jeep.webdb.addProjectDataCapture(proj_input_id, user_id, userSubnum, project_id, val, cur_lat, cur_long);
      }
	  
	  function getAllUsers(){
		  jeep.webdb.open();
		  jeep.webdb.getAllUsers(loadAllUsers);
	  }
	  
	  function getAllUserDataCap(){
		  jeep.webdb.open();
		  jeep.webdb.getAllUserDataCap(loadAllUsersDataCap);
	  }
	  
	  function updateUserSubMission(){
		
		var correct = true;
		
		var elements = document.getElementById('projectItems').getElementsByTagName('input');

		for (var i = 0; i < elements.length; i++) {
			if(elements[i].value == '' || elements[i].value == null){
				correct = false;
			}
		}
		if(correct == true){
			user_submission_num++;
			alert("Submission Saved");
			document.getElementById('userSubnum').value = user_submission_num;
			var elements = document.getElementById('projectItems').getElementsByTagName('input');

			for (var i = 0; i < elements.length; i++) {
				if(elements[i].getAttribute("type") == "radio" || elements[i].getAttribute("type") == "checkbox"){
					//elements[i].checked = false;
					
					$( "#"+elements[i].id ).prop( "checked", false ).checkboxradio("refresh");
				}
				else if(elements[i].getAttribute("type") == "text"){
					elements[i].value = '';
				}
				else{
					elements[i].value = '';
				}
			}
		}
	  }
	  
	  function GetUrlValue(VarSearch){
		  var SearchString = window.location.search.substring(1);
		  var VariableArray = SearchString.split('&');
		  for(var i = 0; i < VariableArray.length; i++){
			  var KeyValuePair = VariableArray[i].split('=');
			  if(KeyValuePair[0] == VarSearch){
				  return KeyValuePair[1];
			  }
		  }
	  }
	  
	  function GetUserId(){
				  return $('#curuserid').val();
	  }
	  
	  function GetProjId(){
				  return $('#projID').val();
	  }
	  
	  function goToPageUser(){
		jeep.webdb.open();
		jeep.webdb.addUpdateUserOut(GetUrlValue('username'));
		var url = "user.html";
		$.mobile.changePage(url,{ transition: "slide", reverse:true});
		$(document).on( 'pagebeforeshow',function(event){
			//jeep.webdb.open();
			//jeep.webdb.addUpdateUserOut();
		});
		$(document).on("pagecontainerload",function(event,data){
		  //jeep.webdb.addUpdateUserOut();
		});
		$(document).on("pageshow",function(){
		  jeep.webdb.open();
		});
	  }
	  
	  
	  function goToPageLinkInputToProject(){
		var url = "link_input_to_project.html";
		$.mobile.changePage(url,{ transition: "flip"});
		$(document).on("pagecontainerload",function(event,data){
		  initLinkInputToProject();
		  
		});
		$(document).on("pageshow",function(){
		  jeep.webdb.open();
		});
	  }
	  
	  function goCreateNewInput(){
		var url = "create_new_input.html";
		$.mobile.changePage(url,{ transition: "flip"});
		$(document).on("pagecontainerload",function(event,data){
		  createNewInput();
		});
		$(document).on("pageshow",function(){
		  jeep.webdb.open();
		});
	  }
	  
	  function goAddDataType(){
		var url = "add_data_type.html";
		$.mobile.changePage(url,{ transition: "flip"});
		$(document).on("pagecontainerload",function(event,data){
		  initDataType();
		});
		$(document).on("pageshow",function(){
		  jeep.webdb.open();
		});
	  }
	  function goCreateProject(){
		var url = "create_project.html";
		$.mobile.changePage(url,{ transition: "flip"});
		$(document).on("pagecontainerload",function(event,data){
		  createProject();
		});
		$(document).on("pageshow",function(){
		  jeep.webdb.open();
		  $("#admin_id").val(adminID);
		});
	  }
	  
	  function goDownloadData(){
		var url = "select_project.html";
		$.mobile.changePage(url,{ transition: "slidedown"});
		$(document).on("pagecontainerload",function(event,data){
		  downloadData();
		});
		$(document).on("pageshow",function(){
		  jeep.webdb.open();
		});
	  }
	  
	  function goViewProjData(projID){
		var url = "view_data.html";
		$.mobile.changePage(url,{ transition: "slide"});
		$(document).on("pagecontainerload",function(event,data){
		});
		$(document).on("pageshow",function(){
		  jeep.webdb.open();
		  $("#projID").val(projID);
		  viewData();
		});
	  }
	  
	  function goUserProj(projID){
		var url = "user.html";
		$.mobile.changePage(url,{ transition: "slide"});
		$(document).on("pagecontainerload",function(event,data){
		});
		$(document).on("pageshow",function(){
		  jeep.webdb.open();
		  $("#projID").val(projID);
		  viewData();
		});
	  }
	  
	  function goUserChooseProj(projID){
		var url = "user_select_project.html";
		$.mobile.changePage(url,{ transition: "slide"});
		$(document).on("pagecontainerload",function(event,data){
			
		});
		$(document).on("pageshow",function(){
			console.log("Go goUserChooseProj Fired");
			downloadDataUser();
		});
	  }
	  
	  function goUserDataSync(projID){
		var url = "user_sync.html";
		$.mobile.changePage(url,{ transition: "flip"});
		$(document).on("pagecontainerload",function(event,data){
			uploadData();
		});
		$(document).on("pageshow",function(){
			console.log("Go goUserDataSyncFired");
			jeep.webdb.open();
		});
	  }
	  
	  function goAdmin(projID){
		var url = "admin_log_in.html";
		$.mobile.changePage(url,{ transition: "slide"});
		$(document).on("pagecontainerload",function(event,data){
		});
		$(document).on("pageshow",function(){
		  initDB();
		  loadServAdmin();
		  console.log("Go Admin Fired");
		});
	  }
	  
	  function loadServAdmin(){
		var admin;
		$.ajax({
			async: false,
			dataType:"json",
			type: "GET",
			crossDomain: true,
			cache: false,
			url: url_extention+"get_admin.php",
			contentType: "application/json; charset=utf-8",
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data){
				console.log(data);
				admin = data;
			},
			error:function(xhr){
				alert("An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		jeep.webdb.open();
		jeep.webdb.db.transaction(function(tx) {
			tx.executeSql("DROP TABLE admin", []);
			tx.executeSql("CREATE TABLE IF NOT EXISTS admin('id' INTEGER PRIMARY KEY ASC, 'super_user_id' INTEGER, 'user_name' VARCHAR(255), 'password' VARCHAR(255), 'active' INTEGER, 'email' VARCHAR(255))", []);
		});
		
		
		$.each(admin, function(idx, obj) {
			jeep.webdb.db.transaction(function(tx){
			tx.executeSql("INSERT INTO admin(id, super_user_id, user_name, password, active, email) VALUES (?, ?, ?, ?, ?, ?)",
				[obj.id, obj.super_user_id, obj.user_name, obj.password , obj.active , obj.email],
				console.log("Synced Admin"),
				console.log("Admin Sync Failed")
			);
			
         	});
			
		});
		
	  }
	  
	  function loadServDataType(){
		var data_type;
		$.ajax({
			async: false,
			dataType:"json",
			type: "GET",
			crossDomain: true,
			cache: false,
			url: url_extention+"get_data_type.php",
			contentType: "application/json; charset=utf-8",
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data){
				console.log(data);
				data_type = data;
			},
			error:function(xhr){
				alert("An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		jeep.webdb.open();
		jeep.webdb.db.transaction(function(tx) {
			tx.executeSql("DROP TABLE data_type", []);
			tx.executeSql("CREATE TABLE IF NOT EXISTS data_type('id' INTEGER PRIMARY KEY ASC, 'data_type' VARCHAR(255))", []);
		});
		
		
		$.each(data_type, function(idx, obj) {
			
			jeep.webdb.db.transaction(function(tx){
			tx.executeSql("INSERT INTO data_type(id, data_type) VALUES (?, ?)",
				[obj.id, obj.data_type],
				console.log("Synced Data Type"),
				console.log("Data Type Sync Failed")
			);
			
         	});
			
		});
		
	  }
	  
	  function loadServInputInfo(){
		var input_info;
		$.ajax({
			async: false,
			dataType:"json",
			type: "GET",
			crossDomain: true,
			cache: false,
			url: url_extention+"get_input_info.php",
			contentType: "application/json; charset=utf-8",
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data){
				console.log(data);
				input_info = data;
			},
			error:function(xhr){
				alert("An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		jeep.webdb.open();
		jeep.webdb.db.transaction(function(tx) {
			tx.executeSql("DROP TABLE input_info", []);
			tx.executeSql("CREATE TABLE IF NOT EXISTS input_info('id' INTEGER PRIMARY KEY ASC, 'data_type_id' INTEGER, 'label' VARCHAR(255), 'required' INTEGER, 'input_name' VARCHAR(255))", []);
		});
		
		
		$.each(input_info, function(idx, obj) {
			
			jeep.webdb.db.transaction(function(tx){
			tx.executeSql("INSERT INTO input_info(id, data_type_id, label, required, input_name) VALUES (?, ? , ?, ?, ?)",
				[obj.id, obj.data_type_id, obj.label, obj.required, obj.input_name],
				console.log("Synced Input Info"),
				console.log("Input Info Sync Failed")
			);
			
         	});
			
		});
		
	  }
	  
	  function loadServProject(){
		var project;
		$.ajax({
			async: false,
			dataType:"json",
			type: "GET",
			crossDomain: true,
			cache: false,
			url: url_extention+"get_project.php",
			contentType: "application/json; charset=utf-8",
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data){
				console.log(data);
				project = data;
			},
			error:function(xhr){
				alert("An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		jeep.webdb.open();
		jeep.webdb.db.transaction(function(tx) {
			tx.executeSql("DROP TABLE project", []);
			tx.executeSql("CREATE TABLE IF NOT EXISTS project('id' INTEGER PRIMARY KEY ASC, 'admin_id' INTEGER, 'name' VARCHAR(255), 'big_logo' VARCHAR(255), 'small_logo' VARCHAR(255), 'project_logo' VARCHAR(255), 'background' VARCHAR(255), 'start_date' DATETIME, 'end_date' DATETIME, 'date_time_created' DATETIME)", []);
		});
		
		
		$.each(project, function(idx, obj) {
			
			jeep.webdb.db.transaction(function(tx){
			tx.executeSql("INSERT INTO project(id, admin_id, name, big_logo, small_logo, project_logo, background, start_date, end_date, date_time_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
				[obj.id, obj.admin_id, obj.name, obj.big_logo, obj.small_logo, obj.project_logo, obj.background, obj.start_date, obj.end_date, obj.date_time_created],
				console.log("Synced Project"),
				console.log("Project Sync Failed")
			);
			
         	});
			
		});
		
	  }
	  
	  function loadServProjectDataCapture(){
		var project_data_capture;
		$.ajax({
			async: false,
			dataType:"json",
			type: "GET",
			crossDomain: true,
			cache: false,
			url: url_extention+"get_project_data_capture.php",
			contentType: "application/json; charset=utf-8",
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data){
				console.log(data);
				project_data_capture = data;
			},
			error:function(xhr){
				alert("An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		jeep.webdb.open();
		jeep.webdb.db.transaction(function(tx) {
			tx.executeSql("DROP TABLE project_data_capture", []);
			tx.executeSql("CREATE TABLE IF NOT EXISTS project_data_capture('id' INTEGER PRIMARY KEY ASC, 'proj_input_id' INTEGER, 'user_id' INTEGER, 'user_submission_num' INTEGER, 'project_id' INTEGER, 'value' VARCHAR(255), 'cur_lat' VARCHAR(255), 'cur_long' VARCHAR(255), 'date_time_created' DATETIME)", []);
		});
		
		
		$.each(project_data_capture, function(idx, obj) {
			
			jeep.webdb.db.transaction(function(tx){
			tx.executeSql("INSERT INTO project_data_capture(id, proj_input_id, user_id, user_submission_num, project_id, value, cur_lat, cur_long, date_time_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
				[obj.id, obj.proj_input_id, obj.user_id, obj.user_submission_num, obj.project_id, obj.value, obj.cur_lat, obj.cur_long, obj.date_time_created],
				console.log("Synced Project Data Capture"),
				console.log("Project Data Capture Sync Failed")
			);
			
         	});
			
		});
		
	  }
	  
	  function loadServProjInput(){
		var proj_input;
		$.ajax({
			async: false,
			dataType:"json",
			type: "GET",
			crossDomain: true,
			cache: false,
			url: url_extention+"get_proj_input.php",
			contentType: "application/json; charset=utf-8",
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data){
				console.log(data);
				proj_input = data;
			},
			error:function(xhr){
				alert("An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		jeep.webdb.open();
		jeep.webdb.db.transaction(function(tx) {
			tx.executeSql("DROP TABLE proj_input", []);
			tx.executeSql("CREATE TABLE IF NOT EXISTS proj_input('id' INTEGER PRIMARY KEY ASC, 'input_info_id' INTEGER, 'project_id' INTEGER)", []);
		});
		
		
		$.each(proj_input, function(idx, obj) {
			
			jeep.webdb.db.transaction(function(tx){
			tx.executeSql("INSERT INTO proj_input(id, input_info_id, project_id) VALUES (?, ?, ?)",
				[obj.id, obj.input_info_id, obj.project_id],
				console.log("Synced Proj Input"),
				console.log("Proj Input Sync Failed")
			);
			
         	});
			
		});
		
	  }
	  
	  function loadServSuperUser(){
		var super_user;
		$.ajax({
			async: false,
			dataType:"json",
			type: "GET",
			crossDomain: true,
			cache: false,
			url: url_extention+"get_super_user.php",
			contentType: "application/json; charset=utf-8",
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data){
				console.log(data);
				super_user = data;
			},
			error:function(xhr){
				alert("An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		jeep.webdb.open();
		jeep.webdb.db.transaction(function(tx) {
			tx.executeSql("DROP TABLE super_user", []);
			tx.executeSql("CREATE TABLE IF NOT EXISTS super_user('id' INTEGER PRIMARY KEY ASC, 'user_name' VARCHAR(255), 'password' VARCHAR(255), 'email' VARCHAR(255))", []);
		});
		
		
		$.each(super_user, function(idx, obj) {
			
			jeep.webdb.db.transaction(function(tx){
			tx.executeSql("INSERT INTO super_user(id, user_name, password, email) VALUES (?, ?, ?, ?)",
				[obj.id, obj.username, obj.password, obj.email],
				console.log("Synced Super User"),
				console.log("Super User Sync Failed")
			);
			
         	});
			
		});
		
	  }
	  
	  function loadServUser(){
		var user;
		$.ajax({
			async: false,
			dataType:"json",
			type: "GET",
			crossDomain: true,
			cache: false,
			url: url_extention+"get_user.php",
			contentType: "application/json; charset=utf-8",
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data){
				console.log(data);
				user = data;
			},
			error:function(xhr){
				alert("An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		jeep.webdb.open();
		jeep.webdb.db.transaction(function(tx) {
			tx.executeSql("DROP TABLE user", []);
			tx.executeSql("CREATE TABLE IF NOT EXISTS user('id' INTEGER PRIMARY KEY ASC, 'name' VARCHAR(255), 'date_time_in' DATETIME, 'cur_lat' VARCHAR(255), 'cur_long' VARCHAR(255), 'date_time_out' DATETIME)", []);
		});
		
		
		$.each(user, function(idx, obj) {
			
			jeep.webdb.db.transaction(function(tx){
			tx.executeSql("INSERT INTO user(id, name, date_time_in, cur_lat, cur_long, date_time_out) VALUES (?,?,?,?,?,?)",
				[obj.id, obj.name, obj.date_time_in, obj.cur_lat, obj.cur_long, obj.date_time_out],
				console.log("Synced Super User"),
				console.log("Super User Sync Failed")
			);
			
         	});
			
		});
		
	  }
	  
	  function setServProject(){
		
		var admin_id = document.getElementById("admin_id").value;
		
		var name = document.getElementById("project_name").value;
		var big_logo = document.getElementById("big_logo").files[0];
		var small_logo = document.getElementById("small_logo").files[0];
		var project_logo = document.getElementById("project_logo").files[0];
		var background = document.getElementById("background").files[0];
		var start_date = document.getElementById("start_date").value;
		var end_date = document.getElementById("end_date").value;
		
		var formdata = new FormData();
		
		formdata.append("admin_id", admin_id);
		
		formdata.append("name", name);
		formdata.append("big_logo", big_logo);
		formdata.append("small_logo", small_logo);
		formdata.append("project_logo", project_logo);
		formdata.append("background", background);
		formdata.append("start_date", start_date);
		formdata.append("end_date", end_date);
		
		console.log(formdata);
		
		$.ajax({
			async: false,
			type: "POST",
			data:formdata,
			crossDomain: true,
			cache: false,
			url: url_extention+"set_project.php",
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data, textStatus, jqXHR){
				//console.log(data, textStatus, jqXHR);
				alert("Uploaded to Server")
			},
			error:function(xhr){
				alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
	  }
	  
	   function setServDataType(){
		
		var data_type = document.getElementById("data_type").value;
		
		var formdata = new FormData();
		
		formdata.append("data_type", data_type);
		
		console.log(formdata);
		
		$.ajax({
			async: false,
			type: "POST",
			data:formdata,
			crossDomain: true,
			cache: false,
			url: url_extention+"set_data_type.php",
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data, textStatus, jqXHR){
				//console.log(data, textStatus, jqXHR);
				alert("Uploaded to Server")
			},
			error:function(xhr){
				alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		
		
	  }
	  
	  function setServNewInput(){
		
		var data_type_select = document.getElementById("data_type_select").value;
		var input_label = document.getElementById("input_label").value;
		var input_group_name = document.getElementById("input_group_name").value;
		var rec_feild = document.getElementById("rec_feild").value;
		
		var formdata = new FormData();
		
		formdata.append("data_type_select", data_type_select);
		formdata.append("input_label", input_label);
		formdata.append("input_group_name", input_group_name);
		formdata.append("rec_feild", rec_feild);
		
		console.log(formdata);
		
		$.ajax({
			async: false,
			type: "POST",
			data:formdata,
			crossDomain: true,
			cache: false,
			url: url_extention+"set_input_info.php",
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data, textStatus, jqXHR){
				//console.log(data, textStatus, jqXHR);
				alert("Uploaded to Server")
			},
			error:function(xhr){
				alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		
		
	  }
	  
	  function setServProjInput(){
		
		var project_select = document.getElementById("project_select").value;
		
		var select_inputs_checkboxes = document.getElementsByName('select_inputs');
		
		var select_inputs_checkboxes_arr = [];
		
		
		for (var i=0;i<select_inputs_checkboxes.length;i++) {
		  if (select_inputs_checkboxes[i].checked){
			select_inputs_checkboxes_arr.push(select_inputs_checkboxes[i].value);
		  }
		}
		
		var json_arr = JSON.stringify(select_inputs_checkboxes_arr);
		
		var formdata = new FormData();
		
		formdata.append("project_select", project_select);
		formdata.append("select_inputs_checkboxes_arr", select_inputs_checkboxes_arr);
		
		console.log(formdata);
		
		$.ajax({
			async: false,
			type: "POST",
			data:formdata,
			crossDomain: true,
			cache: false,
			url: url_extention+"set_proj_input.php",
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data, textStatus, jqXHR){
				console.log(data);
				alert("Uploaded to Server")
			},
			error:function(xhr){
				alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		
		
	  }
	  
	  function loadAllUsers(tx, rs) {
        var rowOutput = [];
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput.push(renderAllUsers(rs.rows.item(i)));
        }
		
		//AllUsers = JSON.stringify(rowOutput);
		AllUsers = rowOutput;
		//console.log(AllUsers);
		
		var formdata = new FormData();
		
		formdata.append("AllUsers", AllUsers);
		
		//console.log(formdata);
		
		$.ajax({
			async: false,
			type: "POST",
			data:formdata,
			crossDomain: true,
			cache: false,
			url: url_extention+"set_users.php",
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data, textStatus, jqXHR){
				console.log(data);
				//alert("Users Uploaded to Server");
				
				$('#User_Sync').html('').append('Users Have Synced').trigger('create');
			},
			error:function(xhr){
				alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
      }
	  
	  function loadAllUsersDataCap(tx, rs) {
        var rowOutput = [];
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput.push(renderAllUsersDataCap(rs.rows.item(i)));
		  console.log(rs.rows.item[0]);
        }
		
		//AllUsersDataCap = JSON.stringify(rowOutput);
		AllUsersDataCap = rowOutput;
		//console.log(AllUsersDataCap);
		
		var formdata = new FormData();
		
		formdata.append("AllUsersDataCap", AllUsersDataCap);
		
		//console.log(formdata);
		
		$.ajax({
			async: false,
			type: "POST",
			data:formdata,
			crossDomain: true,
			cache: false,
			url: url_extention+"set_data_cap.php",
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			beforeSend : function() {$.mobile.loading('show')},
    		complete   : function() {$.mobile.loading('hide')},
			success: function(data, textStatus, jqXHR){
				//console.log(data);
				//alert("Captured Data Uploaded to Server")
				$('#Data_Sync').html('').append('Captured Data Has Synced').trigger('create');
				/*
				jeep.webdb.open();
				jeep.webdb.db.transaction(function(tx) {
					tx.executeSql("DROP TABLE user", []);
					tx.executeSql("CREATE TABLE IF NOT EXISTS user('id' INTEGER PRIMARY KEY ASC, 'name' VARCHAR(255), 'date_time_in' DATETIME, 'cur_lat' VARCHAR(255), 'cur_long' VARCHAR(255), 'date_time_out' DATETIME)", []);
					tx.executeSql("DROP TABLE project_data_capture", []);
					tx.executeSql("CREATE TABLE IF NOT EXISTS project_data_capture('id' INTEGER PRIMARY KEY ASC, 'proj_input_id' INTEGER, 'user_id' INTEGER, 'user_submission_num' INTEGER, 'project_id' INTEGER, 'value' VARCHAR(255), 'cur_lat' VARCHAR(255), 'cur_long' VARCHAR(255), 'date_time_created' DATETIME)", []);
				});
				*/
				
			},
			error:function(xhr){
				alert("Error Uploading to Server \n An error " + xhr.status + " occured. \n Request Status: " + xhr.statusText);
			}
		});
		
		
		
      }