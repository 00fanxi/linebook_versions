// log 파일을 읽어서 선 긋기
// function uploading_log(){
	//만약 west_id,east_id 둘다 값이 있다면 함수 자동 실행
if(document.querySelector('.west_name').value !== "" && document.querySelector('.east_name').value !== "" ){
		//먼저 해당 연결관리 페이지 위에 있는 sharenum 두개를 가져온다.
	var present_node_sharenums = document.querySelectorAll('.port_sharenum');
	var present_west_sharenum = 'p' + present_node_sharenums[0].value;
	var present_east_sharenum = 'p' + present_node_sharenums[1].value;

	//연결 정보 파일에서 해당 sharenum 두개가 속한 정보만 가져온다.
	var log_data = document.querySelector('.upload_log_file').value;
	if(log_data !== ""){
		var data_length = log_data.match(/;/g).length;
		var data_needed = ""
		for(var i = 0;i<data_length;i++){
			var index_div = log_data.indexOf(';')+1;
			var compare = log_data.slice(0,index_div);

			var index1 = compare.indexOf('(');
			var compare1 = compare.slice(1,index1);
			var index2 = compare.indexOf(',')+1;
			var index3 = compare.indexOf('[');
			var compare2 = compare.slice(index2,index3);

			//만약 compare에 sharenum두개가 현재 연결관리에 떠있는 포트들의 sharenum 두개와 일치한다면
			if((compare1 === present_west_sharenum && compare2 === present_east_sharenum)||(compare2 === present_west_sharenum && compare1 === present_east_sharenum)){
				data_needed += compare;
			}
			log_data = log_data.slice(index_div);
		}
		//가져온 sharenum 두개가 속한 정보들을 정보별로 나누고 하나씩 포트만 찾아서 연결 시켜준다.
		//만약 두개가 속한 정보가 없다면 여기서 끝
		if(data_needed !== ""){
			var data_needed_length = data_needed.match(/;/g).length;
			for(var i = 0; i < data_needed_length;i++){
				//port1
				var index4 = data_needed.indexOf('(');
				var index5 = data_needed.indexOf('(num ')+5;
				var index6 = data_needed.indexOf(')');
				var share1 = data_needed.slice(1,index4);
				var port1 = data_needed.slice(index5,index6);
				var west_point = document.querySelector(`#${share1} .${port1}`);
				//port2
				var index7 = data_needed.indexOf(',')+1;
				var index8 = data_needed.indexOf('[');
				var index9 = data_needed.indexOf('[num ')+5;
				var index10 = data_needed.indexOf(']');
				var share2 = data_needed.slice(index7,index8);
				var port2 = data_needed.slice(index9,index10);
				var east_point = document.querySelector(`#${share2} .${port2}`)

				//divide
				var index_div = data_needed.indexOf(';')+1;
				data_needed = data_needed.slice(index_div);

				var west_off = getOffset(west_point);
				var east_off = getOffset(east_point);
				// middle
				var x_w = west_off.left + west_off.width/2;
				var y_w = west_off.top + west_off.height/2;
				// middle
				var x_e = east_off.left + east_off.width/2;
				var y_e = east_off.top + east_off.height/2;
					// distance
				var length = Math.sqrt(((x_e-x_w) * (x_e-x_w)) + ((y_e-y_w) * (y_e-y_w)));
					// center
				var cx = ((x_w + x_e) / 2) - (length / 2);
				var cy = ((y_w + y_e) / 2) - (1 / 2);
						// angle
				var angle = Math.atan2((y_e-y_w),(x_e-x_w))*(180/Math.PI);
				// make hr
				var htmlLine = "<div class='line' style='padding:0px; margin:0px; height:" + 1 + "px; background-color:" + 'black' + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
				//
				document.body.innerHTML += htmlLine;
			}
		}
	}
}

///////////////////////////////////////////////////////////////////////
//연결관리용 함수
function connect_searching(){
	document.querySelector('#header_info').submit();
}

function connect_searching_center(){
	document.querySelector('.center_change').value="1";
	document.querySelector('#header_info').submit();
}

function connect_searching_west(){
	document.querySelector('.west_change').value="1";
	document.querySelector('#header_info').submit();
}

function connect_searching_east(){
	document.querySelector('.east_change').value="1";
	document.querySelector('#header_info').submit();
}

