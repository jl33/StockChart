/* eslint-disable no-unused-vars */
//#region var section
var Highcharts;
var errorElm = document.getElementById('error');
var loadElm = document.getElementById('load');
var dbFileElm = document.getElementById('dbfile');
var stSelElm = document.getElementById('stockSel');
var popDescElm = document.getElementById('popDesc');
var nameElm = document.getElementById('stockName');
var typeElm = document.getElementById('stockType');
var t1 = document.getElementById('t1');
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('f');
const myParamList = urlParams.get('l');
const myParamRange = urlParams.get('t');
var par_BestPrice = false;
var par_FilterList = 1;
var par_DaySelectRange = 1;
if (myParam == "1") { par_BestPrice = true; }
else { par_BestPrice = false; }

if (myParamList == 1 || myParamList == 2 || myParamList == 3) { par_FilterList = myParamList; }
else { par_FilterList = 1; }

if (myParamRange == 0 || myParamRange == 2 || myParamRange == 3 || myParamRange == 4) { par_DaySelectRange = myParamRange; }
else { par_DaySelectRange = 1; }

var _chart_D = null;
var _chart_Y = null;
var _chart_Q = null;
var _chart_W = null;
var _chart_M = null;
var _chart_Y2 = null;

var stockPBR = [];
var stockPBRLo = [];
var stockObj = [];
var stockPER = [];
var _dayOHLC = [];
var stockMObj = [];
var stockQObj = [];
var _D_Vol = [];
var _D_mainBuy = [];
var _D_mainAgent = [];
var _D_main5Day = [];
var _D_main20Day = [];
var _D_k_start = [];
var _D_k5 = [];
var _D_k10 = [];
var _D_k20 = [];
var _D_k60 = [];
var _D_k120 = [];
var _D_k240 = [];
var _D_K = [];
var _D_D = [];
var _D_v5 = [];
var _D_v20 = [];
var _D_flag = [];
var _D_sell = [];
var _D_divR = [];


var _M_range = [];
var _M_startPrice = [];
var _M_endPrice = [];
var _M_hiPrice = [];
var _M_lowPrice = [];
var _M_inPerMMoM = [];
var _M_inPerMYoY = [];
var _M_inAllMYoY = [];
var _M_SVshareholder = [];
var _M_Fshareholder = [];
var _M_SVpledge = [];
var _M_yh = [];
var _M_y1 = [];
var _M_y5 = [];
var _M_y10 = [];
var _M_Vol = [];

var _Y_range = [];
var _Y_range_noQ = [];
var _Y4_range = [];
var _Y5_range = [];
var _Y_shareCap = [];
var _Y_endPrice = [];
var _Y_avgPrice = [];
var _Y_operMargin = [];
var _Y_operProfitMargin = [];
var _Y_lossOutside = [];
var _Y_afterTaxRate = [];
var _Y_ROE = [];
var _Y_ROA = [];
var _Y_afterTaxEPS = [];
var stockYObj = [];

var _Y_dirRewardRate = [];
var _Y_dirNetRate = [];
var _Y_empRewardRate = [];
var _Y_cashDividendRate = [];
var _Y_stockDividendRate = [];
var _Y_dividendRate = [];
var _Y_distributionRate = [];

var _Y_cashRate = [];
var _Y_receivableGet = [];
var _Y_liabilityPay = [];
var _Y4_liabilityPay = [];
var _Y_cashFlow = [];
var _Y_OHLC_wQ = [];

var _Y_netTaxProfit = [];
var _Y2_netTaxProfit = [];
var _Y_bizAct = [];
var _Y_investAct = [];
var _Y_finAct = [];
var _Y_otherAct = [];
var _Y_netCashFlow = [];
var _Y_freeCashFlow = [];
var _Y_endBalance = [];
var _Y_inr = [];

var _Q_range = [];
var _Q_totalLiabRatio = [];
var _Q_shareholderEqtyRatio = [];
var _Q_debtNetRatio = [];
var _Q_currentRatio = [];
var _Q_fastRatio = [];
var _Q_ContractLiability = [];

var _W_range = [];
var _W_shareholderGT1000 = [];
var _W_FI_SC_5d = [];
var _W_FI_SC_1m = [];
var _W_FI_SC_3m = [];
var _W_FI_SC_1y = [];
var _W_FI_SC_3y = [];
var _W_TI_SC_5d = [];
var _W_TI_SC_1m = [];
var _W_TI_SC_3m = [];
var _W_TI_SC_1y = [];
var _W_TI_SC_3y = [];
var _W_SI_SC_5d = [];
var _W_SI_SC_1m = [];
var _W_SI_SC_3m = [];
var _W_SI_SC_1y = [];
var _W_SI_SC_3y = [];
var _W_F_Own_ratio = [];

//#endregion

//#region worker declare
// Start the worker in which sql.js will run(this useless in Chrome)
// 依同一時間要產生的圖表數而建立,非同時產生則可重複利用
var worker = new Worker("worker.sql.js");
var worker2 = new Worker("worker.sql.js");
var worker3 = new Worker("worker.sql.js");
var worker4 = new Worker("worker.sql.js");
var worker5 = new Worker("worker.sql.js");
var worker6 = new Worker("worker.sql.js");
worker.onerror = error;
worker2.onerror = error;
worker3.onerror = error;
worker4.onerror = error;
worker5.onerror = error;
worker6.onerror = error;

// Open a database
worker.postMessage({ action: 'open' });
worker2.postMessage({ action: 'open' });
worker3.postMessage({ action: 'open' });
worker4.postMessage({ action: 'open' });
worker5.postMessage({ action: 'open' });
worker6.postMessage({ action: 'open' });

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


//#region dbFileElm.onchange: read database & make <option>
dbFileElm.onchange = function () {
	// var f = dbFileElm.files[0];
	var getfile = function () {
		if ('files' in dbFileElm) {
			for (var i = 0; i < dbFileElm.files.length; i++) {
				console.log(dbFileElm.files[i]);
				var file = dbFileElm.files[i];
				if ('name' in file) {
					if (file.name === "mystock.db") {
						console.log("got my db(name)!");
						return file;
					}
				}
				else {
					if (file.fileName === "mystock.db") {
						console.log("got my db(fileName)!");
						return file;
					}
				}
			}
		}
	}
	console.log(getfile() instanceof Blob);
	var f = getfile();
	var r = new FileReader();
	var lstr = "", qr = "";
	if (par_FilterList == 1) {
		//所有清單
		lstr = "下拉選取";
	}
	else if (par_FilterList == 2) {
		//最佳選清單
		lstr = "優選清單選取"; qr = " and bestChoice=1 ";
	}
	else if (par_FilterList == 3) {
		//次優選清單
		lstr = "次優清單選取"; qr = " and secondChoice=1 ";
	}
	else { lstr = "下拉選取"; }

	if (f != null) { loadElm.innerText = ""; }
	r.onload = function () {
		worker.onmessage = function () {
			noerror()
			worker.onmessage = function (event) {
				var res = event.data.results, i = 0;
				for (i = 0; i < res.length; i++) {
					var selObj = res[i].values;
					stSelElm.innerHTML += "<option value=''>(" + lstr + ")</option>";
					selObj.forEach(function (item) {
						stSelElm.innerHTML += '<option value=' + item[0] + '>' + item[0] + ' ' + item[1] + '(' + (item[2] == null ? '' : item[2]) + ')</option>';
					});
				}
				t1.focus();
			}
			worker.postMessage({ action: 'exec', sql: "SELECT stockNum,StockName,bizType FROM stockInfo Where enable=1 " + qr + " Order By bizType, otherOrder,stockNum;" });
		};
		try {
			worker.postMessage({ action: 'open', buffer: r.result }, [r.result]);
		}
		catch (exception) {
			worker.postMessage({ action: 'open', buffer: r.result });
		}
	}
	r.readAsArrayBuffer(f);
}
//#endregion
function showStockFont(_b) {
	if (!_b) {
		document.getElementById('stockName').classList.remove('transparentFont');
		document.getElementById('stockName').classList.add('wholeTransparentFont');
		document.getElementById('stockType').classList.remove('transparentFont');
		document.getElementById('stockType').classList.add('wholeTransparentFont');
	} else {
		document.getElementById('stockName').classList.remove('wholeTransparentFont');
		document.getElementById('stockName').classList.add('transparentFont');
		document.getElementById('stockType').classList.remove('wholeTransparentFont');
		document.getElementById('stockType').classList.add('transparentFont');
	}
}
stSelElm.onkeypress = function (e) {
	var keynum;
	keynum = e.which || e.keyCode;
	if (keynum == 27) {
		t1.focus();
		return;
	}
	if (((keynum >= 48 && keynum <= 57) || (keynum >= 65 && keynum <= 90) || (keynum >= 96 && keynum <= 105))) {
		t1.value = String.fromCharCode(keynum);
		t1.focus();
		return;
	}
}
t1.onkeypress = function (e) {
	var keynum;
	keynum = e.which || e.keyCode;
	if (keynum >= 37 && keynum <= 40) {
		stSelElm.focus();
		return;
	}
	if (keynum == 13) {
		var _v = t1.value.toUpperCase();
		t1.value = "";
		stSelElm.addEventListener('change', function () { });
		stSelElm.value = _v;
		stSelElm.dispatchEvent(new Event('change'));
		return;
	}
	if (!((keynum >= 48 && keynum <= 57) || (keynum >= 65 && keynum <= 90) || (keynum >= 96 && keynum <= 105))) {
		return;
	}
}
t1.onfocus = stSelElm.onfocus = function () {
	var f = this;
	f.style.backgroundColor = 'rgba(255,0,0,0.3)';
	if (f === stSelElm) {
		t1.value = "";
	}
}

