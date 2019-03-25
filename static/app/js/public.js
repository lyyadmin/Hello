function toast(command) {
	if(command) {
		var tooltip = document.getElementById("toast");
		if(tooltip) {
			tooltip.innerHTML = command;
		} else {
			tooltip = document.createElement("div");
			var parent = document.getElementsByTagName("body")[0];
			var w = document.body.clientWidth;
			var h = window.screen.height;
			tooltip.style.position = "absolute";
			tooltip.id = "toast";
			tooltip.style.padding = "10px";
			tooltip.innerHTML = command;
			tooltip.style.width = w / 2 + "px";
			tooltip.style.height = "auto";
			tooltip.style.marginLeft = w / 4 + "px";
			tooltip.style.marginTop = (h / 2 - 10) + "px";
			tooltip.style.background = "rgba(0,0,0,0.6)";
			tooltip.style.textAlign = "center";
			tooltip.style.color = "#FFFFFF";
			tooltip.style.borderRadius = "10px";
			tooltip.style.fontSize = "20px";
			parent.appendChild(tooltip);
			setTimeout(function() {
				parent.removeChild(tooltip);
			}, 1000);
		}
	}
}

function setRaius(num) {
	var w = 0;
	if(num == "0") {
		w = 30;
	} else if(num == "1") {
		w = 66;
	} else if(num == "2") {
		w = 99;
	} else if(num == "3") {
		w = 132;
	} else if(num == "4") {
		w = 165;
	} else if(num == "5") {
		w = 200;
	}
	var pro = document.getElementById("progress");
	//				pro.innerHTML = w;
	$(pro).animate({
		width: w
	}, 50);
}

function input_voice() {
	var st = window.jni;
	if(st) {
		window.jni.startRecords("开始录音");
		startAnimal(true);
	} else {
		setanimal(true);
		var num = 50;

		function setinter() {
			num--;
			if(num < 0) {
				stopAnimal("结果",false);
			} else {
				setVoiceNumber(parseInt(Math.random() * 6));
				setTimeout(setinter, 100)
			}
		}
		setTimeout(setinter, 100)
	}
}

function setInputValue(str) {
	document.getElementById("home-search-text").value = str;
}

function runAlgorithm(param) {
	window.location = "paramchart.html?param=某地区降水量";
}

function setanimal(start) {
	if(start) {
		$(recordBox).show();
	} else {
		$(recordBox).hide();
	}
}

function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

function initVoiceAnimal() {
	var recordBox = document.getElementById("recordBox");
	var animalCanvas = document.createElement("canvas");
	recordBox.appendChild(animalCanvas);
	ctx = animalCanvas.getContext("2d");
	animalCanvas.width = 128;
	animalCanvas.height = 128;
	animalCanvas.style.marginTop = "-25px";
	img = new Image();
	img.onload = function() {
		isload = true;
		recordAnimal();
	}
	img.src = "/static/app/img/record_animal.png";
}

function startAnimal(b){
	setanimal(b);
}

function stopAnimal(msg,b){
	setanimal(b);
	setInputValue(msg);
}

function stopRecodeVoice(){
	setanimal(false);
}

function recordAnimal() {
	var index = 0;
	setTimeout(function() {
		if(index > 5) {
			index = 0;
		}
		ctx.clearRect(0, 0, 128, 128);
		ctx.drawImage(img, 0, 0, img.width / 6, img.height, 0, 0, 128, 128);
		ctx.drawImage(img, index * img.width / 6, 0, img.width / 6, img.height, 0, 0, 128, 128);
		index++;
	}, 200);
}

function setVoiceNumber(index) {
	if(isload) {
		ctx.clearRect(0, 0, 128, 128);
		ctx.drawImage(img, 0, 0, img.width / 6, img.height, 0, 0, 128, 128);
		ctx.drawImage(img, index * img.width / 6, 0, img.width / 6, img.height, 0, 0, 128, 128);
	}
}