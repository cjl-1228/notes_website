function print(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("pass").value;
 
    if (username=="" || password == ""){
        alert("帳號或密碼不得為空")
    }
    else if(username =="aaa123" && password == "aaa123"){
        alert("登入成功");
        window.location.href = "https://cjl-1228.github.io/notes_website/web/Private/private.html";
    }
    else{
        alert("帳號或密碼錯誤");
    }


}

function print2(){
    var username = document.getElementById("username2").value;
    var password = document.getElementById("pass2").value;
 
    if (username=="" || password == ""){
        alert("帳號或密碼不得為空")
    }
    else if((username =="nptucbf109" || username =="NPTUCBF109")  && (password == "AAACBF109" || (password == "aaacbf109")) ){
        alert("登入成功");
        window.location.href = "https://cjl-1228.github.io/notes_website/web/Project/Project.html";
    }
    else{
        alert("帳號或密碼錯誤");
    }


}