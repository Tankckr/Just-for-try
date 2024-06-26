var username;
var refID;

function getQueryParams() {
	const params = new URLSearchParams(window.location.search);
	username = params.get('name');
	checkLogin();
}
//检测登录
function checkLogin() {
	// alert(username);
	if(username==null) {
		location.replace('login.html');
	}
	else {
		// 初始化
		document.getElementById("hello").innerText=username+", 您好";
		getBalance(username);
	}
}
function Exit(){
	fetch('http://127.0.0.1:12345/logout?username='+username);
	location.replace('main.html');
}
// 余额
function getBalance(un) {	
	fetch('http://127.0.0.1:12345/getBalance?username='+un)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			JSONDATA = data;
			document.getElementById("balance").innerText = "您的余额："+data;
		})
		.catch(error => console.error('Error fetching data:', error));
}
//持仓
function getInventory() {
	fetch('http://127.0.0.1:12345/getInventory?username='+username)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			JSONDATA = data;
			showInventory(data);
		})
		.catch(error => console.error('Error fetching data:', error));
}
function showInventory(data) {
	document.getElementById("board").classList.add("roll");
	document.getElementById("board").innerText="";
	for(var i = 0; i < data.length; i++){
		var newdiv = document.createElement("div"); newdiv.className="board";
		newdiv.innerHTML+="<div class='w1 abs'>股票代码："+data[i].Code+"</div>";
		newdiv.innerHTML+="<div class='w2 abs'>平均成本："+data[i].AVG_Cost+"</div>";
		newdiv.innerHTML+="<div class='w3 abs'>持仓数量："+data[i].Amount+"</div>";
		newdiv.innerHTML+="<div class='w4 abs'>总成本："+data[i].Total_Cost+"</div>";
		document.getElementById("board").appendChild(newdiv);
	}
}
//交易记录
function getTradeRecord() {
	fetch('http://127.0.0.1:12345/getTradeRecord?username='+username)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			JSONDATA = data;
			showTradeRecord(data);
		})
		.catch(error => console.error('Error fetching data:', error));
}
function translateState(state) {
	switch(state) {
		case 0: return "错误";
		case 1: return "委托成功";
		case 2: return "交易成功";
		case 3: return "废单";
		case 4: return "账户余额不足";
		case 5: return "持仓余额不足";
	}
}
function showTradeRecord(data) {
	document.getElementById("board").classList.add("roll");
	document.getElementById("board").innerText="";
	for(var i = 0; i < data.length; i++){
		var newdiv = document.createElement("div"); newdiv.className="board";
		if(data[i].Direction==0) {
			newdiv.innerHTML+="<img src='Asset/picture/buy.png' alt='buy' class='rec_mask'>";
		}else if(data[i].Direction==1) {
			newdiv.innerHTML+="<img src='Asset/picture/sell.png' alt='sell' class='rec_mask'>";
		}
		newdiv.innerHTML+="<div id='UUID' class='abs'>交易单号："+data[i].No+"</div>";
		newdiv.innerHTML+="<div class='r1 l1 abs'>股票代码："+data[i].Code+"</div>";
		newdiv.innerHTML+="<div class='r2 l1 abs'>交易数量："+data[i].Amount+"</div>";
		newdiv.innerHTML+="<div class='r1 l2 abs'>挂单价格："+data[i].KnockPrice+"</div>";
		newdiv.innerHTML+="<div class='r2 l2 abs'>成交价格："+data[i].KnockPrice+"</div>";
		newdiv.innerHTML+="<div class='r1 l3 abs'>交易状态："+translateState(data[i].State)+"</div>";
		newdiv.innerHTML+="<div class='r2 l3 abs'>交易时间："+data[i].TradeTime+"</div>";
		document.getElementById("board").appendChild(newdiv);
	}
}

