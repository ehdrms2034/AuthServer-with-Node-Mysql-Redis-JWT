window.onload = () => {

    const btnReqEmail = document.getElementById('btnReqEmail');
    const spanEmail = document.getElementById('email');

    alert("사용자 계정을 활성화 해주세요");

    btnReqEmail.addEventListener('click', () => {
        const _email = spanEmail.innerText;

        fetch('/mails/createVerifiedUUID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: _email
            })
        })
            .then(data => {
                return data.json();
            })
            .then(result => {
                console.log(result.msg);
                if (result.msg === 'success') {
                    alert("이메일 전송 완료 \n 이메일을 확인 후 다시 로그인 해주세요.");

                } else
                    alert('이메일 전송 실패 \n 다시시도해주세요');
            });
    });


};