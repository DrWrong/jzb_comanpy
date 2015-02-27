(function() {
	/*
	 *Author Liyao
	 *Date 2009-4-7
	 *Function Search class extends Base class
	 */
	
	//check the class name , it will be replaced when existed
	if ( window.Search ) {
		alert( 'variable Search has been used,it will be replaced with _Search!' );
		window._Search = window.Search;
	}

	//constructor
	window.Search = function( param ) {
		param = param instanceof Object ? param : {};

		Base.apply( this , [param] );

		for ( var prop in param ) {
			this[prop] = param[prop];
		}
	}.$extends( Base );

	//share property & method
	var pt = Search.prototype;

	pt.searchForm = null;

	pt.initKwdTypeSel = function() {
		//modify by robin 2009-11-10
		if (this.searchForm.ismapresult){
		}else{
			var ul = this._( 'kwdTypeSel' );
			for ( var i = 0 ; i < ul.childNodes.length  ; i++ ) {
				this.attEvt( ul.childNodes[i] , 'click' , this.getChgKwdTypeFunc( this , ul.childNodes[i].getAttribute( 'valKey' ) ) );
			}
			//this.chgKwdType( this.searchForm.keywordtype && this.searchForm.keywordtype ? this.searchForm.keywordtype.value : '2' );
		}
	}

	pt.getChgKwdTypeFunc = function( thisObj , valKey ) {
		return function() {
			thisObj.chgKwdType( valKey );
		}
	}

	pt.chgKwdType = function( valKey ) {
		var e  = 'e' == this.cfg.lang ? 'e' : '';
		if ( valKey < '0' || valKey > '2' ) {
			valKey = '2';
		}
		var ul = this._( 'kwdTypeSel' );
		var k = 2 , n = 1;
		for ( var i = 0 ; i < ul.childNodes.length  ; i++ ) {
			var iValKey = ul.childNodes[i].getAttribute( 'valKey' );
			if ( iValKey == valKey ) {
				n = 2;
				k = i;
			}
			else {
				n = i < k ? 1 : 3;
			}
			ul.childNodes[i].className = e + 'kt_bg' + n;
		}
		this.searchForm.keywordtype.value = valKey;
	}
	pt.initKwdInputEvt = function() {
		this.searchForm.keyword.setAttribute('id','kwdselectid');
		var zzSearchObj = this;
		this.bindEvent( this.searchForm.keyword , 'focus' , function(){ zzSearchObj.delQsrgjz(); } );
		this.bindEvent( this.searchForm.keyword , 'click' , function(){ zzSearchObj.delQsrgjz();
		zzSearchObj.crertiframe(); 
			} );
		
	}

	pt.delQsrgjz = function() {
		var kwd = this.searchForm.keyword;
		if ( this.cfg.langs.qsrgjz == kwd.value ) {
			kwd.value = '';
			kwd.style.color = '#000000';
		}
		
	}

 pt.crertiframe = function()
 {
	 	if (!document.getElementById("kwdiframeid")){
		  //����iframe����
			window.ajaxIframe = document.createElement( 'iframe' );
			ajaxIframe.setAttribute('frameBorder', 0); 
			ajaxIframe.setAttribute('scrolling', 'no'); 
	    ajaxIframe.setAttribute('id', 'kwdiframeid'); 
	    ajaxIframe.setAttribute('autocomplete', 'off'); 
			
		  ajaxIframe.style.zIndex = '999';
			ajaxIframe.style.position = 'absolute';
			
	    ajaxIframe.style.left = $('#kwdselectid').parent().offset().left + "px";
			
			ajaxIframe.style.top = ($('#kwdselectid').parent().offset().top+34) + "px";
			ajaxIframe.style.width ="420px";
			ajaxIframe.style.height ="278px";
			ajaxIframe.style.border ="0px";
			
			ajaxIframe.style.clear="both";
			ajaxIframe.style.display = 'none';
		}	
		
		if(2 == this.cfg.stype)
		{
			
			if ( $("#kwdselectid").val() == "" )
			{
			    ajaxIframe.style.display = 'block';
			}else{
				  ajaxIframe.style.display = 'none';
			}
			var newkwdid = document.getElementById("kwdiframeid");
			ajaxIframe.onmouseout=function(){ ajaxIframe.style.display = 'none';}
			
			ajaxIframe.onmouseover=function(){clearTimeout(timer);}
			
			document.getElementById("kwdselectid").onmouseout=function(){ pt.Mout(ajaxIframe);}
			
			
			document.getElementById("kwdselectid").onkeyup =function()
			{
			   if($("#kwdselectid").val()!= "")
				{
					
					ajaxIframe.style.display = 'none';
					

				}else{
					ajaxIframe.style.display = 'block';
				}			
	    }
	    
 
			ajaxIframe.src = this.cfg.domain.my+ '/in/KwdSearchContent.html';
			document.body.appendChild( ajaxIframe );
			
		}
		
 }
 
  var timer;
  
	pt.Mout = function(o){
		timer=setTimeout(function(){o.style.display="none";},300)
		
	}
	
	
	pt.initSearchInResult = function() {//�ڽ��������
		var zzSearchObj = this;		
		this.bindEvent( this._( 'btnSearchInResult' ) , 'click' , function(){ zzSearchObj.searchInResult(); } );
		this._( 'btnSearchInResult' ).style.cursor = 'pointer';
	}

	pt.searchInResult = function() {
		this.delQsrgjz();
		this.pageForm.fromType.value = 2;
		this.pageForm.keyword.value += ' ' + this.searchForm.keyword.value;
		this.pageFormSub( {} , true );
	}

	pt.pageFormSub = function( fieldValue , isReSearch ) {
		for ( var field in fieldValue ) {
			if ( this.pageForm[field] ) {
				this.pageForm[field].value = fieldValue[field];
			}
		}
		if ( isReSearch ) {
			this.pageForm.curr_page.value = 1;
			this.pageForm.jobid_count.value = 0;
			this.pageForm.jobid_list.value = '';
			this.pageForm.statData.value = '';
			this.pageForm.selectedJobids.value = '';
		}
		else {//collect selectedJobids
			//this.pageForm.selectedJobids.value = this.getSelectedJobids( this.pageForm );
			this.pageForm.selectedJobids.value = '';//��ʱȡ����ҳ��ѡjobid�ļ�¼
		}
		if ( this.pageForm.keyword.value.getLen() > 200 ) {
			this.pageForm.keyword.value = this.pageForm.keyword.value.subStringPro( 200 );
		}
		this.formSub( this.pageForm );
	}

	pt.getSelectedJobids = function( frm ) {
		var jobids = [];
		if ( frm.selectedJobids ) {
			jobids = '' == frm.selectedJobids.value ? [] : frm.selectedJobids.value.split( ',' );
			var chx;
			for ( var i = 0 ; i < jobids.length ; i++ ) {
				if ( ( chx = this._( 'selectJobid' + jobids[i] ) ) && !chx.checked ) {//������
					jobids.splice( i-- , 1 );
				}
			}
		}
		var chxs = this._( 'resultList' ).getElementsByTagName( 'input' );
		for ( var i = 0 ; i < chxs.length ; i++ ) {
			if ( /^selectJobid/.test( chxs[i].name ) && chxs[i].checked ) {
				jobids.push( chxs[i].value );
			}
		}
		return jobids.unique().join( ',' );
	}

	pt.selectAllJobs = function( checked ){
		var chxs = this._( 'resultList' ).getElementsByTagName( 'input' );
		var jobids = [];
		for ( var i = 0 ; i < chxs.length ; i++ ) {
			if ( /^selectJobid/.test( chxs[i].name ) ) {
				chxs[i].checked = checked;
			}
		}
		if(arguments.length == 2)
		{
			var tmpobj;
			if(arguments[1] == "quanxuan_top")
			{
				tmpobj = window.document.getElementById('quanxuan_bottom');
			}else if(arguments[1] == "quanxuan_bottom")
			{
				tmpobj = window.document.getElementById('quanxuan_top');
			}
			if(tmpobj)
			{
				tmpobj.checked = checked;
			}	
		}
	}

	pt.delSrpcgjz = function() {
		var kwd = this.excludeForm.keyword;
		if ( this.cfg.langs.srpcgjz == kwd.value ) {
			kwd.value = '';
			kwd.style.color = '#000000'; 
		}	
	}

	pt.initExcludeSearch = function() {
		var zzSearchObj = this;
		this.excludeForm.onsubmit = function() { zzSearchObj.excludeSearch(); return false; };
		this.bindEvent( this.excludeForm.keyword , 'click' , function(){ zzSearchObj.delSrpcgjz(); } );
		this.bindEvent( this.excludeForm.keyword , 'focus' , function(){ zzSearchObj.delSrpcgjz(); } );
	}

	pt.excludeSearch = function() {
		this.delSrpcgjz();
		var val = this.excludeForm.keyword.value.replace( /[^\u3040-\u318f\u3100-\u312f\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\u3300-\u337f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff65-\uff9fa-zA-Z0-9@#$%&']+/g , ' ' ).trim();
		if ( val ) {
			this.pageForm.keyword.value += ( ' ' + val ).replace( / +/g , ' -' );
		}
		this.pageFormSub( { keyword : this.pageForm.keyword.value , fromType : 9 } , true );
	}

	pt.showSubFuntypeLayer = function ( event , thisObj , funtype , url , data , showParam ) {
		var showParam = showParam || {};
		if ( thisObj.zlObj ) {
			thisObj.zlObj.open( event );
			return ;
		}
		var url = url || 'cityChoose.php?lang=' + this.cfg.lang + '&';
		url = /\?/.test( url ) ? url : url + '?';
		var tblStr = '<table cellpadding="0" cellspacing="0" style="border:3px solid ' + ( showParam.borderColor || '#FF7B00' ) + ';font-size: 12px;" bgcolor="#FEFFEF"><tbody><tr height="18"><td background="' + this.cfg.url.image_search + '/' + ( showParam.bgImg || 'open_bg.gif' ) + '" style="color:' + ( showParam.titleColor || '#ffffff' ) + ';padding-top:0px;cursor:default" valign="middle">&nbsp;<strong>' + this.cfg.langs.ts_qxjzw + '</strong></td><td background="'+ this.cfg.url.image_search + '/' + ( showParam.bgImg || 'open_bg.gif' ) + '" align="right"><img style="cursor:pointer;margin-left:10px;" src="' + this.cfg.url.image_search + '/' + ( showParam.closeImg || 'close1.gif' ) + '" align="absmiddle"></td></tr>';
		
		var data = data || ft;
		var subFuntypes = this.getSubCodes( data , funtype );
		if ( !showParam.titleColor ) {
			subFuntypes.splice( 0 , 0 , funtype );
		}

		for ( var k = 0 ; k < subFuntypes.length ; k++ ) {
			var funtypeName = ( '00' == subFuntypes[k].substr( 2 ) ? '(' + this.cfg.langs.quanbu + ')' : '' ) + data[subFuntypes[k]]
			tblStr += '<tr><td height="20" colspan="2" style="cursor: pointer;padding-right:10px;"><img src="' + this.cfg.url.image_search + '/blackpoint.gif" align="absmiddle"><a href="' + url + 'funtype=' + subFuntypes[k] + '">' + funtypeName + '</a></td></tr>';
		}
		tblStr += '</tbody></table>';

		var zlParam = { 
			content:  tblStr, 
			openType: 1 , //��궨λ
			MOutCloseNode : thisObj
		}
		var zl = new ExtZzLayer( zlParam );
		zl.setCloseNode( zl.div.firstChild.firstChild.firstChild.childNodes[1].firstChild );
		thisObj.zlObj = zl;
		zl.open( event );
	}

	pt.initTypeSearch = function() {
		var navSpans = this._( 'typeSearchNav' ).getElementsByTagName( 'span' );
		for ( var i = 0 ; i < 3 ; i++ ) {
			 navSpans[i].style.cursor = 'pointer';
			this.attEvt( navSpans[i] , 'click' , this.getTypeSearchNavClkFunc( navSpans[i] ) );
			navSpans[i].thisObj = this;
		}
	}

	pt.getTypeSearchNavClkFunc = function( currNaveSpan ) {
		return function() {
			var thisObj = currNaveSpan.thisObj;
			var navSpans = thisObj._( 'typeSearchNav' ).getElementsByTagName( 'span' ) , imgSrc , onOff;
			for ( var i = 0 ; i < 3 ; i++ ) {
				imgSrc = navSpans[i].firstChild.src.replace( /(on|off)\.gif$/ , '' );
				if ( navSpans[i] == currNaveSpan ) {
					onOff = 'on';
					display = '';
				}
				else {
					onOff = 'off';
					display = 'none';
				}
				navSpans[i].firstChild.src = imgSrc + onOff + '.gif';
				thisObj._( 'typeSearchTbl' + i ).style.display = display;
			}
			
		}
	}

	pt.formSub = function( frm ) {
		if ( frm.searchname && frm.searchname.isSub ) {
		
			frm.action = this.cfg.domain.my + '/sc/' + ( 'e' == this.cfg.lang ? 'esc/' : '' ) + 'my_se.php?save=save';
		}
		else {
			
			if ( this.searchForm == frm ) {
				this.delQsrgjz();
				if ( 3 == this.cfg.stype ) {//��ͼ����
					this.delSrdz();
					if ( !frm.address.value.trim() ) {
						alert( '����������λ��!' );
						frm.address.focus();
						return false;
					}
				}
				else {
					var hasNotFtBool = 1 == this.cfg.stype && 'index.php' == this.cfg.fileName;
					if ( 'e' == this.cfg.lang ) {
						var pekf = 'Please enter keyword or select ' + ( hasNotFtBool ? '' : 'job function/industry/' ) + 'location!';
					}
					else {
						var pekf = '������ؼ���,����ѡ��' + ( hasNotFtBool ? '' : 'ְ�����/��ҵ���/' ) + '�����ص�!';
					}
					var kwBool = frm.keyword.value.trim() != '';
					var jaBool = frm.jobarea.value && (frm.jobarea.value != '000000,00');
					var ftBool = hasNotFtBool ? false : frm.funtype.value && frm.funtype.value != '0000';
					var itBool = hasNotFtBool ? false : frm.industrytype.value && frm.industrytype.value != '00';
					if ( !kwBool && !jaBool && !ftBool && !itBool ) {
						alert( pekf );
						frm.keyword.focus();
						return false;
					}
				}
			}
			frm.action = this.getSearchResultHref( frm );
		}
		
		frm.submit();
	}

	pt.initSavePersonSearcher = function() {
		var thisObj = this;
		var savePs = function () {
			thisObj.searchForm.searchname.isSub = true;
		}
		this.searchForm.searchname.onkeydown = function( event ) {
			event = window.event || event;
			if ( 13 == event.keyCode ) {
				savePs();
			}
		}
		this._( 'personSearcherSubBtn' ).onclick = function () {
			savePs();
			thisObj.formSub( thisObj.searchForm );
		}
	}

	pt.jumpPage = function( pageHref ) {
		if ( 'search_result.php' == this.cfg.fileName ) {
			var tmp;
			if( tmp = /([\d]+)\.html/.exec( pageHref ) ) {
				this.pageFormSub( { curr_page : tmp[1] , fromType : 14 } );
			}
			else
			{
				window.location.href = pageHref;
			}
		}
		else {
			this.selJobPageFormSub( pageHref );
		}
		
	}

	pt.selJobPageFormSub = function( href ) {
		//this.selJobPageForm.selectedJobids.value = this.getSelectedJobids( this.selJobPageForm );
		this.selJobPageForm.selectedJobids.value = '';//��ʱȡ����ҳ��ѡjobid�ļ�¼
		this.selJobPageForm.target = '_self';
		this.selJobPageForm.action = href;
		this.selJobPageForm.submit();
	}

	//���ְλ����
	pt.relatedJobsSearch = function(keyword){
		this.delQsrgjz();
		this.searchForm.fromType.value = 72;
		this.searchForm.keyword.value = keyword;
		this.formSub( this.searchForm );
	}

	pt.hotKeywordSearch = function( keyword ) {
		this.delQsrgjz();
		this.searchForm.fromType.value = 3;
		this.searchForm.keyword.value = keyword;
		this.formSub( this.searchForm );
	}

	pt.hotDibiaoSearch = function( jobarea , address , line ) {
		this.delSrdz();
		for ( var i = 0 ; i < this.searchForm.jobarea.length ; i++ ) {
			this.searchForm.jobarea[i].checked = jobarea == this.searchForm.jobarea[i].value ? true : false;
		}
		this.searchForm.fromType.value = 20;
		this.searchForm.address.value = address.replace(/<\/?B[^>]*>/gi,'');
		this.searchForm.radius.value = '0.03';
		if(line)
		{
			this.searchForm.line.value = line;
		}
		this.formSub( this.searchForm );
	}

	pt.delSrdz = function() {
		var kwd = this.searchForm.address;
		if ( '�������ַ' == kwd.value ) {
			kwd.value = '';
			kwd.style.color = '#000000'; 
		}
	}

	pt.showSelectedJobs = function() {
		this.operateSelectedJobs( { url : this.cfg.url.root + '/show_selected_job.php?lang=' + this.cfg.lang , isAcStatRecJob : true } );
	}

	pt.applySelectedJobs = function() {
		this.operateSelectedJobs( { 
			url : this.cfg.domain.my + '/sc/' + this.cfg.langs.sqzwml + '/applyjob.php' , 
			prefix : '(' , 
			suffix : ')' ,
			isJobview : true ,
			isAcStatRecJob : true
		} );
	}

	pt.putInMyJobFolder = function( event ) {
		this.operateSelectedJobs( { event : event } );
	}

	pt.operateSelectedJobs = function( param ) {
		var jobiduni = this.getSelectedJobids( 'show_selected_job.php' != this.cfg.fileName ? this.pageForm : this.selJobPageForm );
		if ( '' == jobiduni ) {
			alert( this.cfg.langs.qzzwqdg );
			return false;
		}
		if ( param.isJobview ) {
			this.jobview( jobiduni );
		}
		if ( param.isAcStatRecJob ) {
			this.acStatRecJob( jobiduni.split( ',' ).length );
		}
		jobiduni = ( param.prefix || '' ) + jobiduni + ( param.suffix || '' );
		if ( param.event ) {
			if ( jobiduni.split( ',' ).length > 100 ) {
				alert( '�Բ���ÿ������ղ�100��ְλ��������ѡ��' );
				return false;
			}
			this.saveJobClk( jobiduni , param.event );
		}
		else {
			if ( /applyjob.php$/.test( param.url ) && jobiduni.split( ',' ).length > 45 ) {
				alert( '�Բ���ÿ�����Ͷ��45��ְλ��������ѡ��' );
				return false;
			}
			this.pageJumpForm.jobiduni.value = jobiduni;
			this.pageJumpForm.action = param.url;
			this.pageJumpForm.submit();
		}
	}

	pt.initJobareaLayer = function() {
		var param = { cfg : this.cfg , openNodes : this.searchForm.btnJobarea , _textNodes : this.searchForm.btnJobarea , _valueNodes : this.searchForm.jobarea , selValues : this.searchForm.jobarea.value , shouldInit : false };
		var jaLayer = new JobareaLayer( param );
	}

	pt.initCityChooseTbl = function( cityChoose ) {
		var param = { cfg : this.cfg , cityChoose : cityChoose };
		var jaLayer = new JobareaLayer( param );
	}


	pt.initFuntypeLayer = function() {
		var param = { cfg : this.cfg , openNodes : this.searchForm.btnFuntype , _textNodes : this.searchForm.btnFuntype , _valueNodes : this.searchForm.funtype , selValues : this.searchForm.funtype.value , shouldInit : false };
		this.ftLayer = new FuntypeLayer( param );
	}
	
  pt.initNewMajorLayer = function() {
		var param = { cfg : this.cfg , openNodes : this.searchForm.btnSubMajor , _textNodes : this.searchForm.btnSubMajor , _valueNodes : this.searchForm.SubMajor , selValues : this.searchForm.SubMajor.value , shouldInit : false };
		this.maLayer = new NewMajorLayer( param );
	}
	
	pt.initNewMajorLayer2 = function() {
		var param = { cfg : this.cfg , openNodes : this.searchForm.inputTopMajor , _textNodes : this.searchForm.inputTopMajor , _valueNodes : this.searchForm.TopMajor , selValues : this.searchForm.TopMajor.value , shouldInit : false };
		this.maLayer = new NewMajorLayer( param );
	}
	
	pt.initNewMajorLayerInteraction = function() {
		var param = { cfg : this.cfg , openNodes : this.searchForm.selectMajor , _textNodes : this.searchForm.selectMajor , _valueNodes : this.searchForm.major , selValues : [this.searchForm.major.value] , shouldInit : true };
		this.maLayer = new NewMajorLayer( param );
	}
	
	pt.initIndtypeLayer = function() {
		var param = { cfg : this.cfg , openNodes : this.searchForm.btnIndustrytype , _textNodes : this.searchForm.btnIndustrytype, _valueNodes : this.searchForm.industrytype , selValues : this.searchForm.industrytype.value , shouldInit : false };
		this.itLayer = new IndtypeLayer( param );
	}

	pt.openRelatedSearchLayer = function( field ) {
		var thisObj = this;
		if ( !this.relatedSearchLayer ) {
			var param = {
				cfg : cfg ,
				isMulty : false ,
				data : fk ,
				headTitle: '' ,
				colNum : 3 ,
				getSubValues : function(){ return []; } ,
				isHasNolimit : false ,
				confirmFunc : function( _values ) {
					var param = {};
					param.jobarea = _values[0].substr( 0 , 6 );
					param[this.field] = _values[0].substr( 6 );
					param['curr_page'] = 1;
					thisObj.pageFormSub( param , true );
				}
			};
			this.relatedSearchLayer = new JobLayer( param );
			this.relatedSearchLayer.field = field;
		}
		this.relatedSearchLayer.open();
	}

	pt.switchRefineMenu = function( obj ) {
		if ( 'refineNavOn' == obj.className ) {
			obj.className = 'refineNavOff';
			obj.nextSibling.style.display = 'none';
		}
		else {
			obj.className = 'refineNavOn';
			obj.nextSibling.style.display = '';
		}
	}

	pt.switchListType = function( img , trbgcolor ) {
		var tr0 = img.parentNode.parentNode;
		var tbl = tr0.parentNode.parentNode;
		var tr1 = tbl.rows[tr0.rowIndex + 1];
		var tr2 = tbl.rows[tr0.rowIndex + 2];
		if ( 'none' == tr1.style.display ) {
			var suf = 'up';
			var disp = '';
			var overOut = true;
		}
		else {
			var suf = 'down';
			var disp = 'none';
			var overOut = false;
		}
		img.src = img.src.replace( /((down)|(up))\.gif$/ , suf + '.gif'  );
		tr1.style.display = tr2.style.display = disp;
		this.switchListBg( tr0 , trbgcolor , overOut );
	}

	pt.switchListBg = function( tr , trbgcolor , overOut ) {
		var tbl = tr.parentNode.parentNode;
		var i = tr.className.charAt( 2 );
		var k = tr.rowIndex;
		var tr0 = tbl.rows[k - i] , tr0bg;
		var tr1 = tbl.rows[k - i + 1] , tr1bg;
		var tr2 = tbl.rows[k - i + 2] , tr2bg;
		var ljsqGif , disp;
		if ( overOut && '' == tr1.style.display ) {//���������չ��
			tr0bg = 'url(' + this.cfg.url.image_search + '/jggl.gif)';
			tr1bg = '';
			tr2bg = '';
			ljsqGif = 'ljsq.gif';
			disp = '';
		}
		else {
			tr0bg = tr1bg = tr2bg = trbgcolor;
			ljsqGif = 'ljsq1.gif';
			disp = 'none';
		}
		tr0.style.background = tr0bg;
		tr1.style.background = tr1bg;
		tr2.style.background = tr2bg;
		var imgs = tr1.getElementsByTagName( 'img' );
		imgs[imgs.length - 1].src = this.cfg.url.image_search_lang + '/' + ljsqGif;
		var p = tr2.getElementsByTagName( 'p' );
		p[0].style.display = disp;
	}

	pt.switchListBgNew = function( tr , trbgcolor , overOut ) {
		var tbl = tr.parentNode.parentNode;
		var i = tr.className.charAt( 2 );
		var k = tr.rowIndex;
		var tr0 = tbl.rows[k - i] , tr0bg;
		var tr1 = tbl.rows[k - i + 1] , tr1bg;
		var tr2 = tbl.rows[k - i + 2] , tr2bg;
		var ljsqGif , disp, fontcolor;
		if ( overOut && '' == tr1.style.display ) {//���������չ��
			tr0bg = 'url(' + this.cfg.url.image_search + '/jggl.gif)';
			tr1bg = '';
			tr2bg = '';
			ljsqGif = 'ljsq.gif';
			disp = '';
			fontcolor = '#0265C2';
		}
		else {
			tr0bg = tr1bg = tr2bg = trbgcolor;
			ljsqGif = 'ljsq1.gif';
			disp = '';
			fontcolor = '#FF7300';
		}
		tr0.style.background = tr0bg;
		tr1.style.background = tr1bg;
		tr2.style.background = tr2bg;
		var imgs = tr1.getElementsByTagName( 'img' );
		imgs[imgs.length - 1].src = this.cfg.url.image_search_lang + '/' + ljsqGif;
		var p = tr2.getElementsByTagName( 'p' );
		var s = p[0].getElementsByTagName( 'span' );
		s[0].style.color = fontcolor;
		s[1].style.color = fontcolor;
	}

	pt.initListTrOverOut = function() {
		var tbl = this._( 'resultList' );
		var thisObj = this;
		for ( var i = 0 ; i < tbl.rows.length ; i++ ) {
			if ( /^tr[012].*$/.test( tbl.rows[i].className ) ) {
				tbl.rows[i].trbgcolor = tbl.rows[i].bgColor;
				tbl.rows[i].onmouseover = function() { thisObj.switchListBgNew( this , this.trbgcolor , true ); };
				tbl.rows[i].onmouseout = function() { thisObj.switchListBgNew( this , this.trbgcolor , false ); };
			}
		}
	}

	pt.encodeUrl = function (city, address, lonlat, opentype, coid) {		
		var addparam = '';
		if (city.indexOf('��') < 0){
			city=city+'��';
		}
		// ������������coid���� add by solomon 2010.04.07
		if(opentype == '2' && coid){
			addparam = 'coid='+coid+'&';
			
		}
		if (opentype=='1'){
			window.open('http://api.map.baidu.com/marker?output=html&title=' + encodeURIComponent( city ) + '&content=' + encodeURIComponent( address ) + '&location=' + lonlat, 'ShowMap');			
		}else{
			window.open( this.cfg.url.root + '/tranToMap.php?'+addparam+'opentype='+opentype+'&city=' + encodeURIComponent( city ) + '&address=' + encodeURIComponent( address ) + '&lonlat=' + lonlat, 'ShowMap' , 'width=740,height=525,top=50,left=50,resizable=yes' );
		} 
	}
	
	//mod by fairy.sa 2009-06-25 ���ӵ�������
	//modify by robin 2009-11-12 ��ͼ���������
	pt.initDibiao = function( dibiaoData, LineData,fenquData ) {		
		var thisObj = this;		
		jobarea = this.searchForm.jobarea.value;
		if (jobarea == ''){
			jobarea='020000';
		}
		function reFillTbl( event ) {
			event = window.event || event;
			var jobareaselect = event.srcElement || event.target;
			jobarea=jobareaselect.getAttribute("codestr");
			var city=jobareaselect.getAttribute("city");
			thisObj.searchForm.jobarea.value=jobarea;
			if (thisObj.searchForm.ismapresult){
				$("#btnJobarea")[0].value=	city;
			}else{
				$("#city")[0].innerHTML=city;
			}
			thisObj.saveJobAreaCookie(jobarea);
			dibiao.setData( dibiaoData[jobarea],LineData[jobarea],fenquData[jobarea] );
			dibiao.fillTbl();
			var jobareatmp="";
			var ShowLine=false;
			for ( var i = 0 ; i < document.getElementsByName("SelectMapArea").length ; i++ ){
				jobareatmp=document.getElementsByName("SelectMapArea")[i].getAttribute("codestr");
				if (thisObj._('city' + jobareatmp)){
					thisObj._('city' + jobareatmp).style.display = (jobareatmp== jobarea)? '' : 'none';
				}
				if (thisObj._('Line' + jobareatmp)){
					thisObj._('Line' + jobareatmp).style.display = (jobareatmp== jobarea)? '' : 'none';
					if (jobareatmp== jobarea){
						ShowLine=true;
					}
				}else{
					if (thisObj._('maptitle')){
						thisObj._('maptitle').style.display = 'none';
					}
				}
			}
			if (ShowLine){
				if (thisObj._('maptitle')){
					thisObj._('maptitle').style.display = '';
				}
			}else{
				if (thisObj._('maptitle')){
					thisObj._('maptitle').style.display = 'none';
				}
			}
			$(objAreaDivMap.idShowDivContainerMap).hide();
		}
		for ( var i = 0 ; i < document.getElementsByName("SelectMapArea").length ; i++ ) {
			this.bindEvent( document.getElementsByName("SelectMapArea")[i] , 'click' , reFillTbl);//��ѡ�����
		}

		this.bindEvent( this.searchForm.address , 'focus' , 
			(function( obj ) {
				return function() {
					obj.style.color = '#000000';
					if ( '�������ַ' == obj.value ) {
						obj.value = '';
					}
				}
			})( this.searchForm.address )
		);

		var param = {
			jobarea : jobarea,
			data : dibiaoData[jobarea] ,
			data1 : LineData[jobarea] ,
			fenquData : fenquData[jobarea] ,
			posNode : this._( 'dibiao_tbl' ) ,
			textNode : this.searchForm.address ,
			openNode : this._( 'dibiao_td' ) ,
			divProps : { className : 'dibiaoLayer'}
		};
		var dibiao = new DibiaoLayer( param );
	}
	
	pt.ShowLine = function( Line ) {
		var maxLineNum=100;
		this._( 'LineFont0' ).style.color = Line == 0 ? '#ff7300' : '#266EBA';
		this._( 'LineFont0' ).style.fontWeight = Line == 0 ? 'bold' : 'normal';
		//maxLineNum ��ֵ�� in/js/2009/line.js���屣��ͬ��
		for(var i = 1; i <= maxLineNum; i++ )
		{
			if(!this._( 'Line' + i )) break;
			this._( 'Line' + i ).style.display = Line == i ? '' : 'none';
			this._( 'LineFont' + i ).style.color = Line == i ? '#ff7300' : '#266EBA';
			this._( 'LineFont' + i ).style.fontWeight = Line == i ? 'bold' : 'normal';
		}
	}

	//var myUrl = this.cfg.url.root + '/saveJob.php?' + Math.random()+'&jsoncallback=?';
	//modify by robin 2009-11-10
	pt.saveJobAreaCookie = function( jobarea ) {
		var thisObj = this;
		var myUrl = this.cfg.domain.search + '/jobsearch/mapbar/SaveJobAreaCookie.php?type=1&jobarea='+jobarea+'&ran=' +  Math.random();
		$.ajax( {
				type: 'get' ,
				url: myUrl ,//һ������������ֹ����
				data: { } ,
				error: function () {
					} ,
				success: function ( data ) {
				}
			}
		);
	}


	/*********ְλ�ղ� start**********/
	pt.saveJobClk = function( jobiduni , event  ) {
		event = event || window.event;
		var thisObj = this;
		var e = { clientX : event.clientX , clientY : event.clientY };
		$.ajax( {
			url: this.cfg.url.root + '/isLogin.php?' + Math.random() ,
			error: function () {} ,
			success: function ( status ) {
				thisObj.saveJobClkBack( status , jobiduni , e );
			}
		} );
	}

	pt.saveJobClkBack = function( status , jobiduni , event ) {
		var thisObj = this;
		if ( status != 1 ) {
			var lang = $("#top_login_language").val();
			if(lang == "en"){
				var language = "EN";
			}else{
				var language = "CN";
			}
			var callback = function(){
									zzSearch.saveJob( jobiduni , event );
								};

				ShowPassportLayer(language,callback);
		}
		else {
			this.saveJob( jobiduni , event );
		}
	}

	//var myUrl = this.cfg.url.root + '/saveJob.php?' + Math.random()+'&jsoncallback=?';
	pt.saveJob = function( jobiduni , event ) {
		var thisObj = this;
		var myUrl = this.cfg.domain.my + '/AjaxAction/my/JobFoAction.php?type=add&jobiduni=(' + jobiduni + ')&ran=' +  Math.random() + '&jsoncallback=?';
		var jobids = jobiduni.split( ',' );
		//prompt( 1 , myUrl );
		//alert( myUrl );
		try {
			$.getJSON( myUrl , {} , function( data ) {
				if ( data && data.status == true ) {
					if ( data.jobarr.length ) {//�����Ѵ���
						if ( 1 == jobids.length ) {
							var sugg = '��ְλ֮ǰ���������ղؼ��ڣ������ٴ��ղأ���л����ʹ�ã�';
						}
						else {
							if ( data.jobarr.length < jobids.length ) {
								var sugg = '����ְλ���ղسɹ�������ְλ֮ǰ���������ղؼ��ڣ������ٴ��ղأ���л����ʹ�ã�';
							}
							else {
								var sugg = '��ѡ�е�ְλ֮ǰ���������ղؼ��ڣ������ٴ��ղأ���л����ʹ�ã�';
							}
						}
					}
					else {//ȫ���ɹ�
						thisObj.showMemo( jobiduni , event );
					}
				}
				else {//ȫ��ʧ��
					var sugg = '�Բ��������ղ�ʧ��!';
				}
				if ( sugg ) {
					alert( sugg );
				}
			});
		}
		catch ( e ) {
			alert( e );
		}

	}

	pt.showMemo = function( jobiduni , event ) {
		var thisObj = this;
		if ( !this.memoLayer ) {
			var content = '<div class="window03" style1="border:1px solid red;"><p class="window_title">��ϲ�����ղسɹ�!<span class="window_close02" ><img id="memoLayerClose" src="' + this.cfg.url.image_search + '/icon_close.gif" align="absmiddle" /></span></p><div class="window_con04"><ul class="window_con_bg02"><p class="window_like01">���ñ�ǩ��<input type="button" value="��ϲ��" class="win_lab01"/><input name="" type="button" value="����Ȥ"  class="win_lab01"/><input name="" type="button" value="���ῴ" class="win_lab01" /></p><p class="window_like01">ְλ��ע��<textarea cols="" rows="3" class="win_input"></textarea></p><p class="window_like02"><img id="saveJobBtn" align="absmiddle" src="' + this.cfg.url.image_search + '/btn_save.gif" />&nbsp;<a align="absmiddle" class="orange" href="' + this.cfg.domain.my + '/my/folder/Fo_PutIn.php" target="_blank">�鿴�����ղ�ְλ>></a></p></ul></div></div>';
			this.memoLayer = new ExtZzLayer( { content : content , openType : 1 , closeNode : 'memoLayerClose' } );
			this.memoLayer.memoTextarea = this.memoLayer.div.getElementsByTagName( 'textarea' )[0];
			var btns = this.memoLayer.div.firstChild.getElementsByTagName( 'input' );
			for ( var i = 0 ; i < btns.length ; i++ ) {
				btns[i].style.cursor = 'pointer';
				btns[i].onclick = function() {
					thisObj.memoLayer.memoTextarea.value = this.value;
				}
				btns[i].onmouseover = function() {
					this.className = 'win_lab02';
				}
				btns[i].onmouseout = function() {
					this.className = 'win_lab01';
				}
			}
			this._( 'saveJobBtn' ).onclick = function() {
				if ( thisObj.memoLayer.memoTextarea.value.getLen() > 30 ) {
					alert( '��ע���ܳ���15�����֡�' );
					thisObj.memoLayer.memoTextarea.focus();
					return false;
				}
				var myUrl = thisObj.cfg.domain.my + '/AjaxAction/my/JobFoAction.php?type=memo&jobiduni=(' + thisObj.memoLayer.jobiduni + ')&memo=' + thisObj.memoLayer.memoTextarea.value + '&ran=' +  Math.random() + '&jsoncallback=?';
				//prompt( 1 , myUrl );
				//alert( myUrl );
				$.getJSON( myUrl , {} , function( data ) {
				});
				thisObj.memoLayer.close();
			}
			this._( 'saveJobBtn' ).style.cursor = 'pointer';
		}
		
		//�����Զ����ش���
		if ( this.showMemoTimtout ) {
			clearTimeout( this.showMemoTimtout );
		}
		this.showMemoTimtout = setTimeout( function() {
			thisObj.memoLayer.close();
		} , 3000 );
		this.bindEvent( this.memoLayer.div , 'click' , function() { clearTimeout( thisObj.showMemoTimtout ); } );

		this.memoLayer.memoTextarea.value = '';
		this.memoLayer.jobiduni = jobiduni;
		this.memoLayer.open( event );
	}
	/*********ְλ�ղ� end**********/

	pt.openAdviceLayer = function() {
		var thisObj = this;
		if ( !this.adviceLayer ) {
			var content = '<div class="window03 adviceLayer"><p class="window_title">�������<span class="window_close02" ><img src="' + this.cfg.url.image_search + '/icon_close.gif" align="absmiddle" /></span></p><div class="window_con04"><ul class="window_con_bg02"><p class="window_like01">��л������51job�Ķ�ؼ����������ܣ���ʹ�ù����У����Ƿ����������⣿������ʲô���飿��������ǣ�</p><p class="adviceTitle">����д�������ݣ�<font color="red">*</font>��</p><form name="subAdvice" method="post" action=""><p class="window_like01"><textarea cols="" rows="6" class="win_input" name="advice"></textarea></p><p class="adviceTitle">����д��ϵ��ʽ<font color="gray">�����ڻطã�</font></p><p class="window_like01"><input name="email" class="win_input" type="text" /></p><p class="window_like02"><input type="image" id="subAdviceImg" src="' + this.cfg.url.image_search + '/btn_tijiao.gif" /><img id="btnQuxiao" src="' + this.cfg.url.image_search + '/btn_quxiao.gif" /></p></form></ul></div></div>';

			this.adviceLayer = new ExtZzLayer( { content : content , openType : 2 , filterParam : {} , closeNode : 'adviceLayerClose' } );
			this.adviceLayer.setDragNode( this.adviceLayer.div.getElementsByTagName( 'p' )[0] );
			this.adviceLayer.setCloseNode( this.adviceLayer.div.getElementsByTagName( 'img' )[0] );
			this.adviceLayer.setCloseNode( 'btnQuxiao' );
			
			function subAdvice() {
				if( '' ==document.subAdvice.advice.value.trim() ) {
					alert( '����д���������' );
					document.subAdvice.advice.focus();
					return false;
				}
				len = document.subAdvice.advice.value.length;
				if( len > 10000 ){
					alert( '�Բ��𣬳��ȳ�����������󳤶�10000��Ŀǰ����' + len + '��' );
					return false;
				}
				var urlEncode = window.encodeURIComponent || window.escape;
				$.ajax( {
					url: thisObj.cfg.url.root + '/saveAdvice.php?' + Math.random() ,
					type: 'POST' ,
					data: 'email=' + urlEncode( document.subAdvice.email.value ) + '&advice=' + urlEncode( document.subAdvice.advice.value ) ,
					success: function ( status ) {
						if ( '1' == status ) {
							alert( '����ύ�ɹ���лл����֧��' );
						}
						else {
							 alert( '�Բ�������ύʧ�ܣ����Ժ����ԣ�лл��' );
						}
						thisObj.adviceLayer.close();
					}
				} );
				return false;
			}

			document.subAdvice.onsubmit = function(){ return false; };
			document.subAdvice.email.onkeydown = function( event ){
				event = event || window.event;
				if ( 13 == event.keyCode ) {
					subAdvice();
				}
			}
			this._( 'subAdviceImg' ).onclick = subAdvice;

		}

		document.subAdvice.email.value = '';
		document.subAdvice.advice.value = '';
		this.adviceLayer.open();
	}
	
	pt.switchFunIndBtnDisp = function( img ) {
		var obj = img.parentNode;
		if ( 'none' == obj.firstChild.style.display ) {
			var kwdAdvDisp1 = '';
			var kwdAdvDisp2 = 'none';
			var stype = 2;
		}
		else {
			var kwdAdvDisp1 = 'none';
			var kwdAdvDisp2 = '';
			var stype = 1;
		}
		var kwdAdvDispPot = this._( 'kwdAdvDispPot' );
		kwdAdvDispPot.style.display = kwdAdvDispPot.nextSibling.style.display = obj.firstChild.style.display = kwdAdvDisp1;
		obj.childNodes[1].style.display = kwdAdvDisp2;
		this.searchForm.stype.value = stype;
		if ( !this.funIndPClked && '' == obj.firstChild.style.display ) {
			this.ftLayer.onFunc();
			this.itLayer.onFunc();
			if(this.maLayer){
				this.maLayer.onFunc();
			}
		}
		this.funIndPClked = true;
	}

	/*
	 *Author	Liyao 
	 *Date		2009-5-8
	 *Function	�ؼ����Զ����ҳ����ó�ʼ��
	 */
	pt.initAutoCom = function() {
		if ( !/51job\.com$/.test( document.domain ) ) {//�ж�����,ֻ�ж���������ͬ�ŷ���������ajax
			return false;
		}
		//����iframe����
		window.ajaxIfr = document.createElement( 'iframe' );
		ajaxIfr.style.display = 'none';
		ajaxIfr.src = 'http://kwdsrv.51job.com/kwdAjaxIframe.html';
		document.body.appendChild( ajaxIfr );
		window.ajaxIfr = ajaxIfr;

		var kwdProVideUrl = 'http://kwdsrv.51job.com/Default.aspx?kwdType=';
    
		window.iDp = [];
		for ( var i = 0 ; i < 3 ; i++ ) {
			iDp[i] = new DataProvide( kwdProVideUrl + i , this.cfg.lang );
		}
		var kTypeIndex = this.searchForm.keywordtype.value - 0;
		var kwdObj = [this.searchForm.keyword];
		var thisSearchObj = this;
		var clkFunc = [function() { thisSearchObj.formSub( thisSearchObj.searchForm ); }];
		
		var onSetVal = [function() { thisSearchObj.searchForm.fromType.value = 23; }];
		
		var inpKeydown = function( event ) { 
			event = event || window.event;
			var input = event.srcElement || event.target;
			input.iLastValue = input.value;
			
		};
		
		var inpKeyup = function( event ) { 
			event = event || window.event;
			var input = event.srcElement || event.target;
			if ( input.value != input.iLastValue  ) {
				if ( event.keyCode < 37 || event.keyCode > 40 ) {
					thisSearchObj.searchForm.fromType.value = 1;
				}
			}
		};
		
		var kwdLen = kwdObj.length;
		
		for ( var i = 0 ; i < kwdLen ; i++ ) {
			iPush( [kwdObj[i] , iDp[kTypeIndex] , clkFunc[i] , onSetVal[i]] );
			//Ŀǰ����ΪֻҪʹ������������ͽ�fromType��Ϊ23,��ʾʹ������������
			//this.bindEvent( kwdObj[i] , 'keydown' , inpKeydown );
			//this.bindEvent( kwdObj[i] , 'keyup' , inpKeyup );
		}

		/*�ؼ�������ͼ���л�����Ӧ�¼�*/
		function chgIDP( event ) {//���빦��ajax url ��Ӧ�л�
			 var e = event || window.event;
			 var obj = e.target || e.srcElement; 
			if ( iCom ) {
				var iLen = iCom.length;
				for ( var i = 0 ; i < iLen ; i++ ) {
					iCom[( iTag + ( i + 1 ) )]['iDp'] = iDp[obj.getAttribute( 'valKey' )];
				}
			}
		}
		if (this.searchForm.ismapresult){
			for ( var i = 0 ; i < document.getElementsByName('keywordtyperadio').length  ; i++ ) {
				this.bindEvent( document.getElementsByName('keywordtyperadio')[i] , 'click' , chgIDP );
			}
		}else{
			var ul = this._( 'kwdTypeSel' );
			for ( var i = 0 ; i < ul.childNodes.length  ; i++ ) {
				this.bindEvent( ul.childNodes[i] , 'click' , chgIDP );
			}
		}

	}
	
	//ְλ�����ͳ��
	pt.jobview = function( jobiduni ) {
		if ( !this.cfg.isJobview ) {
			return false;
		}
		if ( !this.jobviewImgs ) {
			this.jobviewImgs = [];
			for ( var i = 0 ; i < 3 ; i++ ) {
				var _img=document.createElement('img');
				_img.width = _img.height = 0;
				_img.style.display = 'none';
				document.body.appendChild( _img );
				this.jobviewImgs.push( _img );
			}
			this.currJobviewImgIndex = 0;
		}
		this.currJobviewImgIndex = ( this.currJobviewImgIndex + 1 ) % this.jobviewImgs.length;
		this.jobviewImgs[this.currJobviewImgIndex].src = this.cfg.url.root + '/jobview.php?jobiduni=' + jobiduni + '&' + Math.random();
	}
	
	//myְλ�Ƽ�ְλ���ͳ��
	pt.acStatRecJob = function ( count ) {
		if ( !this.isAcStatRecJob ||!this.acStatRecJobType || this.cfg.fileName != 'rec_job_list.php' ) {
			return false;
		}
		if ( !this.acStatRecJobImgs ) {
			this.acStatRecJobImgs = [];
		}
		for ( var i = 0 ; i < count ; i++ ) {
			if ( !this.acStatRecJobImgs[i] ) {
				var _img=document.createElement('img');
				_img.width = _img.height = 0;
				_img.style.display = 'none';
				document.body.appendChild( _img );
				this.acStatRecJobImgs[i] = _img;
			}
			this.acStatRecJobImgs[i].src = 'http://ac.51job.com/phpAD/Pagelog.php?Type=' + this.acStatRecJobType + '&' + Math.random();
		}
	}
	
	//����ְλ��ʾ����
	pt.relatedJobMore = function(more){
		if(more){
			this._('relatedJobMoreShowBtn').style.display = 'none';
			this._('relatedJobs').style.display = '';
		}else{
			this._('relatedJobMoreShowBtn').style.display = '';
			this._('relatedJobs').style.display = 'none';
		}
	}

	//�ر��Ƿ���ʾ����
	pt.showMore = function (more) {
		if(more)
		{
			this._('more').style.display = 'none';
			this._('moreDibao').style.display = '';
		}
		else
		{
			this._('more').style.display = '';
			this._('moreDibao').style.display = 'none';
		}
	}
	//�����Ƿ���ʾ����
	pt.LineShowMore = function(more)
	{
		if(more)
		{
			this._('lineShowBtn').style.display = 'none';
			this._('moreLine').style.display = '';
		}
		else
		{
			this._('lineShowBtn').style.display = '';
			this._('moreLine').style.display = 'none';
		}
	}

	pt.DisttictShow = function(show,num){
		var more = 'more'+num;
		var dnum = 'moreDistrict'+num;
		if(show)
		{
			this._(more).style.display = 'none';
			this._(dnum).style.display = '';
		}else
		{
			this._(more).style.display = '';
			this._(dnum).style.display = 'none';
		}
	}
	
	//�رյ���������ʾ����
	pt.closeTips = function () {
		$.ajax( {
			url: this.cfg.url.root + '/closeTip.php?' + Math.random() ,
			error: function () {} ,
			success: function () {}
		} );
		this._('tips').style.display = 'none';
	}
	
	pt.showTips = function () {
		var obj = this._('Lineline');
		if(this._('tips'))
		{
			var t=obj.offsetTop;
		    var l=obj.offsetLeft;
		    while( obj=obj.offsetParent ){
				l += obj.offsetLeft;
				t += obj.offsetTop;
			}
			this._('tips').style.top = (t - 100) + 'px';
			this._('tips').style.left = (l + 47) + 'px';
			this._('tips').style.display = '';
		}
	}

	pt.initAutoGrassrootsCom = function() {
		if ( !/51job\.com$/.test( document.domain ) ) {//�ж�����,ֻ�ж���������ͬ�ŷ���������ajax
			return false;
		}
		//����iframe����
		window.ajaxIfr = document.createElement( 'iframe' );
		ajaxIfr.style.display = 'none';
		ajaxIfr.src = 'http://kwdsrv.51job.com/kwdAjaxIframe.html';
		document.body.appendChild( ajaxIfr );
		window.ajaxIfr = ajaxIfr;

		var kwdProVideUrl = 'http://kwdsrv.51job.com/Default.aspx?kwdType=3';

		window.iDp = [];

        iDp[0] = new DataProvide( kwdProVideUrl , this.cfg.lang );

		var kwdObj = [this.searchForm.keyword];
		var thisSearchObj = this;
		var clkFunc = [function() { thisSearchObj.formSub( thisSearchObj.searchForm ); }];
		var onSetVal = [function() { thisSearchObj.searchForm.fromType.value = 41; }];
		var inpKeydown = function( event ) { 
			event = event || window.event;
			var input = event.srcElement || event.target;
			input.iLastValue = input.value;
		};
		var inpKeyup = function( event ) { 
			event = event || window.event;
			var input = event.srcElement || event.target;
			if ( input.value != input.iLastValue  ) {
				if ( event.keyCode < 37 || event.keyCode > 40 ) {
					thisSearchObj.searchForm.fromType.value = 41;
				}
			}
		};
		var kwdLen = kwdObj.length;
		for ( var i = 0 ; i < kwdLen ; i++ ) {
			iPush( [kwdObj[i] , iDp[0] , clkFunc[i] , onSetVal[i]] );
		}
	}
	pt.showMapIframe = function(url,title) {
		var iframeinfo = "<div class=\"showMapLayer\" ><p  id= 'mapdrag' class=\"showMapLayer_title\"><span class='showMapLayer_title_info'>"+title+"</span><span class=\"showMapLayer_title_close\" id=\"map_window_close\"><img src=\"http://img01.51jobcdn.com/im/2009/emy/folder/icon_close.gif\" align=\"absmiddle\" /></span></p><div  class='showMapIframe' > \
		<iframe frameborder='no' border='0' src='"+url+"'></iframe>\
		</div></div>";
		
		var maplayer = { 
			content:  iframeinfo, 
			openType: 2 ,
			filterParam : {}
		}
		if(!window.mapiframelayer){
			window.mapiframelayer = new ExtZzLayer( maplayer );
			mapiframelayer.setCloseNode('map_window_close');
			mapiframelayer.setDragNode('mapdrag');
		}
		mapiframelayer.open();
	}

})();