t1.onblur = stSelElm.onblur = function () {
	var f = this;
	f.style.backgroundColor = 'rgba(255,255,255,0.4)';
}
//#region
//#region stSelElm.onchange
stSelElm.onchange = function () {
	var getfile = function () {
		if ('files' in dbFileElm) {
			for (var i = 0; i < dbFileElm.files.length; i++) {
				console.log(dbFileElm.files[i]);
				var file = dbFileElm.files[i];
				if ('name' in file) {
					if (file.name === "mystock.db") {
						console.log("got my db(name)->select elem!");
						return file;
					}
				}
				else {
					if (file.fileName === "mystock.db") {
						console.log("got my db(fileName)->select elem!");
						return file;
					}
				}
			}
		}
	}
	console.log(getfile() instanceof Blob);
	var f = getfile();
	// var f = dbFileElm.files[0];
	var r = new FileReader();
	var r2 = new FileReader();
	var r3 = new FileReader();
	var r4 = new FileReader();
	var r5 = new FileReader();
	var r6 = new FileReader();
	var v = stSelElm.value;

	r.onload = function () {
		worker.onmessage = function () {
			noerror();
			var _sd = "SELECT date,PBRVal,PBRHigh,PBRLow,PERVal,price,Volume,mainBuy,";
			_sd = _sd + "mainAgent,main5Day,main20Day,open,high,low,K5,K10,K20,K60,K120,";
			_sd = _sd + "K240,K,D,V5,V20,note,";
			_sd = _sd + "voucherSell,dailyDividendRate ";
			_sd = _sd + " FROM StockValue ";
			_sd = _sd + "WHERE stockNum='" + v + "' and date<=date('now','+14 day') and price > 0 Order By date;";
			setChartData(worker, _sd);
		};
		try {
			worker.postMessage({ action: 'open', buffer: r.result }, [r.result]);
		}
		catch (exception) {
			worker.postMessage({ action: 'open', buffer: r.result });
		}
	}

	r2.onload = function () {
		worker2.onmessage = function () {
			noerror();
			setChartDataM(worker2, "SELECT range,startPrice,endPrice,hiPrice,lowPrice,inPerMMoM,inPerMYoY,inAllMYoY,SVshareholder,Fshareholder,SVpledge,Yh,Y1,Y5,Y10,Volume FROM StockMonth WHERE stockNum='" + v + "' and endPrice > 0 Order By range;");
		};
		try {
			worker2.postMessage({ action: 'open', buffer: r2.result }, [r2.result]);
		}
		catch (exception) {
			worker2.postMessage({ action: 'open', buffer: r2.result });
		}
	}

	r3.onload = function () {
		worker3.onmessage = function () {
			noerror();
			var sq = "SELECT range,shareCap,endPrice,avgPrice,operMargin,operProfitMargin,";
			sq = sq + "lossOutside,afterTaxRate,ROE,ROA,afterTaxEPS,dirRewardRate,dirNetRate,";
			sq = sq + "empRewardRate,cashDividendRate,stockDividendRate,dividendRate,";
			sq = sq + "distributionRate,cashRate,receivableGet,liabilityPay,cashFlow,";
			sq = sq + "netTaxProfit,bizAct,investAct,finAct,otherAct,netCashFlow,freeCashFlow,";
			sq = sq + "endBalance,inr,openPrice,highPrice,lowPrice FROM vStockYear WHERE stockNum='" + v + "' and (shareCap > 0 or endPrice > 0) ";
			sq = sq + "Order By case when range like '%Q%' then range else range || 'Z' end;";
			setChartDataY(worker3, sq);

		};
		try {
			worker3.postMessage({ action: 'open', buffer: r3.result }, [r3.result]);
		}
		catch (exception) {
			worker3.postMessage({ action: 'open', buffer: r3.result });
		}
	}

	r4.onload = function () {
		worker4.onmessage = function () {
			noerror();
			setPopDesc(worker4, "SELECT stockNum,bizDesc FROM StockInfo WHERE stockNum='" + v + "';");
		};
		try {
			worker4.postMessage({ action: 'open', buffer: r4.result }, [r4.result]);
		}
		catch (exception) {
			worker4.postMessage({ action: 'open', buffer: r4.result });
		}
	}

	r5.onload = function () {
		worker5.onmessage = function () {
			noerror();
			setChartDataQ(worker5, "SELECT range,fastRatio,currentRatio,debtNetRatio,shareholderEqtyRatio,totalLiabRatio,ContractLiabRatio as ContractLiability FROM vStockQuarter WHERE stockNum='" + v + "';");
		};
		try {
			worker5.postMessage({ action: 'open', buffer: r5.result }, [r5.result]);
		}
		catch (exception) {
			worker5.postMessage({ action: 'open', buffer: r5.result });
		}
	}

	r6.onload = function () {
		worker6.onmessage = function () {
			noerror();
			setChartDataW(worker6, "SELECT range,shareholderGT1000,FI_SC_5d,FI_SC_1m,FI_SC_3m,FI_SC_1y,FI_SC_3y,TI_SC_5d,TI_SC_1m,TI_SC_3m,TI_SC_1y,TI_SC_3y,SI_SC_5d,SI_SC_1m,SI_SC_3m,SI_SC_1y,SI_SC_3y,F_Own_ratio FROM StockWeek WHERE stockNum='" + v + "';");
		};
		try {
			worker6.postMessage({ action: 'open', buffer: r6.result }, [r6.result]);
		}
		catch (exception) {
			worker6.postMessage({ action: 'open', buffer: r6.result });
		}
	}

	r.readAsArrayBuffer(f);
	r2.readAsArrayBuffer(f);
	r3.readAsArrayBuffer(f);
	r4.readAsArrayBuffer(f);
	r5.readAsArrayBuffer(f);
	r6.readAsArrayBuffer(f);
	var op = stSelElm.options[stSelElm.selectedIndex].text;
	nameElm.innerText = op.substring(0, op.indexOf("("));
	typeElm.innerText = op.substring(op.indexOf("(") + 1, op.indexOf(")"));
	showStockFont(true);

}
//#endregion

//#region Set array data...
function setPopDesc(w, sqlst) {
	var s = sqlst;
	w.onmessage = function (event) {
		var results = event.data.results;
		for (var i = 0; i < results.length; i++) {
			stockObj = results[i].values;
			stockObj.forEach(function (item) {
				popDescElm.innerHTML = item[1];
			});
		}
	}
	w.postMessage({ action: 'exec', sql: s });
}