//선택한 포트를 연결
function connecting(){
	//연결을 하면 바로 선을 긋는게 아니라 upload_log_file에 올리고 uploading_log()를 통해서 줄을 긋는다.
	//만약 각 포트 당 선택된 포트가 둘 이상이라면 연결하지 않고 알림창을 띄운다.
	//만약 선택한 두 포트가 이미 서로 연결되어 있는 포트라면 (upload_log_file 확인) alert
  var west_point_number = document.querySelectorAll('.west_port #Sel');
  var east_point_number = document.querySelectorAll('.east_port #Sel');

	//먼저 연결할 두 포트의 sharenum과 class를 가져오고
	var west_point = document.querySelector('.west_port #Sel');
	var east_point = document.querySelector('.east_port #Sel');

	var sharenums = document.querySelectorAll(".port_sharenum");

	var west_sharenum = sharenums[0].value;
	var east_sharenum = sharenums[1].value;

	var log_data = document.querySelector('.upload_log_file').value

  if(west_point_number.length !=1 || east_point_number.length != 1){
 	  alert('연결을 하시려면 각 단자에서 포트를 하나씩 선택하셔야 합니다.')
	//두 포트가 이미 연결되어 있는지 확인
  }else if(log_data.indexOf(`<p${west_sharenum}(${west_point.className}),p${east_sharenum}[${east_point.className}]>;`) != -1 || log_data.indexOf(`<p${east_sharenum}(${east_point.className}),p${west_sharenum}[${west_point.className}]>;`) != -1){
 	  alert('이미 서로 연결되어 있는 포트 입니다.')
  }else{

  	document.querySelector('.upload_log_file').value += `<p${west_sharenum}(${west_point.className}),p${east_sharenum}[${east_point.className}]>;`;

		//json으로 만든 연결정보 upload_log_file_json에 저장
		// if(document.querySelector('.upload_log_file_json').value
		// document.querySelector('.upload_log_file_json').value += `{sharenumW:${west_sharenum},portnumW:${west_point.className}},sharenumE:${east_sharenum},portnumE:${east_point.className}`;

		//색이랑 title바꾸기

		var west_opp = document.querySelector('.west_opp').value;
		var east_opp = document.querySelector('.east_opp').value;
		var west_name = document.querySelector('.west_name').value;
		var east_name = document.querySelector('.east_name').value;

		//west방면
		if(document.querySelector('.west_port #Sel').style.background != 'green' && document.querySelector('.west_port #Sel').style.background != 'orange'){
			document.querySelector('.west_port #Sel').style.background = 'green';
			document.querySelector('.west_port #Sel').title = `<현재 연결되어 있는 포트>
${east_opp}로 가는 ${east_name}포트의 ${east_point.className.slice(5)}번 단자`
			document.querySelector('.west_port #capable').innerText = Number(document.querySelector('.west_port #capable').innerText)-1;
			document.querySelector('.west_port #occupying').innerText = Number(document.querySelector('.west_port #occupying').innerText)+1;

		}else if(document.querySelector('.west_port #Sel').style.background === 'green'){
			document.querySelector('.west_port #Sel').style.background = 'orange';

			var org_title = document.querySelector('.west_port #Sel').title;
			var lines = org_title.split('\n');
			lines.splice(1,0,`[상태 : 브릿지]`,`[브릿지 수 : 2]`);
			var newtext = lines.join('\n');
			document.querySelector('.west_port #Sel').title = newtext;
			document.querySelector('.west_port #Sel').title += `
${east_opp}로 가는 ${east_name}포트의 ${east_point.className.slice(5)}번 단자`

			document.querySelector('.west_port #Bridge').innerText = Number(document.querySelector('.west_port #Bridge').innerText)+1;

		}else if(document.querySelector('.west_port #Sel').style.background === 'orange'){
			var log_data = document.querySelector('.upload_log_file').value;
			var pattern = new RegExp(`${west_sharenum}.${west_point.className}`,'g');
			var match = log_data.match(pattern);

			var org_title = document.querySelector('.west_port #Sel').title;
			var lines = org_title.split('\n');
			// var last_number = lines.length -3;
			lines.splice(2,1);
			lines.splice(2,0,`[브릿지 수 : ${match.length}]`)
			var newtext = lines.join('\n');
			document.querySelector('.west_port #Sel').title = newtext;
			document.querySelector('.west_port #Sel').title += `
${east_opp}로 가는 ${east_name}포트의 ${east_point.className.slice(5)}번 단자`
		}
		//east 방면
		if(document.querySelector('.east_port #Sel').style.background != 'green' && document.querySelector('.east_port #Sel').style.background != 'orange'){
			document.querySelector('.east_port #Sel').style.background = 'green';
			document.querySelector('.east_port #Sel').title = `<현재 연결되어 있는 포트>
${west_opp}로 가는 ${west_name}포트의 ${west_point.className.slice(5)}번 단자`
			document.querySelector('.east_port #capable').innerText = Number(document.querySelector('.east_port #capable').innerText)-1;
			document.querySelector('.east_port #occupying').innerText = Number(document.querySelector('.east_port #occupying').innerText)+1;

		}else if(document.querySelector('.east_port #Sel').style.background === 'green'){
			document.querySelector('.east_port #Sel').style.background = 'orange';

			var org_title = document.querySelector('.east_port #Sel').title;
			var lines = org_title.split('\n');
			lines.splice(1,0,`[상태 : 브릿지]`,`[브릿지 수 : 2]`);
			var newtext = lines.join('\n');
			document.querySelector('.east_port #Sel').title = newtext;
			document.querySelector('.east_port #Sel').title += `
${west_opp}로 가는 ${west_name}포트의 ${west_point.className.slice(5)}번 단자`

			document.querySelector('.east_port #Bridge').innerText = Number(document.querySelector('.east_port #Bridge').innerText)+1;

		}else if(document.querySelector('.east_port #Sel').style.background === 'orange'){
			var log_data = document.querySelector('.upload_log_file').value;
			var pattern = new RegExp(`${east_sharenum}.${east_point.className}`,'g');
			var match = log_data.match(pattern);

			var org_title = document.querySelector('.east_port #Sel').title;
			var lines = org_title.split('\n');
			// var last_number = lines.length -3;
			lines.splice(2,1);
			lines.splice(2,0,`[브릿지 수 : ${match.length}]`)
			var newtext = lines.join('\n');
			document.querySelector('.west_port #Sel').title = newtext;
			document.querySelector('.west_port #Sel').title += `
${west_opp}로 가는 ${west_name}포트의 ${west_point.className.slice(5)}번 단자`
		}
		//id 원래대로 되돌리기
		document.querySelector('.west_port #Sel').id = 'nUm';
	  document.querySelector('.east_port #Sel').id = 'nUm';

		//화면상의 줄을 전부 없앤다.
		var lines = document.querySelectorAll('.line');
		for(var i = 0;i<lines.length;i++){
			lines[i].remove();
		}
		uploading_log();
  }
}

 window.drawing_line = function() {

	 var west_point = document.querySelector('.west_port #Sel');
	 var east_point = document.querySelector('.east_port #Sel');

	 var sharenums = document.querySelectorAll(".port_sharenum");

	 var west_sharenum = sharenums[0].value;
	 var east_sharenum = sharenums[1].value;

	 document.querySelector('.log_connects').value += `<p${west_sharenum}(${west_point.className}),p${east_sharenum}[${east_point.className}]>;`;

	 connect(west_point, east_point, "black", 1);
	 document.querySelector('.west_port #Sel').id = 'nUm';
	 document.querySelector('.east_port #Sel').id = 'nUm';
 }

 function getOffset( el ) {
     var rect = el.getBoundingClientRect();
     return {
         left: rect.left + window.pageXOffset,
         top: rect.top + window.pageYOffset,
         width: rect.width,
         height: rect.height
     };
 }

