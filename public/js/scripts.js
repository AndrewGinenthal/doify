window.onload = function() {

console.log("js happening")	
  

// var showReplyBox = function(){

	var replyButton = document.getElementById("reply_button");

	if (replyButton) {

		replyButton.onclick = function(){

		var area = document.createElement("textarea")
		area.id = "reply_box";
		area.style.rows = "6";
		area.style.cols = "100";
		var form = document.createElement("form")
		form.action = "/channels/<%= channel.name%>/<%= task.name %>/reply";
		form.method = "POST";
		var replyAgain = document.createElement("button")
		replyAgain.innerHTML = "You can only reply one level down lol"
		var br = document.createElement("br")

		var container = document.getElementById("reply_here")
		container.appendChild(form)
		container.appendChild(area)
		container.appendChild(br)
		container.appendChild(replyAgain)
		console.log("I remember javascript!")

		}
		
	}
		

// }

};