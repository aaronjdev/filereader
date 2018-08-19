(function(){

	var model = {
		totalSize: 0,

		files: [],

		deleteFile: function(evt){
			var file = evt.target.value;
			this.files.splice(file,1);
		},
		calculateTotalSize:function(){
			this.totalSize = 0;
			for(var i=0; i<this.files.length;i++){
				this.totalSize += this.files[i][0].size;
			}
			return this.totalSize;
		},
		getTotalSize:function(){
			this.calculateTotalSize();
			return this.totalSize;
		},
		addFile: function(evt){
	    	this.files.push(evt.target.files);
		},
	};


	var controller = {
		init: function(){
			this.currView = "grid";
			document.getElementById('files').addEventListener('change', controller.handleFileSelect, false);

			viewGrid.init();
		},
		getFiles: function(){
			return model.files;
		},
		getTotalSize: function(){
			return model.getTotalSize(); 
		},
		removeFile: function(name){
			model.deleteFile(name);
			controller.refresh();
		},
		refresh: function(){
			//updates the total size
			viewOverview.init();

			//chooses which view to render
			if(this.currView === "list"){
				viewlist.init();
			} else {
				viewGrid.init();
			}
		},
	  	handleFileSelect(evt) {
	    	model.addFile(evt);
	      	controller.refresh();
	  	},
	  	addDeleteHandlers(){
	  		for (var i = 0; i<model.files.length; i++) 
	  		document.getElementById('remove'+i).addEventListener('click', controller.removeFile);
	  	},
	  	toggleView(){
	  		var toggleBtn = document.getElementById('toggleView');
	  		if (toggleBtn.value === "list view"){
	  			toggleBtn.value = "grid view";
	  			controller.currView = "list";
	  		} else {
	  			toggleBtn.value = "list view";
	  			controller.currView = "grid";
	  		}
	  		controller.refresh();

	  	},

	};
	var viewOverview = {
		init:function(){
			this.size = controller.getTotalSize();
			var toggleBtn = document.getElementById('toggleView');
			toggleBtn.addEventListener('click', controller.toggleView);

			this.render();
		},
		render: function(){
			document.getElementById('totalsize').innerHTML = this.size;
		},
	};

	var viewlist = {
		init: function(){
			this.fileListElem = document.getElementById('file-view');
			this.files = controller.getFiles();
			this.render();
		},
		render: function(){

		    var output = [];
		    for (var i = 0, f; f = this.files[i]; i++) {

		      output.push('<li><strong>', escape(f[0].name), '</strong> (', f[0].type || 'n/a', ') - ',
		                  f[0].size, ' bytes', 
		                  ' <button type="button" id="remove'+i+'" value="'+i+'">remove</button>', '</li>');
		    }
		    this.fileListElem.innerHTML = '<ul>' + output.join('') + '</ul>';
		    controller.addDeleteHandlers();
		}
	};

	var viewGrid = {
		init:function(){
			this.fileListElem = document.getElementById('file-view');
			this.files = controller.getFiles();
			this.render();
		},
		render: function(){
		    var output = [];
		    for (var i = 0, f; f = this.files[i]; i++) {

		      output.push('<div class="tile"><p><strong>', escape(f[0].name), '</strong></p> <p>', f[0].type || 'n/a', '</p> <p> ',
		                  f[0].size, ' bytes </p>', 
		                  ' <button type="button" id="remove'+i+'" value="'+i+'">remove</button>', '</div>');
		    }
		    this.fileListElem.innerHTML = '<div class="boxcontainer">' + output.join('') + '</div>';
		    controller.addDeleteHandlers();
		}
	}

	controller.init();
	})();