function connect(west_point, east_point, color, thickness) {
     var west_off = getOffset(west_point);
     var east_off = getOffset(east_point);
     // middle
     var x_w = west_off.left + west_off.width/2;
     var y_w = west_off.top + west_off.height/2;
    // middle
    var x_e = east_off.left + east_off.width/2;
    var y_e = east_off.top + east_off.height/2;
	    // distance
    var length = Math.sqrt(((x_e-x_w) * (x_e-x_w)) + ((y_e-y_w) * (y_e-y_w)));
	    // center
    var cx = ((x_w + x_e) / 2) - (length / 2);
    var cy = ((y_w + y_e) / 2) - (thickness / 2);
	//svg는 부피가 있어서 선만 필요한 이 경우에 맞지 않는다.
	// document.body.innerHTML += `<svg height="100%" width="100%" style="position:absolute; z-index:3"> <line x1=${x_w} y1=${y_w} x2=${x_e} y2=${y_e} style="position:absolute; z-index:3" stroke="black" />	</svg>`;
	    // angle
    var angle = Math.atan2((y_e-y_w),(x_e-x_w))*(180/Math.PI);
    // make hr
    var htmlLine = "<div class='line' style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    //
    document.body.innerHTML += htmlLine;
}

//클릭했을 때 변화 (애니매이션) nUm을 Sel로 바꾸어 적용 (need some better idea.)
function selecting(e) {
	e = e || document.event;
	var target = e.target || e.Event.target;
	if(target.id==='nUm'){
		target.id = 'Sel'
	}else if(target.id==='Sel'){
		target.id = 'nUm'
	}
}