function setChartData(w, sqlst) {
	var s = sqlst, newDate;
	if (_chart_D) { _chart_D.showLoading(); }
	w.onmessage = function (event) {
		var results = event.data.results, newYear = '',
			fg = { x: null, title: "", text: "" }, tfg, revA, revI, cntI,
			fgK = { x: null, text: "", color: "", fillColor: "" }, tfgK;
		for (var i = 0; i < results.length; i++) {
			stockObj = results[i].values;
			revI = 0;
			cntI = 0;

			stockObj.forEach(function (item) {
				newYear = item[0];
				newDate = new Date(newYear).getTime();
				revI++;
				stockPBR.push([newDate, item[1]]);
				stockPBRLo.push([newDate, item[3], item[2]]);
				stockPER.push([newDate, item[4]]);
				_dayOHLC.push([newDate, item[11] === null ? item[5] : item[11], item[12] === null ? item[5] : item[12], item[13] === null ? item[5] : item[13], item[5]]);
				// _D_fitVal.push([newDate, item[6]]);
				// _D_fitLow.push([newDate, item[26]]);
				// _D_fitHigh.push([newDate, item[27]]);
				_D_Vol.push([newDate, item[6]]);
				_D_mainBuy.push([newDate, item[7]]);
				_D_mainAgent.push([newDate, item[8]]);
				_D_main5Day.push([newDate, item[9]]);
				_D_main20Day.push([newDate, item[10]]);
				_D_k5.push([newDate, item[14]]);
				_D_k10.push([newDate, item[15]]);
				_D_k20.push([newDate, item[16]]);
				_D_k60.push([newDate, item[17]]);
				_D_k120.push([newDate, item[18]]);
				_D_k240.push([newDate, item[19]]);
				_D_K.push([newDate, item[20]]);
				_D_D.push([newDate, item[21]]);
				_D_v5.push([newDate, item[22]]);
				_D_v20.push([newDate, item[23]]);
				_D_sell.push([newDate, item[25]]);
				_D_divR.push([newDate, item[26]]);
				if (!(item[24] === '' || item[24] === null)) {
					// } else {
					fg.x = newDate;
					fg.title = item[24];
					fg.text = item[24];
					tfg = Object.assign({}, fg);
					_D_flag.push(tfg);
				}
			});
		}

		for (let i = revI; i > 0; i--) {
			cntI++;
			switch (cntI - 1) {
				case 5:
					fgK.x = _dayOHLC[i][0];
					// fgK.title = "5d";
					fgK.text = "5d";
					fgK.color = "#ff0000";
					fgK.fillColor = "#ff0000";
					tfgK = Object.assign({}, fgK);
					_D_k_start.push(tfgK);
					break;
				case 10:
					fgK.x = _dayOHLC[i][0];
					// fgK.title = "10d";
					fgK.text = "10d";
					fgK.color = "#c6a300";
					fgK.fillColor = "#c6a300";
					tfgK = Object.assign({}, fgK);
					_D_k_start.push(tfgK);
					break;
				case 20:
					fgK.x = _dayOHLC[i][0];
					// fgK.title = "20d";
					fgK.text = "20d";
					fgK.color = "#00ec00";
					fgK.fillColor = "#00ec00";
					tfgK = Object.assign({}, fgK);
					_D_k_start.push(tfgK);
					break;
				case 60:
					fgK.x = _dayOHLC[i][0];
					// fgK.title = "60d";
					fgK.text = "60d";
					fgK.color = "#2828ff";
					fgK.fillColor = "#2828ff";
					tfgK = Object.assign({}, fgK);
					_D_k_start.push(tfgK);
					break;
				case 120:
					fgK.x = _dayOHLC[i][0];
					// fgK.title = "120d";
					fgK.text = "120d";
					fgK.color = "#b15bff";
					fgK.fillColor = "#b15bff";
					tfgK = Object.assign({}, fgK);
					_D_k_start.push(tfgK);
					break;
				case 240:
					fgK.x = _dayOHLC[i][0];
					// fgK.title = "240d";
					fgK.text = "240d";
					fgK.color = "#9d9d9d";
					fgK.fillColor = "#9d9d9d";
					tfgK = Object.assign({}, fgK);
					_D_k_start.push(tfgK);
					break;
			}
		}
		_D_k_start = _D_k_start.reverse();
		mapChart();
		clearArrayNDestroyChart();
		_chart_D.hideLoading();
	}
	w.postMessage({ id: 1, action: 'exec', sql: s });
}

function setChartDataM(w, sqlstm) {
	var s = sqlstm, newDate;
	if (_chart_M) { _chart_M.showLoading(); }
	w.onmessage = function (event) {
		var results = event.data.results, newYear = '';
		for (var i = 0; i < results.length; i++) {
			stockMObj = results[i].values;
			stockMObj.forEach(function (item) {
				switch (item[0].substring(5)) {
					case '01':
					case '03':
					case '05':
					case '07':
					case '08':
					case '10':
					case '12':
						newYear = item[0] + '/31';
						break;
					case '04':
					case '06':
					case '09':
					case '11':
						newYear = item[0] + '/30';
						break;
					case '02':
						newYear = item[0] + '/28';
						break;
				}
				newDate = new Date(newYear).getTime();
				_M_endPrice.push([newDate, item[1], item[3], item[4], item[2]]);
				_M_inPerMYoY.push([newDate, item[6]]);
				_M_inAllMYoY.push([newDate, item[7]]);
				_M_SVshareholder.push([newDate, item[8]]);
				_M_Fshareholder.push([newDate, item[9]]);
				_M_SVpledge.push([newDate, item[10]]);
				_M_yh.push([newDate, item[11]]);
				_M_y1.push([newDate, item[12]]);
				_M_y5.push([newDate, item[13]]);
				_M_y10.push([newDate, item[14]]);
				_M_Vol.push([newDate, item[15]]);
			});
		}
		mapChartM();
		clearArrayNDestroyChartM();
		_chart_M.hideLoading();
	}
	w.postMessage({ id: 2, action: 'exec', sql: s });
}

function setChartDataY(w, sqlsty) {
	var s = sqlsty, newDate, lastQendPrice = null;
	if (_chart_Y) { _chart_Y.showLoading(); }
	if (_chart_Y2) { _chart_Y2.showLoading(); }
	w.onmessage = function (event) {
		var results = event.data.results, newYear = '', fg = { x: null, title: "", text: "" }, tfg;
		for (var i = 0; i < results.length; i++) {
			stockYObj = results[i].values;
			stockYObj.forEach(function (item) {
				if (item[0].indexOf("Q") < 0) {
					//these are for year only---------
					newYear = item[0] + '-10';
					newDate = new Date(newYear).getTime();
					//Y2------------------------
					if (lastQendPrice) {
						_Y_OHLC_wQ.push([newDate, lastQendPrice, item[32], item[33], item[2]]);
					} else {
						_Y_OHLC_wQ.push([newDate, item[31], item[32], item[33], item[2]]);
					}
					lastQendPrice = null;
					_Y_endPrice.push([newDate, item[31], item[32], item[33], item[2]]);
					_Y_avgPrice.push([newDate, item[3]]);
					_Y_cashDividendRate.push([newDate, item[14] === '' ? null : item[14]]);
					_Y_stockDividendRate.push([newDate, item[15] === '' ? null : item[15]]);
					_Y_distributionRate.push([newDate, item[17] === '' ? null : item[17]]);
					_Y_dirRewardRate.push([newDate, item[11] === '' ? null : item[11]]);
					_Y_dirNetRate.push([newDate, item[12] === '' ? null : item[12]]);
					_Y_empRewardRate.push([newDate, item[13] === '' ? null : item[13]]);
					//Y2------------------------
				} else {
					newYear = item[0].replace('Q1', '-01').replace('Q2', '-04').replace('Q3', '-07')
					fg.x = new Date(newYear).getTime();
					fg.title = item[0].substring(4);
					fg.text = item[0];
					tfg = Object.assign({}, fg);
					_Y_range.push(tfg);
					newDate = new Date(newYear).getTime();
					_Y_OHLC_wQ.push([newDate, item[31], item[32], item[33], item[2]]);
					//set last quarter end price
					lastQendPrice = item[2];
				}
				//these are for year & quarter--------------------
				_Y_shareCap.push([newDate, item[1] === '' ? null : item[1]]);
				_Y_afterTaxEPS.push([newDate, item[10] === '' ? null : item[10]]);
				_Y2_netTaxProfit.push([newDate, item[22] === '' ? null : item[22]]);
				_Y_operMargin.push([newDate, item[4] === '' ? null : item[4]]);
				_Y_operProfitMargin.push([newDate, item[5] === '' ? null : item[5]]);
				_Y_lossOutside.push([newDate, item[6] === '' ? null : item[6]]);
				_Y_afterTaxRate.push([newDate, item[7] === '' ? null : item[7]]);
				_Y_ROE.push([newDate, item[8] === '' ? null : item[8]]);
				_Y_ROA.push([newDate, item[9] === '' ? null : item[9]]);
				_Y_liabilityPay.push([newDate, item[20] === '' ? null : item[20]]);
				_Y_cashRate.push([newDate, item[18] === '' ? null : item[18]]);
				_Y_receivableGet.push([newDate, item[19] === '' ? null : item[19]]);
				_Y_dividendRate.push([newDate, item[16] === '' ? null : item[16]]);
				_Y_cashFlow.push([newDate, item[21] === '' ? null : item[21]]);
				_Y_netTaxProfit.push([newDate, item[22] === '' ? null : item[22]]);
				_Y_bizAct.push([newDate, item[23] === '' ? null : item[23]]);
				_Y_investAct.push([newDate, item[24] === '' ? null : item[24]]);
				_Y_finAct.push([newDate, item[25] === '' ? null : item[25]]);
				_Y_otherAct.push([newDate, item[26] === '' ? null : item[26]]);
				_Y_netCashFlow.push([newDate, item[27] === '' ? null : item[27]]);
				_Y_freeCashFlow.push([newDate, item[28] === '' ? null : item[28]]);
				_Y_endBalance.push([newDate, item[29] === '' ? null : item[29]]);
				_Y_inr.push([newDate, item[30] === '' ? null : item[30]]);
			});
		}
		mapChartY();
		mapChartY2();
		clearArrayNDestroyChartY();
		_chart_Y.hideLoading();
		_chart_Y2.hideLoading();
	}
	w.postMessage({ id: 3, action: 'exec', sql: s });
}

