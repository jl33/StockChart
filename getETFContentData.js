/* eslint-disable no-unused-vars */
//#region var section
var Highcharts;
var errorElm = document.getElementById('error');
var dbFileElm = document.getElementById('dbfile');
var par_DaySelectRange = 1;


var _chart_M = null;

var stockMObj = [];
var stockObj = [];



var _M_range = [];
var _stockList = [];
var _stockAvgVal = [];
var _M_y5 = [];
var _M_y10 = [];
var _M_Vol = [];






//#endregion

//#region worker declare
// Start the worker in which sql.js will run(this useless in Chrome)
// 依同一時間要產生的圖表數而建立,非同時產生則可重複利用
var worker = new Worker("worker.sql.js");
worker.onerror = error;
worker.postMessage({ action: 'open' });
var workerStock = new Worker("worker.sql.js");
workerStock.onerror = error;
workerStock.postMessage({ action: 'open' });

//#endregion

//#region common function
function error(e) {
	errorElm.style.height = '2em';
	errorElm.textContent = e.message;
}

function noerror() {
	errorElm.style.height = '0';
}

//#endregion
  
dbFileElm.onchange = function () {
	var getfile = function (n) {
		if ('files' in dbFileElm) {
			for (var i = 0; i < dbFileElm.files.length; i++) {
				var file = dbFileElm.files[i];
				if ('name' in file) {
					if (file.name === n) {
						return file;
					}
				}
				else {
					if (file.fileName === n) {
						return file;
					}
				}
			}
		}
	}
	var fdy = getfile("etf.db");
	var rStock = new FileReader();
	var r = new FileReader();


	//TODO: 待整理3個統計的SQL語法, SQLite無法用pivot
	//#region query daily data--------------------------------
	rStock.onload = function () {
		workerStock.onmessage = function () {
			noerror();
			var _sd = "";

			_sd = "SELECT stockNum From hisStock Group By stockNum Order By stockNum;";
			getStock(workerStock, _sd);
		};
		try {
			workerStock.postMessage({ action: 'open', buffer: rStock.result }, [rStock.result]);
		}
		catch (exception) {
			workerStock.postMessage({ action: 'open', buffer: rStock.result });
		}
	}
	//#endregion
	//#region query daily data--------------------------------
	r.onload = function () {
		worker.onmessage = function () {
			noerror();
			if (_chart_M) { _chart_M.showLoading(); }

			//TODO: for loop-------
			var _sd = "";
			for (var s=0; s<_stockList.length; s++){
				_sd = "SELECT date,pcentAvg FROM hisStock WHERE stockNum='"+_stockList[s]+"' Order By date;";
				getAvgData(worker, _sd, _stockList[s]);
			}
			//TODO: set chart data ------------		
			mapChartAvg();
			clearArrayNDestroyChartM();
			_chart_M.hideLoading();		
		};
		try {
			worker.postMessage({ action: 'open', buffer: r.result }, [r.result]);
		}
		catch (exception) {
			worker.postMessage({ action: 'open', buffer: r.result });
		}
	}
	//#endregion



	rStock.readAsArrayBuffer(fdy);
	r.readAsArrayBuffer(fdy);

}
//#region Set array data...

//TODO: 待整理3個chart的資料對應

function getStock(w, sqlstm) {
	var s = sqlstm, newDate;
	w.onmessage = function (event) {
		var results = event.data.results;
		for (var i = 0; i < results.length; i++) {
			stockObj = results[i].values;
			stockObj.forEach(function (item) {
				_stockList.push( item[0]);
			});
		}
	}
	w.postMessage({ id: 1, action: 'exec', sql: s });
}

function getAvgData(w, sqlstm, stock) {
	var s = sqlstm, newDate;
	w.onmessage = function (event) {
		var results = event.data.results;
		for (var i = 0; i < results.length; i++) {
			stockMObj = results[i].values;
			stockMObj.forEach(function (item) {
				newDate = new Date(item[0]).getTime();
				_stockAvgVal[stock].push([newDate, item[1]]);
			});
		}
	}
	w.postMessage({ id: 2, action: 'exec', sql: s });
}



//#endregion

Highcharts.setOptions({
	lang: {
		thousandsSep: ",",
		weekdays: ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'],
		months: [
			'一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月',
			'九月', '十月', '十一月', '十二月'
		],
		shortMonths: [
			'一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月',
			'九月', '十月', '十一月', '十二月'
		],
		numericSymbols: ['萬', '億'],
		numericSymbolMagnitude: 10000
	}
});