//포트 더블 클릭 했을 때 연결된 포트 파란색으로 바꾸어 주기(이 상태에서는 저장 불가)
function displaying_connects(e){
	e = e || document.event;
	var target = e.target || e.Event.target;
	//target은 반드시 하나만 선택될 수 있도록 제약을 걸 것.
	//만약 필드 위에 target이 이미 있으면
	if(target.id==='nUm' || target.id==='Sel'){
		target.id = 'target';

		//더블 클릭된 포트의 클래스와 속한 sharenum을 불러오고 다른 쪽 포트의 sharenum도 불러온다.
		if(document.querySelector('.west_port #target') === target){
			var target_sharenum = document.querySelector('.west_port .port_sharenum').value;
			var other_sharenum = document.querySelector('.east_port .port_sharenum').value;
		}else if(document.querySelector('.east_port #target') === target){
			var target_sharenum = document.querySelector('.east_port .port_sharenum').value;
			var other_sharenum = document.querySelector('.west_port .port_sharenum').value;
		}
		//upload_log_file에서 target_sharenum과 target의 클래스가 일치하며 other_sharenum까지 일치하는 div가 있으면 가져와서 other_sharenum의 class에 필드에서 target효과 적용.
		var log_data = document.querySelector('.upload_log_file').value;
		var judge_exist = 0;
		if(log_data !== ""){
			var data_length = log_data.match(/;/g).length;

			for(var i = 0;i<data_length;i++){
				var index_div = log_data.indexOf(';')+1;
				var compare = log_data.slice(0,index_div);

				var index1 = compare.indexOf('(');
				var compare_share1 = compare.slice(1,index1);
				var index2 = compare.indexOf(',')+1;
				var index3 = compare.indexOf('[');
				var compare_share2 = compare.slice(index2,index3);

				var index4 = compare.indexOf('(')+1;
				var index5 = compare.indexOf(')')
				var compare_class1 = compare.slice(index4,index5);
				var index6 = compare.indexOf('[')+1;
				var index7 = compare.indexOf(']')
				var compare_class2 = compare.slice(index6,index7);
				//compare1이 target일 때
				if(compare_share1 === 'p'+target_sharenum && compare_class1 === target.className && compare_share2 === 'p'+other_sharenum){
					var n_class = compare_class2.slice(4);
					document.querySelector(`#${compare_share2} .${n_class}`).id = 'target';

					judge_exist = 1;
				//compare2가 target일 때
				}else if(compare_share2 === 'p'+target_sharenum && compare_class2 === target.className && compare_share1 === 'p'+other_sharenum){
					var n_class = compare_class1.slice(4);
					document.querySelector(`#${compare_share1} .${n_class}`).id = 'target';

					judge_exist = 1;
				}
				log_data = log_data.slice(index_div);
				// target.id = 'nUm';
			}
		}
		if(judge_exist === 0){
			alert('현재 필드 위에 선택하신 포트와 연결된 포트가 없습니다.')
			target.id = 'nUm';
		}
		}
	}

//폰트가 파란색(연결포트보기)혹은 빨간색(연결해제)으로 되있는 모든 포트들을 원래대로 돌린다.
function cancel_targeting(){
		var all = document.querySelectorAll('span');
		for(var i = 0;i<all.length;i++){
			if(all[i].id === 'target' || all[i].id === 'target2'){
				all[i].id = 'nUm';
			}
		}
}

//연결 정보 저장

