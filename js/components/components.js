var sessionStorage = window.sessionStorage;
$(function() {
	//alert(1)
   /*  $('#hd').load('../components/header.html');
    $('#ft').load('../components/footer.html'); */
	//changeLoginState();
	 $('#hd').load('../components/header.html');
	 $('#ft').load('../components/footer.html');
	
	if($("#left-part") != undefined && $("#left-part") != null){
		$("#left-part").load("../components/left_part_info.html")
	}
})



