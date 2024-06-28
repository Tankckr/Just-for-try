function Login(un, pd) {
	// alert(un);alert(pd);
	fetch('http://127.0.0.1:12345/login?username='+un+'&pwd='+pd)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			if (data == true){
				// alert('YES');
				window.location.href = 'user.html?name='+un;
			}
			else {
				alert('账号或密码错误');
				document.getElementById("pd").value='';
			}
		})
		.catch(error => console.error('Error fetching data:', error));
}

function Regist(un, pd) {
	// alert(un);alert(pd);
	fetch('http://127.0.0.1:12345/regist?username='+un+'&pwd='+pd)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			if (data == true){
				alert('注册成功');
				location.replace('login.html')
			}
			else {
				alert('用户名冲突');
				document.getElementById("un").value='';
				document.getElementById("pd").value='';
			}
		})
		.catch(error => console.error('Error fetching data:', error));
}