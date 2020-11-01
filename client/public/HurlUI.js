document.addEventListener("DOMContentLoaded", ()=>{
	var icon = document.querySelectorAll("#nav-icon");
	icon.forEach((icon)=>{
		var target = icon.dataset.target;
		var navlist = document.getElementById(target);
		navlist.classList.add("nav-list-responsive");
		icon.addEventListener("click", function(){
			if(navlist.classList.contains("nav-responsive")){
				navlist.classList.remove("nav-responsive");
				navlist.style.display = "none";
			}
			else{
				navlist.classList.add("nav-responsive");
				navlist.style.display = "block";
			}
		})
	})
})