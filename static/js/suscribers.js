var co={};
var ta={};
$('.nav-pills.nav-save li.active').removeClass('active');
$('.nav-pills.nav-save li.nav-suscriber').addClass('active');
data=JSON.parse(decodeEntities()());
console.log(data);
function decodeEntities () {
  var element = document.createElement('div');
  function decodeHTMLEntities () {
	if(str && typeof str === 'string') {
	  // strip script/html tags
	  str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
	  str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
	  element.innerHTML = str;
	  str = element.textContent;
	  element.textContent = '';
	}
	return str;
  }
  return decodeHTMLEntities;
}
$(window).on("load",function(){
  str='';

  for (let i = 0; i < data.length; i++) {
	console.log(data[i]);
	str = '<tr data-id='+i+'><td ><input type="checkbox" class="select" data="'+data[i]["email"] +'"></td>';
	str+='<td class="email">'+data[i]["email"] +' </td>'
	  str+='<td >'+data[i]["phone"] +'</td>';
	  str+='<td >'+data[i]["first_name"] +'</td>';
	  str+='<td >'+data[i]["last_name"] +'</td>';
	  str+='<td >'+data[i]["created_at"] +'</td></tr>';
	  $("#rows12").append(str);
  }
  $(".select_all").change(function() {
	if(this.checked){
		$(".select").prop( "checked",true );
	}else{
	  $(".select").prop( "checked",false );
	}
});

  $(".field").on("change",function(){
	
	if($(this).val()=="tags"){
		console.log("wwer");
		$(".feild-value").show();
		if(Object.keys(ta).length==0){
			ta["No tag"]="No Tags ";
		}
		$( "#feildValue" ).autocomplete({
      		source: Object.keys(ta)
    	});
	}else if($(this).val()=="country"){
		$(".feild-value").show();
		$( "#feildValue" ).autocomplete({
      		source: Object.keys(co)
    	});

	}else{
		$(".feild-value").hide();
	}
});
 	$(".feild-value").on("change",function(){
		console.log($(".field").val(),"curren");
		let val = $(".feild-value").val();
		if(val==""){
			$("#rows12 tr").removeClass("selectedemail");
			$("#rows12 tr").show();
		}
		if($(".field").val()=="tags"){
		  	let c=ta[val];
		  	console.log(val,c,"dddd");
		  	callhide(c);

		}else if($(".field").val()=="country"){
		  let c=co[val];
		  callhide(c);
		  console.log(val,c,"dddd2");
	}

});
 	function callhide(c){
 		// console.log(c);
 		if(c){
		  		$("#rows12 tr").hide();
		  		$("#rows12 tr").removeClass("selectedemail");
		  		$(".select").prop( "checked",false )
		  		for(let i=0;i<c.length;i++){
		  			$("#rows12").find("[data-id=" + c[i] + "]").show().addClass("selectedemail");
		  		}
		  }
 	}


  getpre();

});

function gotoNext(){
	let node=  $(".selectedemail");
	let  email=[];
	if(node.length>0){
		$(".selectedemail .select:checkbox").filter(":checked").each(function(){
			email.push($(this).attr("data"));
		});
	}else{

		$(".select:checkbox").filter(":checked").each(function(){
			email.push($(this).attr("data"));
		});
	}
	console.log(email);
	localStorage.setItem("__sent",email);
	window.location.href="/getadminform/";
}

function getpre(){
	for(let i=0;i<data.length;i++){
		if(data[i]["tags"]&&data[i]["tags"]!=""){
			if(!ta[data[i]["tags"]]){
				ta[data[i]["tags"]]=[];
			}
			ta[data[i]["tags"]].push(i);
		}

		if(data[i]["addresses"]){
			for(let j=0;j<data[i]["addresses"].length;j++){
				if(data[i]["addresses"][j]["country"]!=""&&data[i]["addresses"][j]["country"]){
					if(!co[data[i]["addresses"][j]["country"]]){
						co[data[i]["addresses"][j]["country"]]=[];
					}
					if(co[data[i]["addresses"][j]["country"]].indexOf(i)<0){
					co[data[i]["addresses"][j]["country"]].push(i);}
				}
			}
		}
		if(data[i]["default_address"]&&data[i]["default_address"]["country"]&&co[data[i]["default_address"]["country"]].indexOf(i)>=0) continue;
		if(data[i]["default_address"]&&data[i]["default_address"]["country"]!=""&&data[i]["default_address"]["country"]){
			if(!co[data[i]["default_address"]["country"]]){
				co[data[i]["default_address"]["country"]]=[];
			}
			co[data[i]["default_address"]["country"]].push(i);
		}

	}    
}