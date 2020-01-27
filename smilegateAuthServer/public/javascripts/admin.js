window.onload = () => {

    const userTable = document.getElementById('userTable');

    init();

    function init() {
        fetch('/admin/getAllUserList')
            .then(data => data.json())
            .then(result => {
                setTable(result);
            });
    }

    function setTable(userList) {

        for (let index = 0; index < userList.length; index++) {
            const tr = document.createElement('tr');
            const userNum = document.createElement('td');
            const email = document.createElement('td');
            const name = document.createElement('td');
            const verification = document.createElement('td');
            const userType = document.createElement('td');
            const createAt = document.createElement('td');
            const modifyUser = document.createElement('td');
            const deleteUser = document.createElement('td');

            const btnModify = document.createElement('input');
            const btnDelete = document.createElement('input');

            btnModify.setAttribute('type', 'button');
            btnModify.setAttribute('value', '확인');
            btnModify.addEventListener('click',()=>{
                location.href = "/admin/modifyUser/"+userList[index].id;
            });
            modifyUser.append(btnModify);

            btnDelete.setAttribute('type', 'button');
            btnDelete.setAttribute('value', '삭제');
            btnDelete.addEventListener('click',()=>{
                const userID = userList[index].id;
                reqDeleteUser(userID);
            });
            deleteUser.append(btnDelete);

            userNum.innerText = userList[index].id;
            email.innerText = userList[index].email;
            name.innerText = userList[index].name;
            verification.innerText = userList[index].verified;
            userType.innerText = userList[index].userType;
            createAt.innerText = userList[index].createdAt;

            tr.append(userNum);
            tr.append(email);
            tr.append(name);
            tr.append(userType);
            tr.append(verification);
            tr.append(createAt);
            tr.append(modifyUser);
            tr.append(deleteUser);


            userTable.append(tr);
        }
    }

    function reqDeleteUser(userid) {
        console.log(userid);
        fetch('/admin/deleteUserById', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userid
            })
        })
            .then(data => data.json())
            .then(result => {
                alert('삭제가 완료 되었습니다.');
                location.reload();
            })
    }


};