//交易中心
function tradeCenter() {
	document.getElementById("board").innerHTML="<div id='trade_table'></div>";
	initialTradeTable();
	// alert("功能开发中");
	document.getElementById("board").innerHTML+="<div id='table'></div>";
	getMarketPrice();
}
function initialTradeTable() {
	var Trade_code = document.createElement('div'); Trade_code.className='TradeItems';
	Trade_code.innerHTML="<div class='TradeWords'>股票代码：</div>\
	<input id='Trade_code' type='text' placeholder='输入要交易的股票代码'>";

	var Trade_price = document.createElement('div'); Trade_price.className='TradeItems';
	Trade_price.innerHTML="<div class='TradeWords'>挂单价格：</div>\
	<input id='Trade_price' type='text'>";// placeholder='输入挂单价格'

	var Trade_amount = document.createElement('div'); Trade_amount.className='TradeItems';
	Trade_amount.innerHTML="<div class='TradeWords'>挂单数量：</div>\
	<input id='Trade_amount' type='text'>";// placeholder='输入要交易的数量'
	
	var table = document.getElementById("trade_table");
	table.appendChild(Trade_code);
	table.appendChild(Trade_price);
	table.appendChild(Trade_amount);
	
	table.innerHTML+="<button id='buy' class='bt_trade' onclick='buy(document.getElementById("+'"Trade_code"'+").value,document.getElementById("+'"Trade_price"'+").value,document.getElementById("+'"Trade_amount"'+").value)'>买入</button>";
	table.innerHTML+="<button id='sell' class='bt_trade' onclick='sell(document.getElementById("+'"Trade_code"'+").value,document.getElementById("+'"Trade_price"'+").value,document.getElementById("+'"Trade_amount"'+").value)'>卖出</button>";
}
function buy(cd, pr, am) {
	fetch("http://127.0.0.1:12345/trade?username="+username+"&code="+cd+"&direction=buy&price="+pr+"&amount="+am)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			alert(translateState(data));
			getBalance(username);
			tradeCenter();
		})
		.catch(error => console.error('Error fetching data:', error));
}
function sell(cd, pr, am) {
	fetch("http://127.0.0.1:12345/trade?username="+username+"&code="+cd+"&direction=sell&price="+pr+"&amount="+am)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			alert(translateState(data));
			getBalance(username);
			tradeCenter();
		})
		.catch(error => console.error('Error fetching data:', error));
}

function getMarketPrice() {	
	fetch('http://127.0.0.1:12345/getMarketPrice')
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			showMarketPrice(data);
		})
		.catch(error => console.error('Error fetching data:', error));
}
function showMarketPrice(data) {
	document.getElementById("table").innerHTML="<button class='bt_table' onclick='getMarketPrice()'>刷新</button>";
	var MarketTitle = document.createElement("div");MarketTitle.id = "MarketTitle";
	var Code = document.createElement("div"); Code.className = "title"; Code.textContent = "股票代码";
	var Name = document.createElement("div"); Name.className = "title"; Name.textContent = "股票名称";
	var Price = document.createElement("div"); Price.className = "title"; Price.textContent = "最新价格";
	MarketTitle.appendChild(Code);
	MarketTitle.appendChild(Name);
	MarketTitle.appendChild(Price);
	document.getElementById("table").appendChild(MarketTitle);
	
	document.getElementById("table").innerHTML+='<div id = "Market" class = "roll"></div>';
	for(var i = 0; i < data.length; i++){
		var temp = document.createElement("div")
		temp.className = "market_line";
		temp.innerHTML += '<div class = "cd data">'+data[i].Code+'</div>';
		temp.innerHTML += '<div class = "data">'+data[i].Name+'</div>';
		temp.innerHTML += '<div class = "data">'+data[i].Price+'</div>';
		
		var box = document.createElement("div"); box.className = "market_box";
		box.appendChild(temp);
		document.getElementById("Market").appendChild(box);
	}

	var marketBoxes = document.querySelectorAll('.market_box');
	marketBoxes.forEach(function(box) {
		box.addEventListener('click', function() {
			var cdContent = box.querySelector('.cd').textContent;
			getStockPrice(cdContent);
		});
	});
}

function getStockPrice(cd) {
	fetch('http://127.0.0.1:12345/getStockPrice?code='+cd)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			showStockPrice(data, cd);
		})
		.catch(error => console.error('Error fetching data:', error));
}
function showStockPrice(prices, code) {
	document.getElementById("table").innerHTML='<button class="bt_table" onclick="getMarketPrice()">返回</div>';
	var canvas = document.createElement('canvas'); canvas.id="myCanvas";
	var ctx=canvas.getContext("2d");
	var date = new Array(prices.length);
	for(var i=0;i<date.length;i++){
		date[i]=i;
	}
	
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: date,  // 横坐标为日期
        datasets: [{
          label: code,
          data: prices,  // 折线的纵坐标为股价数据
          borderColor: '#ffffff',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        scales: {
			x: { 
				grid: {
					color: 'rgba(0,0,0,0.2)', // 设置X轴网格线颜色
				},
				ticks: {
					color: '#ffffff00' // 设置X轴标签颜色
				}
			},
			y: { 
				beginAtZero: false,
				grid: {
					color: 'rgba(0,0,0,0.2)', // 设置Y轴网格线颜色
				},
				ticks: {
					color: 'black' // 设置Y轴标签颜色
				}
			}
		},
		plugins: {
			legend: {
				labels: {
					color: 'black' // 设置图例文本的颜色
				}
			},
			tooltip: {
				backgroundColor: '#00000080', // 更改工具提示框的背景颜色
				titleColor: '#ffffff', // 更改工具提示框标题的颜色
				bodyColor: '#ffffff' // 更改工具提示框正文的颜色
          }
        }
      }
    });
	document.getElementById("table").appendChild(canvas);
}

document.addEventListener('DOMContentLoaded', getQueryParams);