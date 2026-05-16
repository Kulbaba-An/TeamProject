// let req = new XMLHttpRequest
//властивість - onreadyatatechange

// створ запит open() (відкрити сеанс)
//req/open("GET", "data/1.txt")
//URL
// send() відправити запит
//
//status - цифр
//  statusText - цифр текст 
// responseText - доступ до відгуку


(function(global){
    const ajaxUtils = {};

    function getRequestObject(){
        if(global.XMLHttpRequest){
            return (new XMLHttpRequest());
        }        
        else{
            global.alert("Ajax is not supported!")
            return null;
        }
    }

    ajaxUtils.sendGetRequest = 
    function(requestURL,responseHandler, isJsonResponse){
        let request =  getRequestObject();
        request.onreadystatechange = 
        function(){
            handleResponse(request, responseHandler, isJsonResponse);
        }
        request.open("GET", requestURL, true);
        request.send(null);

    };

    function handleResponse(request, responseHandler, isJsonResponse){
        
        if((request.readyState == 4) && (request.status == 200)){
            if(isJsonResponse === undefined){
                isJsonResponse = true;
            }

            if(isJsonResponse){
                 responseHandler(JSON.parse(request.responseText));
            }
            else{
                responseHandler(request.responseText);
            }

        }

    }
    global.$ajaxUtils = ajaxUtils;


})(window);