//#region var section
var errorElm = document.getElementById('error');
var loadElm = document.getElementById('load');
var dbFileElm = document.getElementById('dbfile');
var stSelElm = document.getElementById('stockSel');
var popDescElm = document.getElementById('popDesc');
var lineElm = document.getElementById('stockLine');
var nameElm = document.getElementById('stockName');
var typeElm = document.getElementById('stockType');
var t1 = document.getElementById('t1');
var t2 = document.getElementById('t2');
var t3 = document.getElementById('t3');

var _chart_D = null;
var _chart_Y = null;
var _chart_Q = null;
var _chart_W = null;
var _chart_M = null;
var _chart_Y2 = null;

var stockDateLabel = [];
var stockPBR = [];
var stockPBRHi = [];
var stockPBRLo = [];
var stockObj = [];
var stockPER = [];
var stockPrice = [];
var _dayOHLC = [];
var stockMObj = [];
var stockQObj = [];
var stockWObj = [];
var _D_Vol = [];
var _D_fitVal = [];
var _D_mainBuy = [];
var _D_mainAgent = [];
var _D_main5Day = [];
var _D_main20Day = [];
var _D2_range = [];
var _D_k5 = [];
var _D_k10 = [];
var _D_k20 = [];
var _D_k60 = [];
var _D_k120 = [];
var _D_k240 = [];
var _D_K = [];
var _D_D = [];
var _D_kd_range = [];
var _D_macd = [];
var _D_v5 = [];
var _D_v20 = [];
var _D_flag = [];


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
	var f = dbFileElm.files[0];
	var r = new FileReader();
	var lstr = "",qr = "";
	//所有清單
	lstr="下拉選取";
	//最佳選清單
	// lstr="優選清單選取"; qr=" and bestChoice=1 ";
	//次優選清單
	// lstr="次優清單選取"; qr=" and secondChoice=1 ";

	if (f != null) { loadElm.innerText = ""; }
	r.onload = function () {
		var Uints = new Uint8Array(r.result);
		var db = new SQL.Database(Uints);
		var row;
		var stmt = db.prepare("SELECT stockNum,stockName,bizType FROM stockInfo Where enable=1 "+ qr +" Order By bizType, otherOrder,stockNum;");
		stSelElm.innerHTML += "<option value=''>("+ lstr +")</option>";
		while(stmt.step()) { 
			row = stmt.getAsObject();
			stSelElm.innerHTML += '<option value=' + row.stockNum + '>' + row.stockNum + ' ' + row.stockName + '(' + (row.bizType == null ? '' : row.bizType) + ')</option>';
		}
		stmt.free();
		t1.focus();
	}
	r.readAsArrayBuffer(f);
}
//#endregion

stSelElm.onkeypress = function(e){
	var keynum;
	keynum = e.which || e.keyCode;
	if(keynum == 27){
		t1.focus();
		return;
	}
	if (((keynum>=48 && keynum <=57) || (keynum>=65 && keynum<=90) || (keynum>=96 && keynum<=105))){
		t1.value = String.fromCharCode(keynum);
		t1.focus();
		return;
	}	
}
t1.onkeypress = function(e){
	var keynum;
	keynum = e.which || e.keyCode;
	if(keynum>=37 && keynum<=40){
		stSelElm.focus();
		return;
	}
	if(keynum == 13){
		var _v = t1.value;
		t1.value="";
		stSelElm.addEventListener('change',function(){});
		stSelElm.value = _v;
		stSelElm.dispatchEvent(new Event('change'));
		return;
	}
	if (!((keynum>=48 && keynum <=57) || (keynum>=65 && keynum<=90) || (keynum>=96 && keynum<=105))){
		return;
	}
}
t1.onfocus = stSelElm.onfocus = function(){
	var f=this;	
	f.style.backgroundColor = 'rgba(255,0,0,0.3)';
	if (f === stSelElm){
		t1.value = "";
	}
}

t1.onblur = stSelElm.onblur = function(){
	var f=this;	
	f.style.backgroundColor = 'rgba(255,255,255,0.4)';
}