function setChartDataQ(w, sqlstm) {
	var s = sqlstm, newDate;
	if (_chart_Q) { _chart_Q.showLoading(); }
	w.onmessage = function (event) {
		var results = event.data.results, newYear = '';
		for (var i = 0; i < results.length; i++) {
			stockQObj = results[i].values;
			stockQObj.forEach(function (item) {
				newYear = item[0].replace('Q1', '-03').replace('Q2', '-06').replace('Q3', '-09').replace('Q4', '-12');
				newDate = new Date(newYear).getTime();
				_Q_fastRatio.push([newDate, item[1]]);
				_Q_currentRatio.push([newDate, item[2]]);
				_Q_debtNetRatio.push([newDate, item[3]]);
				_Q_shareholderEqtyRatio.push([newDate, item[4]]);
				_Q_totalLiabRatio.push([newDate, item[5]]);
				_Q_ContractLiability.push([newDate, item[6]]);
			});
		}
		mapChartQ();
		clearArrayNDestroyChartQ();
		_chart_Q.hideLoading();
	}
	w.postMessage({ id: 2, action: 'exec', sql: s });
}

function setChartDataW(w, sqlstm) {
	var s = sqlstm;
	if (_chart_W) { _chart_W.showLoading(); }
	w.onmessage = function (event) {
		var results = event.data.results, newYear, d1, ds,
			oneDay = 1000 * 60 * 60 * 24;

		for (var i = 0; i < results.length; i++) {
			var stockWbj = results[i].values;
			stockWbj.forEach(function (item) {
				d1 = new Date('20' + item[0].substr(item[0].indexOf('W') - 2, 2), 0, 0);
				ds = item[0].substr(item[0].indexOf('W') + 1, 2) * 7;
				newYear = ds * oneDay + d1.getTime();

				_W_shareholderGT1000.push([newYear, item[1]]);
				_W_FI_SC_5d.push([newYear, item[2]]);
				_W_FI_SC_1m.push([newYear, item[3]]);
				_W_FI_SC_3m.push([newYear, item[4]]);
				_W_FI_SC_1y.push([newYear, item[5]]);
				_W_FI_SC_3y.push([newYear, item[6]]);
				_W_TI_SC_5d.push([newYear, item[7]]);
				_W_TI_SC_1m.push([newYear, item[8]]);
				_W_TI_SC_3m.push([newYear, item[9]]);
				_W_TI_SC_1y.push([newYear, item[10]]);
				_W_TI_SC_3y.push([newYear, item[11]]);
				_W_SI_SC_5d.push([newYear, item[12]]);
				_W_SI_SC_1m.push([newYear, item[13]]);
				_W_SI_SC_3m.push([newYear, item[14]]);
				_W_SI_SC_1y.push([newYear, item[15]]);
				_W_SI_SC_3y.push([newYear, item[16]]);
				_W_F_Own_ratio.push([newYear, item[17]]);
			});
		}
		mapChartW();
		clearArrayNDestroyChartW();
		_chart_W.hideLoading();
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
function mapChart() {
	//#region base var
	var _leftYLabTitlePos = -55,
		_leftYLabOffset = -460;
	//#endregion
	//#region  chart~
	_chart_D = Highcharts.stockChart('containerD', {
		//#region head setting
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
			selected: par_DaySelectRange,	//1 => 6 months, 3 => 1.5 year
			verticalAlign: 'bottom',
			margin: 0,
			inputEnabled: false,
			buttons: [{
				type: 'month',
				count: 3,
				text: '3m',
			}, {
				type: 'month',
				count: 6,
				text: '6m'
			}, {
				type: 'year',
				count: 1,
				text: '1y'
			}, {
				type: 'month',
				count: 18,
				text: '1.5y'
			}, {
				type: 'all',
				text: 'All'
			}]
		},
		plotOptions: {
			candlestick: {
				color: 'green',
				upColor: 'red',
				lineColor: '#009100',
				upLineColor: '#ae0000',
				animation: false
			},
			vbp: {
				animation: false,
				volumeDivision: {
					styles: {
						negativeColor: 'rgba(0, 200, 0, 0.2)',
						positiveColor: 'rgba(200, 0, 0, 0.2)'
					}
				},
			},
			macd: {
				animation: false,
				zones: [{
					value: 0,
					color: 'green'
				}, {
					color: 'red'
				}],
				macdLine: {
					styles: {
						lineColor: 'red'
					},
				},
				signalLine: {
					styles: {
						lineColor: 'blue'
					}
				}
			},
			series: {
				animation: false,
				dataGrouping: {
					forced: true,
					units: [[
						'day',
						[1]
					], [
						'week',
						[1, 2]
					]]
				}
			}
		},
		legend: {
			title: {
				text: '<span class="spanRange">日</span>',
			},
			enabled: true,
			align: 'right',
			verticalAlign: 'top',
			layout: 'vertical',
			squareSymbol: true,
			symbolPadding: 1,
			margin: 0,
			x: 0,
			y: 100,
			width: 80
		},
		navigator: {
			height: 20,
			margin: 0,
		},
		tooltip: {
			animation: false,
			split: false,
			padding: 1,
			valueDecimals: 2,
			hideDelay: 0,
			shared: true,
			outside: true,
			positioner: function (boxWidth, boxHeight, point) {
				var chart = this.chart;
				var plotWidth = chart.plotWidth;
				return { x: plotWidth + 170, y: 5 };
			}
		},
		//#endregion
		xAxis: {
			crosshair: {
				width: 1,
				color: 'red'
			},
			type: 'datetime',
			tickInterval: 24 * 36e5, // one day
			labels: {
				format: '{value:\'%y/%m/%d}',
			}
		},
		//#region yAxis~ 
		yAxis: [{
			labels: {
				align: 'left',
			},
			title: {
				text: '成交量',
				x: _leftYLabTitlePos
			},
			offset: _leftYLabOffset,
			margin: 0,
			startOnTick: false,
			top: '25%',
			height: '20%',
		}, {
			title: {
				text: '股價(元)'
			},
			height: '37%',
			offset: 0,
			startOnTick: false,
			// opposite: true,
			crosshair: {
				width: 1,
				color: 'red'
			}
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '股淨比',
				x: _leftYLabTitlePos + 10
			},
			top: '45%',
			height: '13%',
			offset: _leftYLabOffset,
			lineWidth: 1,
			margin: 0,
			startOnTick: false,
		}, {
			title: {
				text: '本益比'
			},
			top: '45%',
			height: '13%',
			offset: 0,
			lineWidth: 1,
			startOnTick: false,
			opposite: true
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '借券賣出餘額',
				x: _leftYLabTitlePos + 10
			},
			top: '58%',
			height: '13%',
			offset: _leftYLabOffset,
			lineWidth: 1,
			margin: 0,
			startOnTick: false,
		}, {
			title: {
				text: '主力集中度'
			},
			top: '58%',
			height: '13%',
			offset: 0,
			lineWidth: 1,
			startOnTick: false,
			opposite: true
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: 'KD值',
				x: _leftYLabTitlePos + 10
			},
			offset: _leftYLabOffset,
			margin: 0,
			top: '71%',
			height: '15%',
			startOnTick: false,
			min: 0,
			max: 100,
			plotLines: [{
				value: 20,
				color: 'green',
				dashStyle: 'shortdash',
				width: 1,
			}, {
				value: 80,
				color: 'red',
				dashStyle: 'shortdash',
				width: 1,
			}, {
				value: 50,
				color: 'blue',
				dashStyle: 'shortdash',
				width: 1,
			}]
		}, {
			title: {
				text: '買賣券商差',
			},
			offset: 0,
			margin: 0,
			top: '71%',
			height: '15%',
			lineWidth: 1,
			startOnTick: false,
			opposite: true
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: 'MACD值',
				x: _leftYLabTitlePos + 10
			},
			offset: _leftYLabOffset,
			margin: 0,
			top: '86%',
			height: '14%',
			startOnTick: false,
		}, {
			title: {
				text: '主力買超'
			},
			top: '86%',
			height: '14%',
			offset: 0,
			margin: 0,
			lineWidth: 1,
			startOnTick: false,
			opposite: true
		}, {
			title: {
				text: '殖利率'
			},
			top: '0%',
			height: '13%',
			offset: 0,
			lineWidth: 1,
			startOnTick: false,
			// opposite: true
		}],
		//#endregion
		//#region series~
		series: [{
			name: '股價⇨',
			data: _dayOHLC,
			type: 'candlestick',
			id: '_price',
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '5日均線⇨',
			data: _D_k5,
			color: '#ff0000',
			lineWidth: 0.8,
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '10日均線⇨',
			data: _D_k10,
			color: '#c6a300',
			// dashStyle: 'DotDot',
			lineWidth: 0.8,
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '20日均線⇨',
			data: _D_k20,
			color: '#00ec00',
			lineWidth: 0.8,
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '60日均線⇨',
			data: _D_k60,
			color: '#2828ff',
			lineWidth: 0.8,
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '120日均線⇨',
			data: _D_k120,
			color: '#b15bff',
			dashStyle: 'LongDashDot',
			lineWidth: 1,
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '240日均線⇨',
			data: _D_k240,
			color: '#9d9d9d',
			dashStyle: 'LongDash',
			lineWidth: 0.9,
			// visible: false,
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			type: 'column',
			grouping: false,
			name: '⇦成交量',
			data: _D_Vol,
			color: 'rgba(43, 138, 254, 0.3)',
			borderWidth: 0.3,
			pointPadding: 0,
			groupPadding: 0,
			borderColor: 'rgba(43, 138, 254, 1)',
			yAxis: 0,
			id: '_volumn',
			tooltip: {
				useHTML: true,
				pointFormatter: function () {
					var s = '';
					if (this.y > 100000000) {
						s = '<span style="color:{point.color}">\u25CF</span> ' + this.series.name + ': <b>' + Math.round(this.y / 100000000).toLocaleString('zh-Hant', 'currency') + '億元</b><br/>'
					} else {
						s = '<span style="color:{point.color}">\u25CF</span> ' + this.series.name + ': <b>' + this.y.toLocaleString('zh-Hant', 'currency') + '張</b><br/>'
					}
					return s;
				}
			}
		}, {
			type: 'vbp',
			linkedTo: '_price',
			yAxis: 1,
			params: {
				volumeSeriesID: '_volumn',
			},
			dataLabels: {
				enabled: false,
			},
			zoneLines: {
				enabled: false,
			}
		}, {
			name: '⇦5日均量',
			type: 'column',
			grouping: false,
			groupPadding: 0.1,
			data: _D_v5,
			color: 'rgba(248, 96, 13, 0.3)',
			lineWidth: 0.1,
			yAxis: 0,
			credits: {
				enabled: false
			},
			tooltip: {
				useHTML: true,
				pointFormatter: function () {
					var s = '';
					if (this.y > 100000000) {
						s = '<span style="color:{point.color}">\u25CF</span> ' + this.series.name + ': <b>' + Math.round(this.y / 100000000).toLocaleString('zh-Hant', 'currency') + '億元</b><br/>'
					} else {
						s = '<span style="color:{point.color}">\u25CF</span> ' + this.series.name + ': <b>' + this.y.toLocaleString('zh-Hant', 'currency') + '張</b><br/>'
					}
					return s;
				}
			}
		}, {
			name: '⇦20日均量',
			type: 'column',
			grouping: false,
			groupPadding: 0.3,
			data: _D_v20,
			color: 'rgba(7, 131, 15, 0.4)',
			lineWidth: 0.1,
			yAxis: 0,
			credits: {
				enabled: false
			},
			tooltip: {
				useHTML: true,
				pointFormatter: function () {
					var s = '';
					if (this.y > 100000000) {
						s = '<span style="color:{point.color}">\u25CF</span> ' + this.series.name + ': <b>' + Math.round(this.y / 100000000).toLocaleString('zh-Hant', 'currency') + '億元</b><br/>'
					} else {
						s = '<span style="color:{point.color}">\u25CF</span> ' + this.series.name + ': <b>' + this.y.toLocaleString('zh-Hant', 'currency') + '張</b><br/>'
					}
					return s;
				}
			}
		}, {
			name: '⇦股淨比',
			data: stockPBR,
			color: '#f00078',
			id: '_ex_flag',
			yAxis: 2,
			zIndex: 1,
		}, {
			name: '⇦股淨比區間',
			data: stockPBRLo,
			type: 'arearange',
			color: '#ddddff',
			id: '_ar_range',
			yAxis: 2,
			linkedTo: 'previous',
			zIndex: 0,
		}, {
			type: 'flags',
			name: '日',
			color: '#000000',
			fillColor: 'rgba(220,0,0,0.2)',
			data: _D_flag,
			yAxis: 2,
			showInLegend: false,
			onSeries: '_div_flag',
			shape: 'circlepin'
		}, {
			name: '本益比⇨',
			data: stockPER,
			dashStyle: 'shortdot',
			color: '#000000',
			yAxis: 3,
			tooltip: {
				valueSuffix: '倍'
			}
		}, {
			name: '⇦借券賣出餘額',
			data: _D_sell,
			type: 'line',
			color: '#0080ff',
			yAxis: 4,
			tooltip: {
				valueSuffix: '張',
				valueDecimals: 0
			},
			credits: {
				enabled: false
			}
		}, {
			name: '主力5日集中度⇨',
			data: _D_main5Day,
			type: 'area',
			color: 'rgba(255,157,111,1)',
			fillColor: 'rgba(255,157,111,0.3)',
			yAxis: 5,
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '主力20日集中度⇨',
			data: _D_main20Day,
			dashStyle: 'shortdot',
			color: '#64a600',
			yAxis: 5,
			tooltip: {
				valueSuffix: '%'
			}
		}, {
			name: '⇦K',
			data: _D_K,
			id: 'K_line',
			color: '#ff0000',
			yAxis: 6,
			lineWidth: 1.5,
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '⇦D',
			data: _D_D,
			color: '#0000e3',
			linkedTo: 'K_line',
			showInLegend: true,
			yAxis: 6,
			lineWidth: 1,
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '買賣券商差⇨',
			data: _D_mainAgent,
			type: 'area',
			color: 'rgba(166,166,210,1)',
			fillColor: 'rgba(166,166,210,0.3)',
			yAxis: 7,
			tooltip: {
				valueSuffix: '家',
				valueDecimals: 0
			},
			credits: {
				enabled: false
			}
		}, {
			name: '主力買超⇨',
			data: _D_mainBuy,
			type: 'area',
			color: 'rgba(102,179,255,1)',
			fillColor: 'rgba(102,179,255,0.3)',
			yAxis: 9,
			zIndex: -1,
			tooltip: {
				valueSuffix: '張',
				valueDecimals: 0
			},
			credits: {
				enabled: false
			}
		}, {
			name: '殖利率⇨',
			data: _D_divR,
			dashStyle: 'shortdot',
			color: '#ff0000',
			id: '_div_flag',
			yAxis: 10,
			zIndex: -1,
			connectNulls: true,
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}]
		//#endregion
	});
	//#endregion
	if (_dayOHLC.length > (26 + 9)) {
		//must has more data in case of not to trigger errors
		_chart_D.addSeries({
			name: '⇦MACD',
			type: 'macd',
			yAxis: 8,
			linkedTo: '_price',
			connectNulls: true,
			credits: {
				enabled: false
			}
		});
	}

	if (_D_k_start.length > 0) {
		_chart_D.addSeries({
			type: 'flags',
			data: _D_k_start,
			onSeries: '_ar_range',
			shape: 'triangle',
			height: 3,
			width: 3,
			title: ' ',
			showInLegend: false,
			yAxis: 0,
		});
	}
}

