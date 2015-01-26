	$(document).ready(function(){
		
		var editMode = "";		//편집여부
		var sortType = "desc";	//정렬타입
		
		//숫자만numberonly='true'
		$(document).on("keyup", ".numberOnly", function() {
			$(this).val( $(this).val().replace(/[^0-9]/gi,"") );
		});
		
		/* 버튼 표시 또는 숨김 처리 */
		var btnShowOrHide = function(){
			$("[name=listArea] button").animate({opacity: '1'}, 1000);
	    	$("[name=listArea] button").attr("disabled", false);
	    	
		};
		
		/* 저장처리 */
		var saveEvent = function(obj){
	    	return function(){
	    		 /* 1. 텍스트박스값을 저장할 json*/

	            var rtn = {};

	            rtn["_id"] 		= "id" + _.now();
	            rtn["name"] 	= obj.find("input[name=name]").val() ;
	            rtn["age"] 		= parseInt(obj.find("input[name=age]").val()) ;
	            rtn["email"] 	= obj.find("input[name=email]").val() ;
	            rtn["phone"] 	= obj.find("input[name=phone]").val() ;
	            rtn["company"] 	= obj.find("input[name=company]").val() ;
	            rtn["birthday"] = obj.find("input[name=birthday]").val() ;

	            /* 2. 배열에 push 합니다. */
	            data.push(rtn);

	            /* 3. 리스트를 다시 그립니다. */
	            $("button[name=listRender]").trigger('click');
	            
	            editMode = "";
	            
	            btnShowOrHide();
	        	
	    	}
	    	
	    };
	    
	    
	    /* 정렬 처리 */
		var sortingData = function(findData, npage){
			var sortingData = "";
			
			if(sortType == "desc"){
				sortingData = _.chain(findData)
				               .sortBy('age')
				               .reverse()
				               .value();
	        	return makePagingData(sortingData, npage);
	        	
	        }else{
	        	sortingData = _.chain(findData)
				               .sortBy('age')
				               .value();
				return makePagingData(sortingData, npage);
				
	        }
	        
			
		};
		
		/* 페이징  이벤트 처리 */
		var pageingEvent = function(idx){
			return function(){
				schData(idx);
			}
		}
		
		/* 페이징  추가 */
		var recordCnt = 3;
		var makePagingData = function(sortingData , nPage){
			$(".pagination").html("");
			
			var startNum = (nPage * recordCnt) - recordCnt;
			var endNum 	 = nPage * recordCnt;

			var pData =  _.filter(sortingData, function(obj, idx){ 
				return idx>=startNum && idx<endNum;
			});
			var pDataLen = sortingData.length;
			var showPageNum = pDataLen / recordCnt;
			showPageNum = pDataLen % recordCnt > 0 ? showPageNum + 1 : showPageNum;

			if(showPageNum){
				var $pagingPrev = $('<li>'
							     +' <a href="javascript:(function(){})()" aria-label="Previous">'
							     +'   <span aria-hidden="true">&laquo;</span>'
							     +' </a>'
							     +'</li>'
							     ).click(pageingEvent(1));
				$(".pagination").append($pagingPrev);
				
				for(var i=1, mLen=parseInt(showPageNum); i<=mLen; i++){
					$(".pagination").append($("<li><a href=\"javascript:(function(){})()\">"+i+"</a></li>").click(pageingEvent(i)));
						
				}
				
				var pagingNext =  $('<li>'
							      +' <a href="javascript:(function(){})()" aria-label="Next">'
							      +'   <span aria-hidden="true">&raquo;</span>'
							      +' </a>'
							      +'</li>').click(pageingEvent(parseInt(showPageNum)));
				
				$(".pagination").append(pagingNext);
			
			}

			return pData;
		};
		
		/* 조회 처리 */
    	var schData = function(nPage){
    		$("table[name=table01] tbody").html("");
    		
    		var findData = data;
			if($("input[name=schAge]").val() != "")findData = _.where(data, {age:parseInt($("input[name=schAge]").val())});
			
			$("span[name=totalCnt]").html(findData.length);
			
    		_.each(sortingData(findData, nPage), function(obj){

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
	                	data = _.filter(data, function(rejObj){ 
	                		
	                		return rejObj._id != obj._id; 
	                	});
	                	
	                	$("button[name=listRender]").trigger('click');
	                	
                	}
                	
                });
                
                $tr.appendTo("table[name=table01] tbody");

            });
            
            editMode = "";
			
    		
	    };
    	
    	/* 정렬 */
        $("table > thead > tr >th:eq(1)").click(function(){
        	
        	if($("table[name=table01] tbody tr").length > 0){
	        	if($("[name=listRender]").attr("disabled") == undefined  || $("[name=listRender]").attr("disabled") == "false"){ 
		        	if(sortType == "desc"){
		        		$(this).html("나이<i class=\"glyphicon glyphicon-arrow-up\"></i>");
		        		sortType = "asc";
		        		
		        	}else{
		        		$(this).html("나이<i class=\"glyphicon glyphicon-arrow-down\"></i>");
		        		sortType = "desc";
		        		
		        	}
		        	
		        	schData(1);
		        	
	        	}
	        	
        	}
        	
        });
        
    	/* 조회 */
        $("button[name=listRender]").click(function(){
        	$("table > thead > tr >th:eq(1)").html("나이");
        	sortType = "desc";

        	schData(1);

        });


        /* 등록 */
        $("button[name=addData]").click(function(){
        	$("[name=listArea] button").animate({opacity: '0'}, 1000);
        	$("[name=listArea] button").attr("disabled", true);
        	
        	if(editMode == ""){
	        	 var $tr = $("<tr>"
	             +   "<td class=\"text-center\"><input style=\"width:150px\" type=\"text\" name=\"name\" placeholder=\"이름\"/></td>"
	             +   "<td class=\"text-center\"><input style=\"width:40px\" type=\"text\" name=\"age\" placeholder=\"나이\" maxlength=\"2\" class=\"numberOnly\"/></td>"
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
	            	 btnShowOrHide();
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

    
    
    


    
    