//#region stSelElm.onchange
stSelElm.onchange = function () {
	var f = dbFileElm.files[0];
	var r = new FileReader();
	var db,stmt,Uints,newDate, row,newYear,fg,tfg,_sd;
	var v = stSelElm.value;	
	r.onload = function () {
		Uints = new Uint8Array(r.result);
		db = new SQL.Database(Uints);
		_sd ="SELECT date,PBRVal,PBRHigh,PBRLow,PERVal,price,fitVal,Volume,mainBuy,";
		_sd = _sd + "mainAgent,main5Day,main20Day,open,high,low,K5,K10,K20,K60,K120,";
		_sd = _sd + "K240,K,D,V5,V20,";
		_sd = _sd + "case when exPay=0 and exDiv=0 and exStock=0 then '' else case when exPay=1 then '發息' else ('除' || case when exStock=1 then '權' else '' end || case when exDiv=1 then '息' else '' end) end end as ex ";
		_sd = _sd + " FROM StockValue ";
		_sd = _sd + "WHERE stockNum='" + v + "' Order By date;";

		stmt = db.prepare(_sd);
		fg = { x: null, title: "", text: "" };
	
		while(stmt.step()) { 
			row = stmt.getAsObject();
			newYear = row.date;
			newDate = new Date(newYear).getTime();
			stockPBR.push([newDate, row.PBRVal]);
			stockPBRLo.push([newDate, row.PBRLow, row.PBRHigh]);
			stockPER.push([newDate, row.PERVal]);
			_dayOHLC.push([newDate, row.open === null ? row.price : row.open, row.high === null ? row.price : row.high, row.low === null ? row.price : row.low, row.price]);
			_D_fitVal.push([newDate, row.fitVal]);
			_D_Vol.push([newDate, row.Volume]);
			_D_mainBuy.push([newDate, row.mainBuy]);
			_D_mainAgent.push([newDate, row.mainAgent]);
			_D_main5Day.push([newDate, row.main5Day]);
			_D_main20Day.push([newDate, row.main20Day]);
			_D_k5.push([newDate, row.K5]); 
			_D_k10.push([newDate, row.K10]);
			_D_k20.push([newDate, row.K20]);
			_D_k60.push([newDate, row.K60]);
			_D_k120.push([newDate, row.K120]);
			_D_k240.push([newDate, row.K240]);
			_D_K.push([newDate, row.K]);
			_D_D.push([newDate, row.D]);
			_D_kd_range.push([newDate, row.K === null ? null : (row.D === null ? null : Math.min(row.K, row.D)), row.K === null ? null : (row.D === null ? null : Math.max(row.K, row.D))]);
			_D_v5.push([newDate, row.V5]);
			_D_v20.push([newDate, row.V20]);
			if (row.ex === '') {
			} else {
				fg.x = newDate;
				fg.title = row.ex;
				fg.text = row.ex;
				tfg = Object.assign({}, fg);;
				_D_flag.push(tfg);
			}					
		}	
		// stmt.freemem();
		stmt.reset();
		mapChart();
		clearArrayNDestroyChart();		
	// }

	// r2.onload = function () {
	// 	var Uints = new Uint8Array(r.result);
	// 	var newYear = '',newDate;
	// 	var db = new SQL.Database(Uints);
		_sd ="SELECT range,startPrice,endPrice,hiPrice,lowPrice,inPerMMoM,inPerMYoY,inAllMYoY,SVshareholder,Fshareholder,SVpledge FROM StockMonth WHERE stockNum='" + v + "' Order By range;";

		stmt = db.prepare(_sd);
		while(stmt.step()) { 
			row = stmt.getAsObject();
			switch (row.range.substring(5)) {
				case '01':
				case '03':
				case '05':
				case '07':
				case '08':
				case '10':
				case '12':
					newYear = row.range + '/31';
					break;
				case '04':
				case '06':
				case '09':
				case '11':
					newYear = row.range + '/30';
					break;
				case '02':
					newYear = row.range + '/28';
					break;
			}
			newDate = new Date(newYear).getTime();
			_M_endPrice.push([newDate, row.startPrice, row.hiPrice, row.lowPrice, row.endPrice]);
			_M_inPerMYoY.push([newDate, row.inPerMYoY]);
			_M_inAllMYoY.push([newDate, row.inAllMYoY]);
			_M_SVshareholder.push([newDate, row.SVshareholder]);
			_M_Fshareholder.push([newDate,row.Fshareholder]);
			_M_SVpledge.push([newDate, row.SVpledge]);			
		}	
		// stmt.freemem();
		stmt.reset();
		mapChartM();
		clearArrayNDestroyChartM();
	// }

	// r3.onload = function () {
	// 	var Uints = new Uint8Array(r.result);
		// var newYear = '',newDate, fg = { x: null, title: "", text: "" }, tfg;
		// var db = new SQL.Database(Uints);
		var sq = "SELECT range,shareCap,endPrice,avgPrice,operMargin,operProfitMargin,";
		sq = sq + "lossOutside,afterTaxRate,ROE,ROA,afterTaxEPS,dirRewardRate,dirNetRate,";
		sq = sq + "empRewardRate,cashDividendRate,stockDividendRate,dividendRate,";
		sq = sq + "distributionRate,cashRate,receivableGet,liabilityPay,cashFlow,";
		sq = sq + "netTaxProfit,bizAct,investAct,finAct,otherAct,netCashFlow,freeCashFlow,";
		sq = sq + "endBalance,inr,openPrice,highPrice,lowPrice FROM vStockYear WHERE stockNum='" + v + "' ";
		sq = sq + "Order By case when range like '%Q%' then range else range || 'Z' end;";

		stmt = db.prepare(sq);
		while(stmt.step()) { 
			row = stmt.getAsObject();
			if (row.range.indexOf("Q") < 0) {
				newYear = row.range + '-12';
			} else {
				newYear = row.range.replace('Q1', '-03').replace('Q2', '-06').replace('Q3', '-09')
				fg.x = new Date(newYear).getTime();
				fg.title = row.range.substring(4);
				fg.text = row.range;
				tfg = Object.assign({}, fg);;
				_Y_range.push(tfg);
			}
			newDate = new Date(newYear).getTime();
			_Y_shareCap.push([newDate, row.shareCap === '' ? null : row.shareCap]);
			_Y_avgPrice.push([newDate, row.avgPrice]);
			_Y_endPrice.push([newDate, row.openPrice, row.highPrice, row.lowPrice, row.endPrice]);
			_Y_afterTaxEPS.push([newDate, row.afterTaxEPS === '' ? null : row.afterTaxEPS]);
			_Y2_netTaxProfit.push([newDate, row.netTaxProfit === '' ? null : row.netTaxProfit]);
			_Y_operMargin.push([newDate, row.operMargin === '' ? null : row.operMargin]);
			_Y_operProfitMargin.push([newDate, row.operProfitMargin === '' ? null : row.operProfitMargin]);
			_Y_lossOutside.push([newDate, row.lossOutside === '' ? null : row.lossOutside]);
			_Y_afterTaxRate.push([newDate, row.afterTaxRate === '' ? null : row.afterTaxRate]);
			_Y_ROE.push([newDate, row.ROE === '' ? null : row.ROE]);
			_Y_ROA.push([newDate, row.ROA === '' ? null : row.ROA]);
			_Y_liabilityPay.push([newDate, row.liabilityPay === '' ? null : row.liabilityPay]);
			_Y_cashRate.push([newDate, row.cashRate === '' ? null : row.cashRate]);
			_Y_receivableGet.push([newDate, row.receivableGet === '' ? null : row.receivableGet]);
			_Y_cashDividendRate.push([newDate, row.cashDividendRate === '' ? null : row.cashDividendRate]);
			_Y_stockDividendRate.push([newDate, row.stockDividendRate === '' ? null : row.stockDividendRate]);
			_Y_dividendRate.push([newDate, row.dividendRate === '' ? null : row.dividendRate]);
			_Y_distributionRate.push([newDate, row.distributionRate === '' ? null : row.distributionRate]);

			_Y_dirRewardRate.push([newDate, row.dirRewardRate === '' ? null : row.dirRewardRate]);
			_Y_dirNetRate.push([newDate, row.dirNetRate === '' ? null : row.dirNetRate]);
			_Y_empRewardRate.push([newDate, row.empRewardRate === '' ? null : row.empRewardRate]);
			_Y_cashFlow.push([newDate, row.cashFlow === '' ? null : row.cashFlow]);
			_Y_netTaxProfit.push([newDate, row.netTaxProfit === '' ? null : row.netTaxProfit]);
			_Y_bizAct.push([newDate, row.bizAct === '' ? null : row.bizAct]);
			_Y_investAct.push([newDate, row.investAct === '' ? null : row.investAct]);
			_Y_finAct.push([newDate, row.finAct === '' ? null : row.finAct]);
			_Y_otherAct.push([newDate, row.otherAct === '' ? null : row.otherAct]);
			_Y_netCashFlow.push([newDate, row.netCashFlow === '' ? null : row.netCashFlow]);
			_Y_freeCashFlow.push([newDate, row.freeCashFlow === '' ? null : row.freeCashFlow]);
			_Y_endBalance.push([newDate, row.endBalance === '' ? null : row.endBalance]);
			_Y_inr.push([newDate, row.inr === '' ? null : row.inr]);
		}	
		// stmt.freemem();
		stmt.reset();
		mapChartY();
		mapChartY2();
		clearArrayNDestroyChartY();
	// }

	// r4.onload = function () {
	// 	var Uints = new Uint8Array(r.result);
	// 	var newYear = '',newDate;
	// 	var db = new SQL.Database(Uints);
		_sd ="SELECT stockNum,bizDesc FROM StockInfo WHERE stockNum='" + v + "';";

		stmt = db.prepare(_sd);
		while(stmt.step()) { 
			row = stmt.getAsObject();
			popDescElm.innerHTML = row.bizDesc;
		}	
		// stmt.freemem();
		stmt.reset();
	// }

	// r5.onload = function () {
	// 	var Uints = new Uint8Array(r.result);
	// 	var newYear = '',newDate;
	// 	var db = new SQL.Database(Uints);
		_sd ="SELECT range,fastRatio,currentRatio,debtNetRatio,shareholderEqtyRatio,totalLiabRatio FROM vStockQuarter WHERE stockNum='" + v + "';";

		stmt = db.prepare(_sd);
		while(stmt.step()) { 
			row = stmt.getAsObject();
			newYear = row.range.replace('Q1', '-03').replace('Q2', '-06').replace('Q3', '-09').replace('Q4', '-12');
			newDate = new Date(newYear).getTime();
			_Q_fastRatio.push([newDate, row.fastRatio]);
			_Q_currentRatio.push([newDate, row.currentRatio]);
			_Q_debtNetRatio.push([newDate, row.debtNetRatio]);
			_Q_shareholderEqtyRatio.push([newDate, row.shareholderEqtyRatio]);
			_Q_totalLiabRatio.push([newDate, row.totalLiabRatio]);
		}	
		// stmt.freemem();
		stmt.reset();
		mapChartQ();
		clearArrayNDestroyChartQ();
	// }

	// r6.onload = function () {
	// 	var Uints = new Uint8Array(r.result);
		var d1, ds, oneDay = 1000 * 60 * 60 * 24;
		// var db = new SQL.Database(Uints);
		_sd ="SELECT range,shareholderGT1000,FI_SC_5d,FI_SC_1m,FI_SC_3m,FI_SC_1y,FI_SC_3y,TI_SC_5d,TI_SC_1m,TI_SC_3m,TI_SC_1y,TI_SC_3y,SI_SC_5d,SI_SC_1m,SI_SC_3m,SI_SC_1y,SI_SC_3y,F_Own_ratio FROM StockWeek WHERE stockNum='" + v + "';";

		stmt = db.prepare(_sd);
		while(stmt.step()) { 
			row = stmt.getAsObject();
			d1 = new Date('20' + row.range.substr(row.range.indexOf('W') - 2, 2), 0, 0);
			ds = row.range.substr(row.range.indexOf('W') + 1, 2) * 7;
			newYear = ds * oneDay + d1.getTime();

			_W_shareholderGT1000.push([newYear, row.shareholderGT1000]);
			_W_FI_SC_5d.push([newYear, row.FI_SC_5d]);
			_W_FI_SC_1m.push([newYear, row.FI_SC_1m]);
			_W_FI_SC_3m.push([newYear, row.FI_SC_3m]);
			_W_FI_SC_1y.push([newYear, row.FI_SC_1y]);
			_W_FI_SC_3y.push([newYear, row.FI_SC_3y]);
			_W_TI_SC_5d.push([newYear, row.TI_SC_5d]);
			_W_TI_SC_1m.push([newYear, row.TI_SC_1m]);
			_W_TI_SC_3m.push([newYear, row.TI_SC_3m]);
			_W_TI_SC_1y.push([newYear, row.TI_SC_1y]);
			_W_TI_SC_3y.push([newYear, row.TI_SC_3y]);
			_W_SI_SC_5d.push([newYear, row.SI_SC_5d]);
			_W_SI_SC_1m.push([newYear, row.SI_SC_1m]);
			_W_SI_SC_3m.push([newYear, row.SI_SC_3m]);
			_W_SI_SC_1y.push([newYear, row.SI_SC_1y]);
			_W_SI_SC_3y.push([newYear, row.SI_SC_3y]);
			_W_F_Own_ratio.push([newYear, row.F_Own_ratio]);			
		}	
		stmt.freemem();
		stmt.reset();
		mapChartW();
		clearArrayNDestroyChartW();
	}

	r.readAsArrayBuffer(f);

	var op = stSelElm.options[stSelElm.selectedIndex].text;
	nameElm.innerText = op.substring(0, op.indexOf("("));
	typeElm.innerText = op.substring(op.indexOf("(") + 1, op.indexOf(")"));
	showStockFont(true);

}

