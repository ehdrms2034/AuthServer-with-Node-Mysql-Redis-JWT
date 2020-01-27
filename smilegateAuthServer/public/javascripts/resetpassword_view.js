window.onload = () => {

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('passwordConfirm');
    const form = document.getElementById('passwordForm');

    password.addEventListener('keyup', () => {
        if (password.value === passwordConfirm.value) {
            passwordConfirm.setCustomValidity('');
        } else {
            passwordConfirm.setCustomValidity('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        }
    });

    passwordConfirm.addEventListener('keyup', () => {
        if (password.value === passwordConfirm.value) {
            passwordConfirm.setCustomValidity('');
        } else {
            passwordConfirm.setCustomValidity('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        }
    });

    form.addEventListener('submit', () => {
        fetch('/users/modifyPassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.innerText,
                password: password.value
            })
        })
            .then(data => data.json())
            .then(result => {
                if (result.msg === "success") {
                    alert("비밀번호 변경이 완료됐습니다");
                    location.href = '/login';
                }
                else{
                    alert("비밀번호 변경이 실패했습니다. 다시 시도해주세요");
                }
            })
            .catch(err=>{
                alert("비밀번호 변경이 실패했습니다. 다시 시도해주세요");
            })
    });

};