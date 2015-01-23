﻿	var editMode = "";
	var editSort = "desc";
	
	var btnShow = function(){
		$("[name=listArea] button").animate({opacity: '1'}, 1000);
    	$("[name=listArea] button").attr("disabled", false);
    	
		return true;
	}
	
	var saveEvent = function(obj){
    	return function(){
    		 /* 1. 텍스트박스값을 저장할 json*/

            var rtn = {};

            rtn["_id"] 		=  "id" + _.now();
            rtn["name"] 	= obj.find("input[name=name]").val() ;
            rtn["age"] 		= obj.find("input[name=age]").val() ;
            rtn["email"] 	= obj.find("input[name=email]").val() ;
            rtn["phone"] 	= obj.find("input[name=phone]").val() ;
            rtn["company"] 	= obj.find("input[name=company]").val() ;
            rtn["birthday"] = obj.find("input[name=birthday]").val() ;

            /* 2. 배열에 push 합니다. */
            data.push(rtn);

            /* 3. 리스트를 다시 그립니다. */
            $("button[name=listRender]").trigger('click');
            
            editMode = "";
            
            btnShow();
        	
    	}
    }
    
	var sortingData = function(){
		if(editSort == "desc"){
        	return _.chain(data)
                    .sortBy('age')
                    .reverse()
                    .value();
        	
        }else{
        	return _.chain(data)
        	       	.sortBy('age')
        	        .value();
        }
        
		
	}
	
    $(document).ready(function(){
    	var schData = function(){
    		
    		return (function(){
			    		$("table[name=table01] tbody").html("");
			    		
			    		_.each(sortingData(), function(obj){
			
			                var $tr = $("<tr>"
			                +   "<td class=\"text-left\">"+obj.name+"</td>"
			                +   "<td class=\"text-center\">"+obj.age+"</td>"
			                +   "<td class=\"text-left\">"+obj.email+"</td>"
			                +   "<td class=\"text-left\">"+obj.phone+"</td>"
			                +   "<td class=\"text-left\">"+obj.company+"</td>"
			                +   "<td class=\"text-center\">"+obj.birthday+"</td>"
			                +   "<td class=\"text-center\"><button class=\"btn btn-sm \" name=\"delete\"><i class=\"glyphicon glyphicon-trash\"></i></button></td>"
			                +   "</tr>");
			
			            
			                /* 삭제 */
			                $tr.find("button[name=delete]").click(function(){
			                	if(confirm("삭제하시겠습니까?")){
				                	data = _.reject(data, function(rejObj){ 
				                		
				                		return _.isEqual(rejObj, obj); 
				                	});
				                	
				                	$("button[name=listRender]").trigger('click');
				                	
			                	}
			                	
			                });
			                
			                $tr.appendTo("table[name=table01] tbody");
			
			            });
			            
			            editMode = "";
			    		}
	    		)();
    	};
    	
    	/* 정렬 */
        $("table > thead > tr >th:eq(1)").click(function(){
        	
        	if($("table[name=table01] tbody tr").length > 0){
	        	if($("[name=listRender]").attr("disabled") == undefined  || $("[name=listRender]").attr("disabled") == "false"){ 
		        	if(editSort == "desc"){
		        		$(this).html("나이<i class=\"glyphicon glyphicon-arrow-up\"></i>");
		        		editSort = "asc";
		        		
		        	}else{
		        		$(this).html("나이<i class=\"glyphicon glyphicon-arrow-down\"></i>");
		        		editSort = "desc";
		        		
		        	}
		        	
		        	schData();
		        	
	        	}
	        	
        	}
        	
        });
        
    	/* 조회 */
        $("button[name=listRender]").click(function(){

        	$("table > thead > tr >th:eq(1)").html("나이");
        	editSort = "desc";
        	
            schData();

        });


        /* 등록 */
        $("button[name=addData]").click(function(){
        	$("[name=listArea] button").animate({opacity: '0'}, 1000);
        	$("[name=listArea] button").attr("disabled", true);
        	
        	if(editMode == ""){
	        	 var $tr = $("<tr>"
	             +   "<td class=\"text-center\"><input style=\"width:150px\" type=\"text\" name=\"name\" placeholder=\"이름\"/></td>"
	             +   "<td class=\"text-center\"><input style=\"width:40px\" type=\"text\" name=\"age\" placeholder=\"나이\" maxlength=\"2\"/></td>"
	             +   "<td class=\"text-center\"><input style=\"width:210px\" type=\"text\" name=\"email\" placeholder=\"이메일\"/></td>"
	             +   "<td class=\"text-center\"><input style=\"width:150px\" type=\"text\" name=\"phone\" placeholder=\"전화번호\"/></td>"
	             +   "<td class=\"text-center\"><input style=\"width:340px\" type=\"text\" name=\"company\" placeholder=\"회사\"/></td>"
	             +   "<td class=\"text-center\"><input style=\"width:100px\" type=\"text\" name=\"birthday\" placeholder=\"샏년월일\"/></td>"
	             +   "<td class=\"text-center\">"
	             +	 "<button class=\"btn btn-sm \" name=\"save\"><i class=\"glyphicon glyphicon-ok\"></i></button>&nbsp"
	             +	 "<button class=\"btn btn-sm \" name=\"cancle\"><i class=\"glyphicon glyphicon-remove\"></i></button>"
	             +   "</td>"
	             +   "</tr>");
	
	         
	        	 /* 저장 */
	        	 $tr.find("button[name=save]").click(saveEvent($tr));
	             
	        	 /* 취소 */
	             $tr.find("button[name=cancle]").click(function(){
	            	 $("table[name=table01] tbody tr:eq(0)").remove();
	            	 editMode = "";
	            	 btnShow();
	             });
	             
	             if($("table[name=table01] tbody tr").length){
	            	 $("table[name=table01] tbody tr:eq(0)").before($tr);
	            	 
	             }else{
	            	 $("table[name=table01] tbody").append($tr);
	             }
	             
	             editMode = "editMode";
             
        	}
        	
        });

    });

    
    
    


    
    