Highcharts.setOptions({
	lang: {
		thousandsSep: ",",
		weekdays: ['(日)', '(一)', '(二)', '(三)','(四)', '(五)', '(六)'],
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
		rangeSelector: {
			selected: 2,
			verticalAlign: 'bottom',
			margin: 0,
			inputEnabled: false,
			buttons: [{
				type: 'month',
				count: 1,
				text: '1m'
			}, {
				type: 'month',
				count: 3,
				text: '3m',
			}, {
				type: 'month',
				count: 6,
				text: '6m'
			}, {
				type: 'ytd',
				text: 'YTD'
			}, {
				type: 'year',
				count: 1,
				text: '1y'
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
						lineColor: 'blue'
					},
				},
				signalLine: {
					styles: {
						lineColor: 'red'
					}
				}
			},
			series: {
				animation: false,
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
			shared:true,
			outside: true,
			// xDateFormat: "\'%y/%m/%d, %a",
			positioner: function (boxWidth, boxHeight, point) {
                var chart = this.chart;
                var plotWidth = chart.plotWidth;
				var pointX = point.plotX;
				var activePoint = point;
				var previousAlign = chart.align;
                if ((pointX - boxWidth - 70) < 0) {
                    x = plotWidth - boxWidth + 20;
					chart.align = "left";
                }
                else {
                    x = 30;  
                    chart.align = "right";
                }
				if (previousAlign != null && chart.align != previousAlign) {
					chart.tooltip.refresh(activePoint);
				}				
                return { x: x, y: 5 };
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
			title: {
				text: '主力集中度'
			},
			top: '58%',
			height: '13%',
			offset: 0,
			lineWidth: 1,
			startOnTick: false,
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
			name: '最適股價⇨',
			data: _D_fitVal,
			color: '#ff9797',
			dashStyle: 'ShortDashDot',
			visible: false,
			yAxis: 1,
			lineWidth: 0.8,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			type: 'column',
			name: '⇦成交量',
			data: _D_Vol,
			color: 'rgba(43, 138, 254, 0.4)',
			yAxis: 0,
			tooltip: {
				useHTML: true,
				pointFormatter: function () {
					var s = '';
					if (this.y > 100000000) {
						s = '<span style="color:{point.color}">\u25CF</span> ' + this.series.name + ': <b>' + this.y.toLocaleString('zh-Hant','currency') + '元</b><br/>'
					} else {
						s = '<span style="color:{point.color}">\u25CF</span> ' + this.series.name + ': <b>' + this.y.toLocaleString('zh-Hant','currency') + '張</b><br/>'
					}
					return s;
				}
			}
		}, {
			name: '⇦5日均量',
			data: _D_v5,
			color: '#f8600d',
			lineWidth: 1,
			yAxis: 0,
			tooltip: {
				valueSuffix: ''
			},
			credits: {
				enabled: false
			}
		}, {
			name: '⇦20日均量',
			data: _D_v20,
			color: '#07830f',
			dashStyle: 'LongDash',
			lineWidth: 1,
			yAxis: 0,
			tooltip: {
				valueSuffix: ''
			},
			credits: {
				enabled: false
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
			onSeries: '_ex_flag',
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
			name: '主力5日集中度⇨',
			data: _D_main5Day,
			type: 'area',
			color: '#ff9d6f',
			yAxis: 4,
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
			yAxis: 4,
			tooltip: {
				valueSuffix: '%'
			}
		}, {
			name: '⇦K',
			data: _D_K,
			id: 'K_line',
			color: '#ff0000',
			yAxis: 5,
			lineWidth: 0.8,
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '⇦D',
			data: _D_D,
			// type: 'area',
			color: '#0000e3',
			linkedTo: 'K_line',
			showInLegend: true,
			yAxis: 5,
			lineWidth: 0.8,
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '-',
			data: _D_kd_range,
			type: 'areasplinerange',
			linkedTo: 'K_line',
			yAxis: 5,
			showInLegend: false,
			zIndex: -9,
			zoneAxis: 'y',
			zones: [{
				value: 20,
				color: '#0000ff'
			}, {
				value: 80,
				fillColor: '#ffffff'
			}, {
				value: 100,
				color: '#ff0000'
			}],
			credits: {
				enabled: false
			}
		}, {
			name: '買賣券商差⇨',
			data: _D_mainAgent,
			type: 'area',
			color: '#a6a6d2',
			yAxis: 6,
			tooltip: {
				valueSuffix: '家'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '主力買超⇨',
			data: _D_mainBuy,
			type: 'area',
			color: '#66b3ff',
			yAxis: 8,
			zIndex: -1,
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
	if (_dayOHLC.length>(26+9)){
		//must has more data in case of not to trigger errors
		_chart_D.addSeries(
		{
			name: '⇦MACD',
			type: 'macd',
			yAxis: 7,
			linkedTo: '_price',
			connectNulls: true,
			credits: {
				enabled: false
			}
		});
	}
};

function mapChartW() {
	// if (_chart_W !== null) {
	// 	_chart_W.destroy();
	// }
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
			animation: false
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
			shared:true,
			outside: true,
			// crosshairs: [true, true],
			xDateFormat: "\'%y/%m/%d",
			positioner: function (boxWidth, boxHeight, point) {
                var chart = this.chart;
                var plotWidth = chart.plotWidth;
				var pointX = point.plotX;
				var activePoint = point;
				var previousAlign = chart.align;
                if ((pointX - boxWidth - 70) < 0) {
                    x = plotWidth - boxWidth + 20;
					chart.align = "left";
                }
                else {
                    x = 30;  
                    chart.align = "right";
                }
				if (previousAlign != null && chart.align != previousAlign) {
					chart.tooltip.refresh(activePoint);
				}				
                return { x: x + 620, y: 5 };
            }			
		},
		//#endregion
		xAxis: {
			crosshair: {
				width: 1,
				// color: 'red'
			},
			type: 'datetime',
			tickInterval:3 * 7 * 24 * 36e5, // 3 weeks
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
		}, {
			title: {
				text: '外資佔股本',
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
		}, {
			title: {
				text: '投信佔股本',
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
			type: 'area',
			color: '#ff9797',
			yAxis: 1,
			zIndex: 1,
			tooltip: {
				valueSuffix: '%',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '外資1月⇨',
			data: _W_FI_SC_1m,
			type: 'area',
			yAxis: 1,
			color: '#97cbff',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '外資3月⇨',
			data: _W_FI_SC_3m,
			yAxis: 1,
			color: '#796400',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '外資1年⇨',
			data: _W_FI_SC_1y,
			dashStyle: 'ShortDot',
			yAxis: 1,
			color: '#00db00',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '外資3年⇨',
			data: _W_FI_SC_3y,
			dashStyle: 'DashDot',
			yAxis: 1,
			visible: false,
			color: '#3d7878',
			tooltip: {
				valueSuffix: '%'
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
			type: 'area',
			color: '#ff9797',
			yAxis: 3,
			zIndex: 1,
			tooltip: {
				valueSuffix: '%',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '投信1月⇨',
			data: _W_SI_SC_1m,
			type: 'area',
			yAxis: 3,
			color: '#97cbff',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '投信3月⇨',
			data: _W_SI_SC_3m,
			yAxis: 3,
			color: '#796400',
			tooltip: {
				valueSuffix: '%'
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
			tooltip: {
				valueSuffix: '%'
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
			visible: false,
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
};

function mapChartM() {
	// if (_chart_M !== null) {
	// 	_chart_M.destroy();
	// }	
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
			animation: false
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
			series: {
				animation: false
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
			shared:true,
			outside: true,
			// xDateFormat: "\'%y/%m",
            positioner: function (boxWidth, boxHeight, point) {
                var chart = this.chart;
                var plotWidth = chart.plotWidth;
                var pointX = point.plotX;
				var pointY = point.plotY;
				var activePoint = point;
				var previousAlign = chart.align;
                if ((pointX - boxWidth - 70) < 0) {
                    x = plotWidth - boxWidth + 20;
					chart.align = "left";
                }
                else {
                    x = 30;  
                    chart.align = "right";
                }
				if (previousAlign != null && chart.align != previousAlign) {
					chart.tooltip.refresh(activePoint);
				}				
                return { x: x + 620, y: 385 };
            } 			
		},
		//#endregion
		xAxis: {
			crosshair: {
				width: 1,
				color: 'red'
			},
			type: 'datetime',
			tickInterval:30 * 24 * 36e5, // 30 days
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
			height: '55%',
			startOnTick: false,
		}, {
			title: {
				text: '股價',
			},
			offset: 0,
			height: '55%',
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
				text: '比率',
				x: _leftYLabTitlePos + 10
			},
			offset: _leftYLabOffset,
			margin: 0,
			top: '55%',
			height: '45%',
			startOnTick: false,
		}, {
			title: {
				text: '增率',
			},
			offset: 0,
			top: '55%',
			height: '45%',
			startOnTick: false,
			opposite: true
		}],
		//#endregion

		//#region series~
		series: [{
			name: '⇦外資持股比',
			data: _M_Fshareholder,
			// type: 'column',
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
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '單月年增率⇨',
			data: _M_inPerMYoY,
			type: 'area',
			color: '#ff95ca',
			yAxis: 3,
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
			color: '#ffe66f',
			yAxis: 3,
			tooltip: {
				valueSuffix: '%',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '⇦董監持股比',
			data: _M_SVshareholder,
			yAxis: 2,
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
			yAxis: 2,
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
};

function mapChartQ() {
	// if (_chart_Q !== null) {
	// 	_chart_Q.destroy();
	// }
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
			animation: false
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
				animation: false
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
			shared:true,
			outside: true,
			crosshairs: [true, false],
			xDateFormat: "\'%y Q%Q",
			positioner: function (boxWidth, boxHeight, point) {
                var chart = this.chart;
                var plotWidth = chart.plotWidth;
				var pointX = point.plotX;
				var activePoint = point;
				var previousAlign = chart.align;
                if ((pointX - boxWidth - 70) < 0) {
                    x = plotWidth - boxWidth + 20;
					chart.align = "left";
                }
                else {
                    x = 30;  
                    chart.align = "right";
                }
				if (previousAlign != null && chart.align != previousAlign) {
					chart.tooltip.refresh(activePoint);
				}				
                return { x: x, y: 1090 };
            }			
		},
		//#endregion
		xAxis: {
			type: 'datetime',
			labels: {
				format: '{value:\'%y Q%Q}',
				x:40
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
		}],
		//#endregion

		//#region series~
		series: [{
			name: '速動比',
			data: _Q_fastRatio,
			// type: 'area',
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
			// type: 'area',
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
			color: '#97cbff',
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
		}]
		//#endregion
	});
	//#endregion
};

function mapChartY() {
	// if (_chart_Y !== null) {
	// 	_chart_Y.destroy();
	// }		
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
			animation: false
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
			y: 100,
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
			shared:true,
			outside: true,
			xDateFormat: "%Y",
			positioner: function (boxWidth, boxHeight, point) {
                var chart = this.chart;
                var plotWidth = chart.plotWidth;
				var pointX = point.plotX;
				var activePoint = point;
				var previousAlign = chart.align;
                if ((pointX - boxWidth - 70) < 0) {
                    x = plotWidth - boxWidth + 20;
					chart.align = "left";
                }
                else {
                    x = 30;  
                    chart.align = "right";
                }
				if (previousAlign != null && chart.align != previousAlign) {
					chart.tooltip.refresh(activePoint);
				}				
                return { x: x, y: 590 };
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
			title: {
				text: '增率',
			},
			offset: 0,
			height: '45%',
			startOnTick: false,
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '股價',
				x: _leftYLabTitlePos
			},
			top: '45%',
			height: '35%',
			offset: _leftYLabOffset,
			margin: 0,
			startOnTick: false,
		}, {
			title: {
				text: '殖利率'
			},
			top: '45%',
			height: '35%',
			offset: 0,
			opposite: true
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: 'EPS',
				x: _leftYLabTitlePos
			},
			top: '80%',
			height: '20%',
			offset: _leftYLabOffset,
			margin: 0,
			startOnTick: false,
		}, {
			title: {
				text: '股本'
			},
			top: '80%',
			height: '20%',
			offset: 0,
			startOnTick: false,
			opposite: true
		}],
		//#endregion

		//#region series~
		series: [{
			name: '營業毛利',
			data: _Y_operMargin,
			color: '#007500',
			connectNulls: true,
			yAxis: 0,
			tooltip: {
				valueSuffix: '%',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '營業利益',
			data: _Y_operProfitMargin,
			color: '#2E37B9',
			connectNulls: true,
			dashStyle: 'DashDot',
			yAxis: 0,
			tooltip: {
				valueSuffix: '%',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '業外損益',
			data: _Y_lossOutside,
			type: 'column',
			zIndex: -1,
			yAxis: 0,
			color: '#ff9797',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '稅後淨利',
			data: _Y_afterTaxRate,
			type: 'column',
			zIndex: -1,
			yAxis: 0,
			color: '#ceffce',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '股東權益ROE',
			data: _Y_ROE,
			// dashStyle: 'longdashdot',
			yAxis: 0,
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
			name: '資產報酬ROA',
			data: _Y_ROA,
			dashStyle: 'shortdot',
			yAxis: 0,
			color: '#272727',
			connectNulls: true,
			tooltip: {
				valueSuffix: '%'
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
			yAxis: 0,
			showInLegend: false,
			onSeries: '_oper_data',
			shape: 'circlepin'
		}, {
			name: '⇦收盤價',
			data: _Y_endPrice,
			type: 'candlestick',
			yAxis: 1,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '⇦平均價',
			data: _Y_avgPrice,
			// type: 'candlestick',
			color: '#499BEE',
			connectNulls: true,
			yAxis: 1,
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
			yAxis: 2,
			color: '#dcb5ff',
			zIndex: -1,
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
			yAxis: 2,
			color: '#ffed97',
			zIndex: -1,
			tooltip: {
				valueSuffix: '%'
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
			yAxis: 3,
			showInLegend: false,
			onSeries: '_Y_div',
			shape: 'circlepin'
		}, {
			name: '⇦稅後EPS',
			data: _Y_afterTaxEPS,
			id: '_Y_div',
			color: '#4a4aff',
			connectNulls: true,
			yAxis: 3,
			tooltip: {
				valueSuffix: '元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '股本⇨',
			type: 'column',
			data: _Y_shareCap,
			yAxis: 4,
			color: '#ff8f59',
			zIndex: -1,
			tooltip: {
				valueSuffix: '億元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '稅後淨利⇨',
			type: 'column',
			data: _Y2_netTaxProfit,
			id: '_tax_net',
			yAxis: 4,
			color: '#00db00',
			zIndex: -1,
			tooltip: {
				valueSuffix: '億元'
			},
			credits: {
				enabled: false
			}
		}]
		//#endregion
	});
	//#endregion
};

function mapChartY2() {
	// if (_chart_Y2 !== null) {
	// 	_chart_Y2.destroy();
	// }
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
			animation: false
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
			y: 100,
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
			shared:true,
			outside: true,
			useHTML: true,
			xDateFormat: "%Y",
			positioner: function (boxWidth, boxHeight, point) {
                var chart = this.chart;
                var plotWidth = chart.plotWidth;
				var pointX = point.plotX;
				var activePoint = point;
				var previousAlign = chart.align;
                if ((pointX - boxWidth - 70) < 0) {
                    x = plotWidth - boxWidth + 20;
					chart.align = "left";
                }
                else {
                    x = 30;  
                    chart.align = "right";
                }
				if (previousAlign != null && chart.align != previousAlign) {
					chart.tooltip.refresh(activePoint);
				}				
                return { x: x + 620, y: 750 };
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
				text: '投淨比',
				x: _leftYLabTitlePos
			},
			height: '45%',
			offset: _leftYLabOffset,
			margin: 0,
			startOnTick: false,
		}, {
			title: {
				text: '現金流',
			},
			offset: 0,
			height: '45%',
			startOnTick: false,
			opposite: true
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '盈餘分配率',
				x: _leftYLabTitlePos + 10
			},
			top: '45%',
			height: '30%',
			offset: _leftYLabOffset,
			margin: 0,
			startOnTick: false,
		}, {
			title: {
				text: '佔總資產比'
			},
			top: '45%',
			height: '30%',
			offset: 0,
			startOnTick: false,
			opposite: true
		}, {
			labels: {
				align: 'left',
			},
			title: {
				text: '佔股利比',
				x: _leftYLabTitlePos + 10
			},
			top: '75%',
			height: '25%',
			offset: _leftYLabOffset,
			startOnTick: false,
		}, {
			title: {
				text: '現金流量',
			},
			top: '75%',
			height: '25%',
			offset: 0,
			startOnTick: false,
			opposite: true
		}],
		//#endregion

		//#region series~
		series: [{
			name: '⇦5年投資淨利比',
			data: _Y_inr,
			type: 'area',
			zIndex: -1,
			color: '#B5B5B5',
			yAxis: 0,
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
			yAxis: 1,
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
			yAxis: 1,
			tooltip: {
				valueSuffix: '億元',
			},
			credits: {
				enabled: false
			}
		}, {
			name: '融資活動⇨',
			data: _Y_finAct,
			// type: 'column',
			yAxis: 1,
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
			yAxis: 1,
			color: '#ff8040',
			tooltip: {
				valueSuffix: '億元'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '自由金流⇨',
			data: _Y_freeCashFlow,
			// type: 'column',
			yAxis: 1,
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
			yAxis: 1,
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
			color: '#000000',
			fillColor: 'rgba(220,0,0,0.2)',
			data: _Y_range,
			yAxis: 1,
			showInLegend: false,
			onSeries: '_biz_data',
			shape: 'circlepin'
		}, {
			name: '⇦盈餘分配率',
			data: _Y_distributionRate,
			color: '#499BEE',
			connectNulls: true,
			yAxis: 2,
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
			yAxis: 3,
			zIndex: -1,
			// id: '_liab_data',
			color: '#8AF0C0',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '現金佔資產⇨',
			data: _Y_cashRate,
			yAxis: 3,
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
			yAxis: 3,
			color: '#3D406E',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '董酬佔股利比',
			data: _Y_dirRewardRate,
			yAxis: 4,
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
			yAxis: 4,
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
			yAxis: 4,
			color: '#02c874',
			visible: false,
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			name: '現金流量',
			data: _Y_cashFlow,
			// type: 'candlestick',
			connectNulls: true,
			yAxis: 5,
			id: '_cash_data',
			tooltip: {
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			}
		}, {
			type: 'flags',
			name: '季',
			color: '#000000',
			fillColor: 'rgba(220,0,0,0.2)',
			data: _Y_range,
			yAxis: 5,
			onSeries: '_cash_data',
			showInLegend: false,
			shape: 'circlepin'
		}]
		//#endregion
	});
	//#endregion
};



function clearArrayNDestroyChart() {
	stockDateLabel = [];
	stockPBR = [];
	stockPBRHi = [];
	stockPBRLo = [];
	stockPER = [];
	stockPrice = [];
	_dayOHLC = [];
	_D_Vol = [];
	_D_fitVal = [];
	_D_mainBuy = [];
	_D_mainAgent = [];
	_D_main5Day = [];
	_D_main20Day = [];
	_D2_range = [];
	_D_k5 = [];
	_D_k10 = [];
	_D_k20 = [];
	_D_k60 = [];
	_D_k120 = [];
	_D_k240 = [];
	_D_K = [];
	_D_D = [];
	_D_kd_range = [];
	_D_macd = [];
	_D_v5 = [];
	_D_v20 = [];
	_D_flag = [];
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
}
function clearArrayNDestroyChartQ() {
	_Q_range = [];
	_Q_totalLiabRatio = [];
	_Q_shareholderEqtyRatio = [];
	_Q_debtNetRatio = [];
	_Q_currentRatio = [];
	_Q_fastRatio = [];
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