//#region render chart...

function mapChartAvg() {
	//#region var ~
	var _leftYLabTitlePos = -55,
		_leftYLabOffset = 170 - document.getElementById('contAvgRate').clientWidth; //-460;
	//#endregion
	//#region chart~
	_chart_M = Highcharts.stockChart('contAvgRate', {
		//#region head setting~
		chart: {
			backgroundColor: 'rgba(255,255,255,0)',
			spacingBottom: 1,
			spacingTop: 1,
			spacingLeft: 30,
			spacingRight: 1,
			animation: false,
		},
		credits: {
			enabled: false
		},
		boost: {
			useGPUTranslations: true,
			allowForce: true,
		},
		rangeSelector: {
			selected: 2,
			verticalAlign: 'bottom',
			margin: 0,
			inputEnabled: false,
			buttons: [{
				type: 'year',
				count: 1,
				text: '1y'
			}, {
				type: 'year',
				count: 3,
				text: '3y'
			}, {
				type: 'year',
				count: 5,
				text: '5y'
			}, {
				type: 'all',
				text: 'All'
			}]
		},
		plotOptions: {
			series: {
				animation: false,
				dataGrouping: {
					forced: true,
					units: [[
						'month',
						[1, 3, 6]
					], [
						'year',
						[1]
					]]
				}
			}
		},
		legend: {
			title: {
				text: '<span class="spanRange">平均佔比(%)</span>',
			},
			enabled: true,
			align: 'right',
			verticalAlign: 'top',
			layout: 'vertical',
			symbolPadding: 1,
			margin: 0,
			x: 0,
			y: 50,
			width: 80
		},
		navigator: {
			height: 20,
			margin: 0
		},
		tooltip: {
			animation: false,
			split: false,
			padding: 1,
			valueDecimals: 2,
			hideDelay: 0,
			shared: true,
			outside: true,
			// xDateFormat: "\'%y/%m",
			positioner: function (boxWidth, boxHeight, point) {
				return { x: 490, y: 5 };
			}
		},
		//#endregion
		xAxis: {
			crosshair: {
				width: 1,
				color: 'red'
			},
			type: 'datetime',
			tickInterval: 30 * 24 * 36e5, // 30 days
			labels: {
				format: '{value:\'%y/%m}',
			}
		},
		//#region yAxis~		
		yAxis: [{
			title: {
				text: '百分比',
			},
			offset: 0,
			height: '50%',
			startOnTick: false,
			opposite: true,
			crosshair: {
				width: 1,
				color: 'red'
			}
		}],
		//#endregion

		//#region series~
		series: function(_stockList,_stockAvgVal){
			var _series=[];
			for (var i=0;i<_stockList.length;i++){
				//_stockAvgVal[stock].push([newDate, item[1]]);
				_series.push(
					{
							name: _stockList[i],
							data: _stockAvgVal[i],
							//color: '#ff0000',
							lineWidth: 0.8,
							yAxis: 0,
							tooltip: {
								valueSuffix: '%'
							},
							credits: {
								enabled: false
							}
						}
				);
			}

			return _series;
		}
		//[{
		//	name: '半年均線⇨',
		//	data: _stockList,
		//	color: '#ff0000',
		//	lineWidth: 0.8,
		//	yAxis: 0,
		//	tooltip: {
		//		valueSuffix: '%'
		//	},
		//	credits: {
		//		enabled: false
		//	}
		//}, {
		//	name: '1年均線⇨',
		//	data: _stockAvgVal,
		//	color: '#c6a300',
		//	lineWidth: 0.8,
		//	yAxis: 0,
		//	tooltip: {
		//		valueSuffix: '%'
		//	},
		//	credits: {
		//		enabled: false
		//	}
		//}]
		//#endregion
	});
	//#endregion

}


//#endregion

//#region clear array data...
function clearArrayNDestroyChartM() {
	_M_range = [];
	_M_startPrice = [];
	_M_endPrice = [];
	_M_hiPrice = [];
	_M_lowPrice = [];
	_M_inPerMMoM = [];
	_M_inPerMYoY = [];
	_M_inAllMYoY = [];
	_M_SVshareholder = [];
	_M_Fshareholder = [];
	_M_SVpledge = [];
	_stockList = [];
	_stockAvgVal = [];
	_M_y5 = [];
	_M_y10 = [];
	_M_Vol = [];
}

//#endregion

//#endregion
