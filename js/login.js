function print(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("pass").value;
 
    if (username=="" || password == ""){
        alert("帳號或密碼不得為空")
    }
    else if(username =="zaq5891097" && password == "z5891097"){
        alert("登入成功");
        window.location.href = "https://cjl-1228.github.io/notes_website/web/Private/private.html";
    }
    else{
        alert("帳號或密碼錯誤");
    }


}