function mapChartW() {
	//#region var ~
	var _leftYLabTitlePos = -55,
		_leftYLabOffset = -460;
	//#endregion
	//#region chart~
	_chart_W = Highcharts.stockChart('containerW', {
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
				type: 'week',
				count: 13,
				text: 'Q'
			}, {
				type: 'week',
				count: 52,
				text: 'y'
			}, {
				type: 'week',
				count: 260,
				text: '5y'
			}, {
				type: 'all',
				text: 'All'
			}]
		},
		plotOptions: {
			// area: {
			// 	stacking: 'normal',
			// },
			candlestick: {
				color: 'green',
				upColor: 'red',
				animation: false,
			},
			series: {
				animation: false
			}
		},
		legend: {
			title: {
				text: '<span class="spanRange">週</span>',
			},
			enabled: true,
			align: 'right',
			verticalAlign: 'top',
			layout: 'vertical',
			symbolPadding: 1,
			margin: 0,
			x: 0,
			y: 10,
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
			// crosshairs: [true, true],
			xDateFormat: "'%y/%m/%d",
			positioner: function (boxWidth, boxHeight, point) {
				return { x: 490, y: 650 };
			}
		},
		//#endregion
		xAxis: {
			crosshair: {
				width: 1,
				// color: 'red'
			},
			type: 'datetime',
			tickInterval: 3 * 7 * 24 * 36e5, // 3 weeks
			labels: {
				format: '{value:\'%y/%m/%d}',
			}
		},
		//#region yAxis~		
		yAxis: [{
			labels: {
				align: 'left',
			},
			title: {
				text: '外持股比',
				x: _leftYLabTitlePos + 10
			},
			offset: _leftYLabOffset,
			margin: 0,
			height: '50%',
			startOnTick: false,
			minRange: 10
		}, {
			title: {
				text: '外資買賣超',
			},
			offset: 0,
			height: '50%',
			startOnTick: false,
			opposite: true
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '千張大戶比',
				x: _leftYLabTitlePos + 10
			},
			offset: _leftYLabOffset,
			margin: 0,
			top: '50%',
			height: '50%',
			startOnTick: false,
			minRange: 10
		}, {
			title: {
				text: '投信買賣超',
			},
			offset: 0,
			top: '50%',
			height: '50%',
			startOnTick: false,
			opposite: true
		}],
		//#endregion

		//#region series~
		series: [{
			name: '⇦外資持股比',
			data: _W_F_Own_ratio,
			// type: 'area',
			color: '#2941DF',
			connectNulls: true,
			yAxis: 0,
			zIndex: 3,
			lineWidth: 3,
			tooltip: {
				valueSuffix: '%',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '外資5日⇨',
			data: _W_FI_SC_5d,
			// type: 'area',
			color: '#F0AD31',
			yAxis: 1,
			// zIndex: 1,
			lineWidth: 0.7,
			tooltip: {
				valueSuffix: '張',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '外資1月⇨',
			data: _W_FI_SC_1m,
			type: 'area',
			yAxis: 1,
			color: 'rgba(201,38,195,1)',
			fillColor: 'rgba(201,38,195,0.2)',
			lineWidth: 1.2,
			tooltip: {
				valueSuffix: '張'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '外資3月⇨',
			data: _W_FI_SC_3m,
			yAxis: 1,
			color: '#796400',
			dashStyle: 'Dot',
			lineWidth: 1,
			tooltip: {
				valueSuffix: '張'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '外資1年⇨',
			data: _W_FI_SC_1y,
			dashStyle: 'ShortDot',
			yAxis: 1,
			lineWidth: 1,
			color: '#00db00',
			tooltip: {
				valueSuffix: '張'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '外資3年⇨',
			data: _W_FI_SC_3y,
			dashStyle: 'DashDot',
			yAxis: 1,
			lineWidth: 1,
			visible: false,
			color: '#3d7878',
			tooltip: {
				valueSuffix: '張'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '⇦千張以上大戶',
			data: _W_shareholderGT1000,
			// dashStyle: 'DashDot',
			color: '#f75000',
			connectNulls: true,
			yAxis: 2,
			lineWidth: 3,
			zIndex: 3,
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '投信5日⇨',
			data: _W_SI_SC_5d,
			// type: 'area',
			color: '#F0AD31',
			yAxis: 3,
			// zIndex: 1,
			lineWidth: 0.7,
			tooltip: {
				valueSuffix: '張',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '投信1月⇨',
			data: _W_SI_SC_1m,
			type: 'area',
			yAxis: 3,
			color: 'rgba(201,38,195,1)',
			fillColor: 'rgba(201,38,195,0.2)',
			lineWidth: 1.2,
			tooltip: {
				valueSuffix: '張'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '投信3月⇨',
			data: _W_SI_SC_3m,
			yAxis: 3,
			color: '#796400',
			dashStyle: 'Dot',
			lineWidth: 1,
			tooltip: {
				valueSuffix: '張'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '投信1年⇨',
			data: _W_SI_SC_1y,
			dashStyle: 'ShortDot',
			yAxis: 3,
			color: '#00db00',
			lineWidth: 1,
			tooltip: {
				valueSuffix: '張'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '投信3年⇨',
			data: _W_SI_SC_3y,
			dashStyle: 'DashDot',
			yAxis: 3,
			color: '#3d7878',
			lineWidth: 1,
			visible: false,
			tooltip: {
				valueSuffix: '張'
			},
			credits: {
				enabled: false
			}
		}]
		//#endregion
	});
	//#endregion
}

function mapChartM() {
	//#region var ~
	var _leftYLabTitlePos = -55,
		_leftYLabOffset = -460;
	//#endregion
	//#region chart~
	_chart_M = Highcharts.stockChart('containerM', {
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
			// area: {
			// 	stacking: 'normal',
			// },
			candlestick: {
				color: 'green',
				upColor: 'red',
				lineColor: '#009100',
				upLineColor: '#ae0000',
				animation: false,
			},
			vbp: {
				animation: false,
				volumeDivision: {
					styles: {
						negativeColor: 'rgba(0, 200, 0, 0.2)',
						positiveColor: 'rgba(200, 0, 0, 0.2)'
					}
				},
			},
			macd: {
				animation: false,
				zones: [{
					value: 0,
					color: 'green'
				}, {
					color: 'red'
				}],
				macdLine: {
					styles: {
						lineColor: 'red'
					},
				},
				signalLine: {
					styles: {
						lineColor: 'blue'
					}
				}
			},
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
				text: '<span class="spanRange">月</span>',
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
			labels: {
				align: 'left',
			},
			title: {
				text: '持股比',
				x: _leftYLabTitlePos + 10
			},
			offset: _leftYLabOffset,
			margin: 0,
			height: '50%',
			startOnTick: false,
		}, {
			title: {
				text: '股價',
			},
			offset: 0,
			height: '50%',
			startOnTick: false,
			opposite: true,
			crosshair: {
				width: 1,
				color: 'red'
			}
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '成交量',
				x: _leftYLabTitlePos + 10
			},
			offset: _leftYLabOffset,
			margin: 0,
			top: '35%',
			height: '30%',
			startOnTick: false,
		}, {
			title: {
				text: 'MACD值',
			},
			offset: 0,
			top: '45%',
			height: '30%',
			startOnTick: false,
			opposite: true,
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '比率',
				x: _leftYLabTitlePos + 10
			},
			offset: _leftYLabOffset,
			margin: 0,
			top: '65%',
			height: '35%',
			startOnTick: false,
		}, {
			title: {
				text: '增率',
			},
			offset: 0,
			top: '65%',
			height: '35%',
			startOnTick: false,
			floor: -200,
			ceiling: 200,
			opposite: true
		}],
		//#endregion

		//#region series~
		series: [{
			name: '⇦外資持股比',
			data: _M_Fshareholder,
			lineWidth: 2.5,
			yAxis: 0,
			color: '#2828ff',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '收盤價⇨',
			data: _M_endPrice,
			type: 'candlestick',
			id: '_priceM',
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '半年均線⇨',
			data: _M_yh,
			color: '#ff0000',
			lineWidth: 0.8,
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '1年均線⇨',
			data: _M_y1,
			color: '#c6a300',
			lineWidth: 0.8,
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '5年均線⇨',
			data: _M_y5,
			color: '#00ec00',
			lineWidth: 0.8,
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '10年均線⇨',
			data: _M_y10,
			color: '#2828ff',
			dashStyle: 'longdash',
			lineWidth: 0.8,
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			type: 'column',
			grouping: false,
			name: '⇦成交量',
			data: _M_Vol,
			color: 'rgba(43, 138, 254, 0.3)',
			borderWidth: 0.3,
			pointPadding: 0,
			groupPadding: 0,
			borderColor: 'rgba(43, 138, 254, 1)',
			yAxis: 2,
			id: '_volumn',
			tooltip: {
				useHTML: true,
				pointFormatter: function () {
					var s = '';
					if (this.y > 100000000) {
						s = '<span style="color:{point.color}">\u25CF</span> ' + this.series.name + ': <b>' + Math.round(this.y / 100000000).toLocaleString('zh-Hant', 'currency') + '億元</b><br/>'
					} else {
						s = '<span style="color:{point.color}">\u25CF</span> ' + this.series.name + ': <b>' + this.y.toLocaleString('zh-Hant', 'currency') + '張</b><br/>'
					}
					return s;
				}
			}
		}, {
			name: '單月年增率⇨',
			data: _M_inPerMYoY,
			type: 'area',
			color: 'rgba(255,149,202,1)',
			fillColor: 'rgba(255,149,202,0.3)',
			yAxis: 5,
			tooltip: {
				valueSuffix: '%',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '累月年增率⇨',
			data: _M_inAllMYoY,
			type: 'area',
			color: 'rgba(255,230,111,1)',
			fillColor: 'rgba(255,230,111,0.3)',
			yAxis: 5,
			tooltip: {
				valueSuffix: '%',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '⇦董監持股比',
			data: _M_SVshareholder,
			yAxis: 4,
			color: '#272727',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '⇦董監質押比',
			data: _M_SVpledge,
			dashStyle: 'ShortDashDot',
			yAxis: 4,
			color: '#ff0000',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}]
		//#endregion
	});
	//#endregion
	if (_M_endPrice.length > (26 + 9)) {
		//must has more data in case of not to trigger errors
		_chart_M.addSeries({
			name: '⇦MACD',
			type: 'macd',
			yAxis: 3,
			linkedTo: '_priceM',
			connectNulls: true,
			credits: {
				enabled: false
			}
		});
	}
}

function mapChartQ() {
	Highcharts.dateFormats = {
		Q: function (timestamp) {
			var date = new Date(timestamp);
			return 1 + Math.floor(date.getUTCMonth() / 3);
		}
	};
	//#region var ~
	var _leftYLabTitlePos = -55,
		_leftYLabOffset = -460;
	//#endregion
	//#region chart~
	_chart_Q = Highcharts.stockChart('containerQ', {
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
				count: 2,
				text: '2y'
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
			area: {
				stacking: 'normal',
				animation: false,
			},
			candlestick: {
				color: 'green',
				upColor: 'red',
				animation: false,
			},
			series: {
				animation: false,
				dataGrouping: {
					forced: true,
					units: [[
						'month',
						[3, 6, 9]
					], [
						'year',
						[1]
					]]
				}
			}
		},
		legend: {
			title: {
				text: '<span class="spanRange">季</span>',
			},
			enabled: true,
			align: 'right',
			verticalAlign: 'top',
			layout: 'vertical',
			symbolPadding: 1,
			margin: 0,
			x: 0,
			y: 5,
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
			crosshairs: [true, false],
			xDateFormat: "'%y Q%Q",
			positioner: function (boxWidth, boxHeight, point) {
				return { x: 490, y: 940 };
			}
		},
		//#endregion
		xAxis: {
			type: 'datetime',
			labels: {
				format: '{value:\'%y Q%Q}',
				x: 10
			}
		},
		//#region yAxis~		
		yAxis: [{
			title: {
				text: '比率',
			},
			offset: 0,
			height: '100%',
			startOnTick: false,
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '佔股本比',
				x: _leftYLabTitlePos + 10
			},
			offset: _leftYLabOffset,
			margin: 0,
			height: '100%',
			startOnTick: false,
		}],
		//#endregion

		//#region series~
		series: [{
			name: '速動比',
			data: _Q_fastRatio,
			color: '#c2ff68',
			yAxis: 0,
			tooltip: {
				valueSuffix: '%',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '流動比',
			data: _Q_currentRatio,
			color: '#ff9797',
			yAxis: 0,
			zIndex: 1,
			tooltip: {
				valueSuffix: '%',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '負債對淨值比',
			data: _Q_debtNetRatio,
			type: 'area',
			yAxis: 0,
			color: 'rgba(93,160,227,1)',
			fillColor: 'rgba(93,160,227,0.2)',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '股東權益總額',
			data: _Q_shareholderEqtyRatio,
			yAxis: 0,
			color: '#796400',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '負債總額',
			data: _Q_totalLiabRatio,
			dashStyle: 'ShortDot',
			yAxis: 0,
			color: '#00db00',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '⇦合約負債',
			data: _Q_ContractLiability,
			dashStyle: 'Dash',
			// type: 'area',
			yAxis: 1,
			color: '#0000ff',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}]
		//#endregion
	});
	//#endregion
}

function mapChartY() {
	//#region var ~
	var _leftYLabTitlePos = -55,
		_leftYLabOffset = -460;
	//#endregion
	//#region chart~
	_chart_Y = Highcharts.stockChart('containerY', {
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
				count: 3,
				text: '3y'
			}, {
				type: 'year',
				count: 5,
				text: '5y'
			}, {
				type: 'year',
				count: 10,
				text: '10y'
			}, {
				type: 'all',
				text: 'All'
			}]
		},
		plotOptions: {
			area: {
				stacking: 'normal',
				animation: false
			},
			candlestick: {
				color: 'green',
				upColor: 'red',
				lineColor: '#009100',
				upLineColor: '#ae0000',
				animation: false
			},
			series: {
				animation: false,
				dataGrouping: {
					forced: true,
					units: [[
						'month',
						[3]
					], [
						'year',
						[1, 2, 5]
					]]
				}
			}
		},
		legend: {
			title: {
				text: '<span class="spanRange">年</span>',
			},
			enabled: true,
			align: 'right',
			verticalAlign: 'top',
			layout: 'vertical',
			symbolPadding: 1,
			margin: 0,
			x: 0,
			y: 10,
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
			xDateFormat: "%Y",
			positioner: function (boxWidth, boxHeight, point) {
				var chart = this.chart;
				var plotWidth = chart.plotWidth;
				return { x: plotWidth + 170, y: 590 };
			}
		},
		//#endregion
		xAxis: {
			crosshair: {
				width: 1,
				color: 'red'
			},
			type: 'datetime',
			labels: {
				format: '{value:%Y}',
				x: 35,
			}
		},
		//#region yAxis~		
		yAxis: [{
			labels: {
				align: 'left',
			},
			title: {
				text: '股價',
				x: _leftYLabTitlePos
			},
			height: '25%',
			offset: _leftYLabOffset,
			startOnTick: false,
			crosshair: {
				width: 1,
				color: 'red'
			},
			margin: 0,
		}, {
			title: {
				text: '增率(%)',
			},
			offset: 0,
			top: '10%',
			height: '30%',
			startOnTick: false,
			opposite: true
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '投淨比',
				x: _leftYLabTitlePos
			},
			top: '40%',
			height: '30%',
			offset: _leftYLabOffset,
			margin: 0,
			startOnTick: false,
		}, {
			title: {
				text: '現金流',
			},
			offset: 0,
			top: '40%',
			height: '30%',
			startOnTick: false,
			opposite: true
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: 'EPS',
				x: _leftYLabTitlePos
			},
			top: '70%',
			height: '15%',
			offset: _leftYLabOffset,
			margin: 0,
			startOnTick: false,
		}, {
			title: {
				text: '股本'
			},
			top: '70%',
			height: '15%',
			offset: 0,
			startOnTick: false,
			crosshair: {
				width: 1,
				color: 'red'
			},
			opposite: true
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '現金流量',
				x: _leftYLabTitlePos
			},
			top: '85%',
			height: '15%',
			offset: _leftYLabOffset,
			startOnTick: false,
			margin: 0,
		}, {
			title: {
				text: '佔總資產比'
			},
			top: '85%',
			height: '15%',
			offset: 0,
			startOnTick: false,
			opposite: true
		}],
		//#endregion

		//#region series~
		series: [
			{
				name: '⇦收盤價',
				data: _Y_OHLC_wQ, //_M_endPrice,
				type: 'candlestick',
				//id: '_priceM',
				yAxis: 0,
				tooltip: {
					valueSuffix: '元'
				},
				credits: {
					enabled: false
				}
			},
			{
				name: '營業毛利⇨',
				data: _Y_operMargin,
				color: '#007500',
				connectNulls: true,
				yAxis: 1,
				tooltip: {
					valueSuffix: '%',
				},
				credits: {
					enabled: false
				}
			}, {
				name: '營業利益⇨',
				data: _Y_operProfitMargin,
				color: '#2E37B9',
				connectNulls: true,
				dashStyle: 'DashDot',
				yAxis: 1,
				tooltip: {
					valueSuffix: '%',
				},
				credits: {
					enabled: false
				}
			}, {
				name: '業外損益⇨',
				data: _Y_lossOutside,
				type: 'column',
				zIndex: -1,
				yAxis: 1,
				color: '#ff9797',
				tooltip: {
					valueSuffix: '%'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '稅後淨利⇨',
				data: _Y_afterTaxRate,
				type: 'column',
				zIndex: -1,
				yAxis: 1,
				color: '#ceffce',
				tooltip: {
					valueSuffix: '%'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '股東權益ROE⇨',
				data: _Y_ROE,
				yAxis: 1,
				id: '_oper_data',
				color: '#ff8040',
				connectNulls: true,
				tooltip: {
					valueSuffix: '%'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '資產報酬ROA⇨',
				data: _Y_ROA,
				dashStyle: 'shortdot',
				yAxis: 1,
				color: '#272727',
				connectNulls: true,
				tooltip: {
					valueSuffix: '%'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '⇦5年投資淨利比',
				data: _Y_inr,
				type: 'area',
				zIndex: -1,
				color: 'rgba(181,181,181,1)',
				fillColor: 'rgba(181,181,181,0.3)',
				yAxis: 2,
				tooltip: {
					valueSuffix: '%'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '營業活動⇨',
				data: _Y_bizAct,
				color: '#007500',
				dashStyle: 'Dash',
				yAxis: 3,
				id: '_biz_data',
				tooltip: {
					valueSuffix: '億元',
				},
				credits: {
					enabled: false
				}
			}, {
				name: '投資活動⇨',
				data: _Y_investAct,
				color: '#5DA3DF',
				dashStyle: 'ShortDashDot',
				yAxis: 3,
				tooltip: {
					valueSuffix: '億元',
				},
				credits: {
					enabled: false
				}
			}, {
				name: '融資活動⇨',
				data: _Y_finAct,
				yAxis: 3,
				color: '#33D55E',
				tooltip: {
					valueSuffix: '億元'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '淨現金流⇨',
				data: _Y_netCashFlow,
				type: 'area',
				yAxis: 3,
				color: 'rgba(255,128,64,1)',
				fillColor: 'rgba(255,128,64,0.3)',
				tooltip: {
					valueSuffix: '億元'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '自由金流⇨',
				data: _Y_freeCashFlow,
				yAxis: 3,
				color: '#F04141',
				tooltip: {
					valueSuffix: '億元'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '期末餘額⇨',
				data: _Y_endBalance,
				dashStyle: 'shortdot',
				yAxis: 3,
				color: '#272727',
				tooltip: {
					valueSuffix: '億元'
				},
				credits: {
					enabled: false
				}
			}, {
				type: 'flags',
				name: '季',
				data: _Y_range,
				color: '#000000',
				fillColor: 'rgba(220,0,0,0.2)',
				yAxis: 4,
				showInLegend: false,
				onSeries: '_Y_div',
				shape: 'circlepin'
			}, {
				name: '⇦稅後EPS',
				data: _Y_afterTaxEPS,
				id: '_Y_div',
				color: '#4a4aff',
				connectNulls: true,
				yAxis: 4,
				tooltip: {
					valueSuffix: '元'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '稅後淨利⇨',
				type: 'column',
				data: _Y2_netTaxProfit,
				id: '_tax_net',
				yAxis: 5,
				color: '#00db00',
				zIndex: -1,
				tooltip: {
					valueSuffix: '億元'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '股本⇨',
				type: 'column',
				data: _Y_shareCap,
				yAxis: 5,
				color: '#ff8f59',
				zIndex: -1,
				tooltip: {
					valueSuffix: '億元'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '⇦現金流量',
				data: _Y_cashFlow,
				connectNulls: true,
				yAxis: 6,
				tooltip: {
					valueSuffix: '%'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '負債總額⇨',
				data: _Y_liabilityPay,
				type: 'area',
				yAxis: 7,
				zIndex: -1,
				color: 'rgba(83,222,155,1)',
				fillColor: 'rgba(83,222,155,0.2)',
				tooltip: {
					valueSuffix: '%'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '現金佔資產⇨',
				data: _Y_cashRate,
				yAxis: 7,
				color: '#FD4C4C',
				connectNulls: true,
				tooltip: {
					valueSuffix: '%'
				},
				credits: {
					enabled: false
				}
			}, {
				name: '應收帳款⇨',
				data: _Y_receivableGet,
				dashStyle: 'ShortDot',
				connectNulls: true,
				yAxis: 7,
				color: '#3D406E',
				tooltip: {
					valueSuffix: '%'
				},
				credits: {
					enabled: false
				}
			}]
		//#endregion
	});
	//#endregion
}

function mapChartY2() {
	//#region var ~
	var _leftYLabTitlePos = -55,
		_leftYLabOffset = -460;
	//#endregion
	//#region chart~
	_chart_Y2 = Highcharts.stockChart('containerY2', {
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
			selected: 3,
			verticalAlign: 'bottom',
			margin: 0,
			inputEnabled: false,
			buttons: [{
				type: 'year',
				count: 3,
				text: '3y'
			}, {
				type: 'year',
				count: 5,
				text: '5y'
			}, {
				type: 'year',
				count: 10,
				text: '10y'
			}, {
				type: 'year',
				count: 20,
				text: '20y'
			}, {
				type: 'all',
				text: 'All'
			}]
		},
		plotOptions: {
			area: {
				stacking: 'normal',
				animation: false
			},
			candlestick: {
				color: 'green',
				upColor: 'red',
				lineColor: '#009100',
				upLineColor: '#ae0000',
				animation: false
			},
			series: {
				animation: false
			}
		},
		legend: {
			title: {
				text: '<span class="spanRange">年</span>',
			},
			enabled: true,
			align: 'right',
			verticalAlign: 'top',
			layout: 'vertical',
			symbolPadding: 1,
			margin: 0,
			x: 0,
			y: 10,
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
			useHTML: true,
			xDateFormat: "%Y",
			positioner: function (boxWidth, boxHeight, point) {
				return { x: 490, y: 350 };
			}
		},
		//#endregion
		xAxis: {
			type: 'datetime',
			labels: {
				format: '{value:%Y}',
				x: 35,
			}
		},
		//#region yAxis~		
		yAxis: [{
			labels: {
				align: 'left',
			},
			title: {
				text: '盈餘分配率',
				x: _leftYLabTitlePos + 10
			},
			height: '30%',
			offset: _leftYLabOffset,
			margin: 0,
			startOnTick: false,
			plotLines: [{
				value: 50,
				color: 'green',
				dashStyle: 'dash',
				width: 1.2,
			}, {
				value: 100,
				color: 'red',
				dashStyle: 'dash',
				width: 1.2,
			}]
		}, {
			title: {
				text: '佔股利比',
			},
			height: '30%',
			offset: 0,
			startOnTick: false,
			opposite: true
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '股價',
				x: _leftYLabTitlePos
			},
			top: '25%',
			height: '75%',
			offset: _leftYLabOffset,
			margin: 0,
			startOnTick: false,
		}, {
			title: {
				text: '殖利率'
			},
			top: '25%',
			height: '75%',
			offset: 0,
			opposite: true
		}],
		//#endregion

		//#region series~
		series: [{
			name: '⇦盈餘分配率',
			data: _Y_distributionRate,
			color: 'blue',
			//dashStyle: 'Dash',
			lineWidth: 1.5,
			connectNulls: true,
			yAxis: 0,
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '董酬佔股利比',
			data: _Y_dirRewardRate,
			yAxis: 1,
			visible: false,
			color: '#ffd2d2',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '董酬佔淨利比',
			data: _Y_dirNetRate,
			yAxis: 1,
			color: '#ae8f00',
			visible: false,
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '員工紅利佔股利比',
			data: _Y_empRewardRate,
			yAxis: 1,
			color: '#02c874',
			visible: false,
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '⇦收盤價',
			data: _Y_endPrice,
			type: 'candlestick',
			yAxis: 2,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '⇦平均價',
			data: _Y_avgPrice,
			color: '#499BEE',
			connectNulls: true,
			yAxis: 2,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '股票殖利率⇨',
			type: 'area',
			data: _Y_stockDividendRate,
			yAxis: 3,
			color: 'rgba(220,181,255,1)',
			fillColor: 'rgba(220,181,255,0.3)',
			zIndex: -1,
			marker: {
				enabled: true,
				radius: 5
			},
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '現金殖利率⇨',
			type: 'area',
			data: _Y_cashDividendRate,
			yAxis: 3,
			color: 'rgba(255,237,151,1)',
			fillColor: 'rgba(255,237,151,0.2)',
			zIndex: -1,
			marker: {
				enabled: true,
				radius: 5
			},
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}]
		//#endregion
	});
	//#endregion
}
//#endregion

//#region clear array data...
function clearArrayNDestroyChart() {
	// stockDateLabel = [];
	stockPBR = [];
	// stockPBRHi = [];
	stockPBRLo = [];
	stockPER = [];
	// stockPrice = [];
	_dayOHLC = [];
	_D_Vol = [];
	// _D_fitVal = [];
	// _D_fitLow = [];
	// _D_fitHigh = [];
	_D_mainBuy = [];
	_D_mainAgent = [];
	_D_main5Day = [];
	_D_main20Day = [];
	// _D2_range = [];
	_D_k5 = [];
	_D_k10 = [];
	_D_k20 = [];
	_D_k60 = [];
	_D_k120 = [];
	_D_k240 = [];
	_D_K = [];
	_D_D = [];
	// _D_macd = [];
	_D_v5 = [];
	_D_v20 = [];
	_D_flag = [];
	_D_k_start = [];
	_D_sell = [];
	_D_divR = [];
}
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
	_M_yh = [];
	_M_y1 = [];
	_M_y5 = [];
	_M_y10 = [];
	_M_Vol = [];
}
function clearArrayNDestroyChartY() {
	_Y_range = [];
	_Y_range_noQ = [];
	_Y4_range = [];
	_Y5_range = [];
	_Y_shareCap = [];
	_Y_endPrice = [];
	_Y_avgPrice = [];
	_Y_operMargin = [];
	_Y_operProfitMargin = [];
	_Y_lossOutside = [];
	_Y_afterTaxRate = [];
	_Y_ROE = [];
	_Y_ROA = [];
	_Y_afterTaxEPS = [];
	_Y_dirRewardRate = [];
	_Y_dirNetRate = [];
	_Y_empRewardRate = [];
	_Y_cashDividendRate = [];
	_Y_stockDividendRate = [];
	_Y_dividendRate = [];
	_Y_distributionRate = [];
	_Y_cashRate = [];
	_Y_receivableGet = [];
	_Y_liabilityPay = [];
	_Y4_liabilityPay = [];
	_Y_cashFlow = [];
	_Y_netTaxProfit = [];
	_Y2_netTaxProfit = [];
	_Y_bizAct = [];
	_Y_investAct = [];
	_Y_finAct = [];
	_Y_otherAct = [];
	_Y_netCashFlow = [];
	_Y_freeCashFlow = [];
	_Y_endBalance = [];
	_Y_inr = [];
	_Y_OHLC_wQ = [];
}
function clearArrayNDestroyChartQ() {
	_Q_range = [];
	_Q_totalLiabRatio = [];
	_Q_shareholderEqtyRatio = [];
	_Q_debtNetRatio = [];
	_Q_currentRatio = [];
	_Q_fastRatio = [];
	_Q_ContractLiability = [];
}
function clearArrayNDestroyChartW() {
	_W_range = [];
	_W_shareholderGT1000 = [];
	_W_FI_SC_5d = [];
	_W_FI_SC_1m = [];
	_W_FI_SC_3m = [];
	_W_FI_SC_1y = [];
	_W_FI_SC_3y = [];
	_W_TI_SC_5d = [];
	_W_TI_SC_1m = [];
	_W_TI_SC_3m = [];
	_W_TI_SC_1y = [];
	_W_TI_SC_3y = [];
	_W_SI_SC_5d = [];
	_W_SI_SC_1m = [];
	_W_SI_SC_3m = [];
	_W_SI_SC_1y = [];
	_W_SI_SC_3y = [];
	_W_F_Own_ratio = [];
}
//#endregion

//#endregion