function connect_saving(){
	cancel_targeting();
	var str = document.body.innerHTML;
	document.querySelector(".save_whole").value = str;
	document.querySelector(".center_name_s").value = document.querySelector(".center_this").value;
	document.querySelector(".west_node_s").value = document.querySelector(".west_opp").value;
	document.querySelector(".east_node_s").value = document.querySelector(".east_opp").value;
	document.querySelector(".west_port_sharenum").value = document.querySelector(".west_port .port_sharenum").value;
	document.querySelector(".east_port_sharenum").value = document.querySelector(".east_port .port_sharenum").value;
}

document.addEventListener('dblclick',displaying_connects)

document.addEventListener('click',selecting)

document.addEventListener('click',cancel_targeting);

//연결해제 함수
document.addEventListener('contextmenu', e => {
	e = e || document.event;
	var target = e.target || e.Event.target;

	if(target.id === 'nUm'){
		target.id = 'target2';
		e.preventDefault();
	}else if(target.id === 'target2'){
		target.id = 'nUm';
		e.preventDefault();
	}

});

//타겟 설정후에 실제로 파일에서 정보를 삭제하여 연결을 해제시키는 함수.
function disconnecting_ports(){
	//연결해제 할 때 신경써야 될거 1. 연결관리 파일(.upload_log_file)에서 연결 정보 삭제 2.title 변경 3.display 숫자 변경 4. id변경 5. style(background)변경

	//만약 각 포트 당 선택된 포트가 둘 이상이라면 연결하지 않고 알림창을 띄운다.
	var west_point_number = document.querySelectorAll('.west_port #target2');
	var east_point_number = document.querySelectorAll('.east_port #target2');

	var west_target_back = document.querySelector('.west_port #target2').style.background;
	var east_target_back = document.querySelector('.east_port #target2').style.background;

	if(west_point_number.length !=1 || east_point_number.length != 1){
		alert('연결해제를 진행하시려면 각 단자에서 포트를 하나씩 선택하셔야 합니다.')

		for(var i = 0;i<west_point_number;i++){
			document.querySelector('.west_port #target2').id = 'nUm';
		}
		for(var i = 0;i<east_point_number;i++){
			document.querySelector('.east_port #target2').id = 'nUm';
		}
	}else if((west_target_back !== 'green' && west_target_back !== 'orange') || (east_target_back !== 'green' && east_target_back !== 'orange')){
		alert('선택하신 포트들은 서로 연결되어 있지 않습니다.')
		document.querySelector('.west_port #target2').id = 'nUm';
		document.querySelector('.east_port #target2').id = 'nUm';
	}else{
		//먼저 target된 두 포트의 sharenum과 class를 가져오고
		var present_node_sharenums = document.querySelectorAll('.port_sharenum');
		var present_west_sharenum = 'p' + present_node_sharenums[0].value;
		var present_east_sharenum = 'p' + present_node_sharenums[1].value;

		var west_class = document.querySelector('.west_port #target2').className;
		var east_class = document.querySelector('.east_port #target2').className;

		var t1 = `<${present_west_sharenum}(${west_class}),${present_east_sharenum}[${east_class}]>`
		var t2 = `<${present_east_sharenum}(${east_class}),${present_west_sharenum}[${west_class}]>`
		//그 두 쌍이 함께 있는 연결정보가 있는지 확인한다.
		//없으면 alert 있으면 우선 upload_log_file에서 그 정보 삭제. 저장을 눌렀을 시 서브밋해서 해당 파일에 upload_log_file을 덮어씌운다. 그 후 마지막으로 리로드.
		//브릿지였던 포트는 연결정보 파일에 해당 포트에 관련된 정보가 하나밖에 안남았으면 녹색으로 바뀌고 두개 이상이면 그대로 오랜지, 원래 녹색이었던 포트는 흰색으로 돌아가고 display에도 반영.
		var log_data = document.querySelector('.upload_log_file').value;
		var log_data_org = document.querySelector('.upload_log_file').value;

		if(log_data.indexOf(t1) === -1 && log_data.indexOf(t2) === -1){
			alert('선택하신 포트들은 서로 연결되어 있지 않습니다.');
			document.querySelector('.west_port #target2').id = 'nUm';
			document.querySelector('.east_port #target2').id = 'nUm';
		// 이하 두개의 상황에서만 연결해제를 진행한다.
		}else if(log_data.indexOf(t1) !== -1 ){

			var index1 = log_data.indexOf(t1);
			var index2 = log_data.indexOf(t1)+t1.length+1;
			log_data = log_data.slice(0,index1) + log_data.slice(index2);
			//west 방면
			//타겟이 녹색일때
			if(document.querySelector('.west_port #target2').style.background === 'green'){
				document.querySelector('.west_port #target2').removeAttribute("style");
				document.querySelector('.west_port #target2').removeAttribute("title");
				document.querySelector('.west_port #capable').innerText = Number(document.querySelector('.west_port #capable').innerText)+1;
				document.querySelector('.west_port #occupying').innerText = Number(document.querySelector('.west_port #occupying').innerText)-1;
			//타겟이 오렌지일 때
			}else if(document.querySelector('.west_port #target2').style.background === 'orange'){
				var pattern = new RegExp(`${present_west_sharenum}.${west_class}`,'g');
				var match = log_data.match(pattern);

				var west_opp = document.querySelector('.west_opp').value;
				var east_opp = document.querySelector('.east_opp').value;
				var west_name = document.querySelector('.west_name').value;
				var east_name = document.querySelector('.east_name').value;
				//남은 연결이 2개 이상(여전히 브릿지)
				if(match.length > 1){
					var org_title = document.querySelector('.west_port #target2').title;
					var lines = org_title.split('\n');
					var index = lines.indexOf(`${east_opp}로 가는 ${east_name}포트의 ${east_class.slice(5)}번 단자`);
					lines.splice(index,1);
					lines.splice(2,1);
					lines.splice(2,0,`[브릿지 수 : ${match.length}]`)
					var newtext = lines.join('\n');
					document.querySelector('.west_port #target2').title = newtext;
				//남은 연결이 1개 (브릿지 해제)
				}else if(match.length===1){
					document.querySelector('.west_port #target2').style.background = 'green';

					var org_title = document.querySelector('.west_port #target2').title;
					var lines = org_title.split('\n');
					var index = lines.indexOf(`${east_opp}로 가는 ${east_name}포트의 ${east_class.slice(5)}번 단자`);
					lines.splice(index,1);
					lines.splice(1,1);
					lines.splice(1,1);
					var newtext = lines.join('\n');
					document.querySelector('.west_port #target2').title = newtext;

					document.querySelector('.west_port #Bridge').innerText = Number(document.querySelector('.west_port #Bridge').innerText)-1;
				}
			}
			//east 방면
			//타겟이 녹색일때
			if(document.querySelector('.east_port #target2').style.background === 'green'){
				document.querySelector('.east_port #target2').removeAttribute("style");
				document.querySelector('.east_port #target2').removeAttribute("title");
				document.querySelector('.east_port #capable').innerText = Number(document.querySelector('.east_port #capable').innerText)+1;
				document.querySelector('.east_port #occupying').innerText = Number(document.querySelector('.east_port #occupying').innerText)-1;
			//타겟이 오렌지일 때
			}else if(document.querySelector('.east_port #target2').style.background === 'orange'){
				var pattern = new RegExp(`${present_east_sharenum}.${east_class}`,'g');
				var match = log_data.match(pattern);
				//남은 연결이 2개 이상(여전히 브릿지)
				if(match.length > 1){
					var org_title = document.querySelector('.east_port #target2').title;
					var lines = org_title.split('\n');
					var index = lines.indexOf(`${west_opp}로 가는 ${west_name}포트의 ${west_class.slice(5)}번 단자`);
					lines.splice(index,1);
					lines.splice(2,1);
					lines.splice(2,0,`[브릿지 수 : ${match.length}]`)
					var newtext = lines.join('\n');
					document.querySelector('.east_port #target2').title = newtext;
				//남은 연결이 1개 (브릿지 해제)
				}else if(match.length===1){
					document.querySelector('.east_port #target2').style.background = 'green';
					var org_title = document.querySelector('.east_port #target2').title;
					var lines = org_title.split('\n');
					var index = lines.indexOf(`${west_opp}로 가는 ${west_name}포트의 ${west_class.slice(5)}번 단자`);
					lines.splice(index,1);
					lines.splice(1,1);
					lines.splice(1,1);
					var newtext = lines.join('\n');
					document.querySelector('.east_port #target2').title = newtext;

					document.querySelector('.east_port #Bridge').innerText = Number(document.querySelector('.east_port #Bridge').innerText)-1;
				}
			}
			document.querySelector('.west_port #target2').id = 'nUm';
			document.querySelector('.east_port #target2').id = 'nUm';

			document.querySelector('.upload_log_file').value = log_data;

		}else if(log_data.indexOf(t2) !== -1 ){
			var index1 = log_data.indexOf(t2);
			var index2 = log_data.indexOf(t2)+t2.length+1;
			log_data = log_data.slice(0,index1) + log_data.slice(index2);
			//west 방면
			//타겟이 녹색일때
			if(document.querySelector('.west_port #target2').style.background === 'green'){
				document.querySelector('.west_port #target2').removeAttribute("style");
				document.querySelector('.west_port #target2').removeAttribute("title");
				document.querySelector('.west_port #capable').innerText = Number(document.querySelector('.west_port #capable').innerText)+1;
				document.querySelector('.west_port #occupying').innerText = Number(document.querySelector('.west_port #occupying').innerText)-1;
			//타겟이 오렌지일 때
			}else if(document.querySelector('.west_port #target2').style.background === 'orange'){
				var pattern = new RegExp(`${present_west_sharenum}.${west_class}`,'g');
				var match = log_data.match(pattern);

				var west_opp = document.querySelector('.west_opp').value;
				var east_opp = document.querySelector('.east_opp').value;
				var west_name = document.querySelector('.west_name').value;
				var east_name = document.querySelector('.east_name').value;
				//남은 연결이 2개 이상(여전히 브릿지)
				if(match.length > 1){
					var org_title = document.querySelector('.west_port #target2').title;
					var lines = org_title.split('\n');
					var index = lines.indexOf(`${east_opp}로 가는 ${east_name}포트의 ${east_class.slice(5)}번 단자`);
					lines.splice(index,1);
					lines.splice(2,1);
					lines.splice(2,0,`[브릿지 수 : ${match.length}]`)
					var newtext = lines.join('\n');
					document.querySelector('.west_port #target2').title = newtext;
				//남은 연결이 1개 (브릿지 해제)
				}else if(match.length===1){
					document.querySelector('.west_port #target2').style.background = 'green';

					var org_title = document.querySelector('.west_port #target2').title;
					var lines = org_title.split('\n');
					var index = lines.indexOf(`${east_opp}로 가는 ${east_name}포트의 ${east_class.slice(5)}번 단자`);
					lines.splice(index,1);
					lines.splice(1,1);
					lines.splice(1,1);
					var newtext = lines.join('\n');
					document.querySelector('.west_port #target2').title = newtext;

					document.querySelector('.west_port #Bridge').innerText = Number(document.querySelector('.west_port #Bridge').innerText)-1;
				}
			}
			//east 방면
			//타겟이 녹색일때
			if(document.querySelector('.east_port #target2').style.background === 'green'){
				document.querySelector('.east_port #target2').removeAttribute("style");
				document.querySelector('.east_port #target2').removeAttribute("title");
				document.querySelector('.east_port #capable').innerText = Number(document.querySelector('.east_port #capable').innerText)+1;
				document.querySelector('.east_port #occupying').innerText = Number(document.querySelector('.east_port #occupying').innerText)-1;
			//타겟이 오렌지일 때
			}else if(document.querySelector('.east_port #target2').style.background === 'orange'){
				var pattern = new RegExp(`${present_east_sharenum}.${east_class}`,'g');
				var match = log_data.match(pattern);
				//남은 연결이 2개 이상(여전히 브릿지)
				if(match.length > 1){
					var org_title = document.querySelector('.east_port #target2').title;
					var lines = org_title.split('\n');
					var index = lines.indexOf(`${west_opp}로 가는 ${west_name}포트의 ${west_class.slice(5)}번 단자`);
					lines.splice(index,1);
					lines.splice(2,1);
					lines.splice(2,0,`[브릿지 수 : ${match.length}]`)
					var newtext = lines.join('\n');
					document.querySelector('.east_port #target2').title = newtext;
				//남은 연결이 1개 (브릿지 해제)
				}else if(match.length===1){
					document.querySelector('.east_port #target2').style.background = 'green';

					var org_title = document.querySelector('.east_port #target2').title;
					var lines = org_title.split('\n');
					var index = lines.indexOf(`${west_opp}로 가는 ${west_name}포트의 ${west_class.slice(5)}번 단자`);
					lines.splice(index,1);
					lines.splice(1,1);
					lines.splice(1,1);
					var newtext = lines.join('\n');
					document.querySelector('.east_port #target2').title = newtext;

					document.querySelector('.east_port #Bridge').innerText = Number(document.querySelector('.east_port #Bridge').innerText)-1;
				}
			}
			document.querySelector('.west_port #target2').id = 'nUm';
			document.querySelector('.east_port #target2').id = 'nUm';

			document.querySelector('.upload_log_file').value = log_data;
		}
	}
	//화면상의 줄을 전부 없앤다.
	var lines = document.querySelectorAll('.line');
	for(var i = 0;i<lines.length;i++){
		lines[i].remove();
	}
	uploading_log();
}

