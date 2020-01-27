window.onload = () => {
    const userNum = document.getElementById('userNum');
    const email = document.getElementById('email');
    const name = document.getElementById('userName');
    const verified = document.getElementById('verified');
    const userType = document.getElementById('userType');
    const createdAt = document.getElementById('createdAt');
    const form = document.getElementById('form');

    // console.log(userNum.innerText,email.innerText,name.value,verified.checked,
    //     createdAt.innerText,btnModify);

    form.addEventListener('submit', () => {
        fetch('/admin/updateUserById', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userNum.innerText,
                name: name.value,
                verified: verified.checked,
                userType: userType.value
            })
        })
            .then(res => res.json())
            .then(data => {
                if(data.msg==='success'){
                    alert("데이터의 수정이 정상적으로 이루어짐");
                    location.href="/admin";
                }else{
                    alert("요청이 원활하게 이루어지지 않았습니다.");
                }
            })
            .catch(err=>{
                console.log(err);
            })
    });
};