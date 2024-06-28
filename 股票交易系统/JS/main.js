var username;

// 个人中心
function toCenter() {
	if(username == null) {
		location.replace('login.html');
	}
	else {
		window.location.href = 'user.html?name='+username;
	}
}
// 登出
function login() {
	window.location.href = 'login.html';
}

// 大盘
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
document.addEventListener('DOMContentLoaded', getMarketPrice);