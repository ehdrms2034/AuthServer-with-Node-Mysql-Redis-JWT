window.onload = () => {

    const findForm = document.getElementById('findForm');
    const email = document.getElementById('email');
    const name = document.getElementById('name');

    findForm.addEventListener('submit', () => {
        fetch('/mails/createFindPasswordUUID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value,
                name: name.value
            })
        })
            .then(data => data.json())
            .then(result => {
                console.log(result);
                if(result.msg==="success")
                    alert('성공적으로 이메일을 전송했습니다.');
                else
                    alert('이메일 혹은 이름이 올바르지 않습니다');
            })
    });
};