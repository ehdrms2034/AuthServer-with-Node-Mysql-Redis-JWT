window.onload = () =>{
    const inputEmail = document.getElementById('email');
    const inputPassword = document.getElementById('password')
    const loginForm = document.getElementById('formLogin');

    init();

    function init(){

        loginForm.addEventListener('submit',()=>{
            fetch('/users/login',{
                method:'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    email : inputEmail.value,
                    password : inputPassword.value
                })
            }).then(result=>{
                return result.json()
            }).then(data=>{
                if(data.msg==="success"){
                    alert("로그인 성공!");
                    location.href ='/front/';
                }else{
                    alert("로그인 실패!");
                }
            }).catch(err=>{
                console.log(err);
            });
        });

    }

};