//연결관리 저장
function connect_submit() {
	document.querySelector('.connect_saver').submit();
}

function goBack(){
	window.history.back();
	location.reload();
}

function uploading_log(){
		//먼저 해당 연결관리 페이지 위에 있는 sharenum 두개를 가져온다.
	var present_node_sharenums = document.querySelectorAll('.port_sharenum');
	var present_west_sharenum = 'p' + present_node_sharenums[0].value;
	var present_east_sharenum = 'p' + present_node_sharenums[1].value;

	//연결 정보 파일에서 해당 sharenum 두개가 속한 정보만 가져온다.
	var log_data = document.querySelector('.upload_log_file').value;
	if(log_data !== ""){
		var data_length = log_data.match(/;/g).length;
		var data_needed = ""
		for(var i = 0;i<data_length;i++){
			var index_div = log_data.indexOf(';')+1;
			var compare = log_data.slice(0,index_div);

			var index1 = compare.indexOf('(');
			var compare1 = compare.slice(1,index1);
			var index2 = compare.indexOf(',')+1;
			var index3 = compare.indexOf('[');
			var compare2 = compare.slice(index2,index3);

			//만약 compare에 sharenum두개가 현재 연결관리에 떠있는 포트들의 sharenum 두개와 일치한다면
			if((compare1 === present_west_sharenum && compare2 === present_east_sharenum)||(compare2 === present_west_sharenum && compare1 === present_east_sharenum)){
				data_needed += compare;
			}
			log_data = log_data.slice(index_div);
		}
		//가져온 sharenum 두개가 속한 정보들을 정보별로 나누고 하나씩 포트만 찾아서 연결 시켜준다.
		//만약 두개가 속한 정보가 없다면 여기서 끝
		if(data_needed !== ""){
			var data_needed_length = data_needed.match(/;/g).length;
			for(var i = 0; i < data_needed_length;i++){
				//port1
				var index4 = data_needed.indexOf('(');
				var index5 = data_needed.indexOf('(num ')+5;
				var index6 = data_needed.indexOf(')');
				var share1 = data_needed.slice(1,index4);
				var port1 = data_needed.slice(index5,index6);
				var west_point = document.querySelector(`#${share1} .${port1}`);
				//port2
				var index7 = data_needed.indexOf(',')+1;
				var index8 = data_needed.indexOf('[');
				var index9 = data_needed.indexOf('[num ')+5;
				var index10 = data_needed.indexOf(']');
				var share2 = data_needed.slice(index7,index8);
				var port2 = data_needed.slice(index9,index10);
				var east_point = document.querySelector(`#${share2} .${port2}`)

				//divide
				var index_div = data_needed.indexOf(';')+1;
				data_needed = data_needed.slice(index_div);

				var west_off = getOffset(west_point);
				var east_off = getOffset(east_point);
				// middle
				var x_w = west_off.left + west_off.width/2;
				var y_w = west_off.top + west_off.height/2;
				// middle
				var x_e = east_off.left + east_off.width/2;
				var y_e = east_off.top + east_off.height/2;
					// distance
				var length = Math.sqrt(((x_e-x_w) * (x_e-x_w)) + ((y_e-y_w) * (y_e-y_w)));
					// center
				var cx = ((x_w + x_e) / 2) - (length / 2);
				var cy = ((y_w + y_e) / 2) - (1 / 2);
						// angle
				var angle = Math.atan2((y_e-y_w),(x_e-x_w))*(180/Math.PI);
				// make hr
				var htmlLine = "<div class='line' style='padding:0px; margin:0px; height:" + 1 + "px; background-color:" + 'black' + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
				//
				document.body.innerHTML += htmlLine;
			}
		}
	}
}
