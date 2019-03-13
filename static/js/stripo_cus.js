$('.nav-pills.nav-save li.active').removeClass('active');
$('.nav-pills.nav-save li.nav-edi').addClass('active');
// let strhtm = '<button class="btn btn-info" onclick="only_save()" >Save</button>';
    // strhtm += '';
   let strhtm ='<input id="prev" class="preview " type ="button" value="Preview" onclick="preview_tmp()" >';
    strhtm +=' <input id="testEmail" class="test-email" type ="button" value="Test email" onclick="sendEmail()" >';
 $(window).on('load',function(){
    $('.pull-right').html(strhtm);
 });
let urrr=window.location.href;
var url = new URL(urrr);
var c = url.searchParams.get("template");
if(!c){
    c=localStorage.getItem("template");
    window.location.href = '/customTemplate/'+"?template="+c+(url.searchParams.has("back")?"&back":"");
}

function preview_tmp(){

    var $lightbox = $('#lightbox');
    jQuery('.loader1').fadeIn('slow');
    getcompiledaction(function(html){
        console.log(html);
        // $('.xys').trigger('click');
        jQuery('.loader1').fadeOut('slow');
        $lightbox.find('.contenthtml').html(html);
        $('#lightbox').modal('show');
    });
}

function gotoNext(){ 
    only_save();
    console.log("ss");
    getcompiledaction(function(exx){
        console.log("call",exx);
        localStorage.setItem("compiled_lt0", exx);
        window.location.href = '/suscribers/';
    });
     let urrr=window.location.href;
    var url = new URL(urrr);
    var c = url.searchParams.get("template");
    console.log(c);
    localStorage.setItem("template",c);
    // save_to_local();
}

function getcompiledaction(callback){
    window.StripoApi.compileEmail(action);
    function action(err,html){
        if(!err){
            callback(html);
        }
    }    
}


function request(method, url, data, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            callback(req.responseText);
        } else if (req.readyState === 4 && req.status !== 200) {
            console.error('Can not complete request. Please check you entered a valid PLUGIN_ID and SECRET_KEY values');
        }
    };
    req.open(method, url, true);
    if (method !== 'GET') {
        req.setRequestHeader('content-type', 'application/json');
    }
    req.send(data);
}


function loadDemoTemplate(callback) {
    jQuery('.loader').fadeIn('slow');
    let Template_url_css=document.getElementById("tempname").value +".css"
    let Template_url_html=document.getElementById("tempname").value+".html"
    console.log(Template_url_html,Template_url_css);
    request('GET', Template_url_html, null, function(html) {
        request('GET', Template_url_css, null, function(css) {
            // console.log(html,css);
            if((html||css)){
                callback({html: html, css: css});
            }    
        });
    });
}


function initPlugin(template) {
            const apiRequestData = {
                emailId: 'anil.kumar@ebizontek.com'
            };
            const script = document.createElement('script');
            script.id = 'stripoScript';
            script.type = 'text/javascript';
            script.src = 'https://stripo.email/static/latest/stripo.js';
            script.onload = function () {
                window.Stripo.init({
                    settingsId: 'stripoSettingsContainer',
                    previewId: 'stripoPreviewContainer',
                    codeEditorButtonId: 'codeEditor',
                    undoButtonId: 'undoButton1',
                    redoButtonId: 'redoButton1',
                    locale: 'en',
                    html: template.html,
                    css: template.css,
                    /*notifications: {
                        info: notifications.info.bind(notifications),
                        error: notifications.error.bind(notifications),
                        warn: notifications.warn.bind(notifications),
                        loader: notifications.loader.bind(notifications),
                        hide: notifications.hide.bind(notifications),
                        success: notifications.success.bind(notifications)
                    },*/
                    apiRequestData: apiRequestData,
                    userFullName: 'Ebizon ',
                    versionHistory: {
                        changeHistoryLinkId: 'changeHistoryLink',
                        onInitialized: function(lastChangeIndoText) {
                            $('#changeHistoryContainer').show();
                        }
                    },
                    getAuthToken: function (callback) {
                        callback(mee);
                        jQuery('.loader').fadeOut('slow');
                    }
                });
            };
            document.body.appendChild(script);
        }

function loadRecentTemplate(callback){
    let html,css;
    css = decodeURIComponent(localStorage.getItem("css_shop_cartl"));
    html = decodeURIComponent(localStorage.getItem("htm_shop_cartl"));
    if(url.searchParams.has("back")||(!css&&!html)){
        html=(localStorage.getItem("back_css"));
        css=(localStorage.getItem('back_html'));
    }
    if((html||css)){
        callback({html: html, css: css});
    }  
}


if((url.searchParams.has("recent")&&url.searchParams.get("recent"))||url.searchParams.has("back")){
    loadRecentTemplate(initPlugin);
}else{        
    loadDemoTemplate(initPlugin);
    // window.render=false;
}

function save_template() {
    window.StripoApi.allDataSaved();
    // window.StripoApi.getEmail(fn);
    window.StripoApi.getTemplate(fn);
    //window.render=true;
}
function only_save(){
    save_template();
    //window.render=false;
}   

function fn(css,html){
    var temp = new FormData();
    // TemplateName=document.getElementById("tempname").value;
    // TemplateName=TemplateName.split('/');
    localStorage.setItem("back_html",html);
    localStorage.setItem("back_css",css);
    temp.append("html", encodeURIComponent(html));
    temp.append("css", encodeURIComponent(css));
    temp.append('name',localStorage.getItem("broadcast-name")); 
    console.log(html,css,"save"); 
    xhr('/save/', temp, function (response) {
         console.log(response.responseText);
         localStorage.setItem("lt01",response.responseText);
         //window.location.href="/sendto/?name="+TemplateName[TemplateName.length-1];
    });
}


var email='';
function sendEmail(){
    window.StripoApi.allDataSaved();
    email = prompt("Please enter email ","example@gmail.com,...");
    // window.StripoApi.compileEmail(sendcompileEmail);
    getcompiledaction(sendcompileEmail);

}

function sendcompileEmail(html){
        console.log(html,"compile");
        temp=new FormData();
        temp.append('htmlcss',html);
        temp.append('email',email);
        temp.append('action','test_email');
        xhr('/sendmailto/', temp, function (response) {
         console.log(response.responseText);

         // window.location.href="/sendto/?name="+TemplateName[TemplateName.length-1];
        });
}


function xhr(url, data, callback) {
    console.log(data);
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            console.log(request.responseText,"ressss");
            callback(request);
        }
        // console.log(err);
    };
    request.open('POST', url);
    request.setRequestHeader('X-CSRFToken',teme);       
    request.send(data);
}



function decodeEntities() {
  var element = document.createElement('div');
  function decodeHTMLEntities (str) {
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




