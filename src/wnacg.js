ExView.Plugins({
	info: {
		name: "绅士漫画",
		version: "2.1",
		icon:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABTElEQVQ4jcXTsUuVURgG8N93/YiQiGi4SaP/gBAR0uSQDlcUKaOM8g9obzEa00UXwaUIhBLhgtTm4tTgKK41O9xA5GZw0evtfg3n9XaRvsmhdzrnvOd5zvM+73uyoihcJiqXQiOvvPsJNzCBK2hgJ/LTeI9B5NjDExz0CPwu4CE+xFkTI7iHjSA9j/vYDpIGjrPK6tFHPL+grB0vlpXYifynbGDl8FccrKOFYTztu7yPr7iOGqp9uWau3c3xHUtBcBez8cJrLIZHLVzFFh70PMjOuie4gx8XZH4J8Bpe4gSPMYdvuJkITrslZdrAaICnMC4ZfStKmkkE7dJBynHOfk1qZSf2PXPz7KxUwQtMYhmbOMYjDGHsL0G7lKCGt3iFN5IHVXyWOhIyyxXAgtTS3QCN9YOTgk5Rx7w0PP+K23gW61aUQprQevbff+Mf0PRSnPpQ2roAAAAASUVORK5CYII=",
		db: "wnacg",
		apihost: "http://www.wnacg.net/",
		pagetitle: ["<br>", "收藏", "首页", "类型", "下载"],
		lazyload: true,
		download: true,
		nativeres: true,
		setting: true,
		typelistmode:true,
		cdn: "" //"http://127.0.0.1/proxy.php?"
	},
	set: function(args) {
		args = args || {};
	},
	unset: function(args) {
		args = args || {};
	},
	init: function() {
		ExView.workers.fav.listloader({
			callback: function() {
				ExView.workers.index.loader();
			}
		})
	},
	flags: {
		indexflag: {
			loader: function(args) {
				//if (!args.front && !args.page) setnowlistname("首页", "", pluginfo(args.plugin).icon);
				if (!args.front && !args.page) {
					//addcardlist('<div align="center" class="list-block threat"><img src="img/logo.png"/><br>正在加载首页...<div class="progress"></span></div>', 2);
					addtypelist('<div align="center" class="list-block"><img src="img/logo.png"/><br>类型<br>正在加载...<div class="progress"></span></div>', 2)
				}
				return {
					url: pluginfo(args.plugin).apihost+(parseInt(args.page)>1?"albums-index-page-"+args.page+".html":"albums.html"),
					method: "GET",
					timeout: 120,
					nativerequest: pluginfo(args.plugin).nativeres,
header:{"User-Agent":"ExView","Referer":pluginfo(args.plugin).apihost},	
					successfn: function(result, header) {
						ExView.workers.index.countfinder(obj_contact(args, {
							result: result,
							header: header
						}));
						if (!args.front&& !args.page) {
						ExView.workers.type.finder({
							result: result,
							plugin: args.plugin
						});
						}
						args.successfn && args.successfn({
							result: result,
							header: header
						})
					},
					errorfn: function() {
						if (!args.front &&!args.page) {
							//setnowlistname("首页", "", pluginfo(args.plugin).icon);
					
						addtypelist('<div align="center" class="list-block"><a href="javascript:void(0);" onclick="ExView.workers.type.loader();"><img src="img/logo.png"/><br>加载失败，请刷新重试！</a></div>', 2);
							}
						ExView.fw.hidePreloader();
						mySession.isloading = 0;
						ExView.fw.alert("网络错误！", "ExView")
					},
					canclefn: function() {
						if (!args.front &&!args.page) {
							//setnowlistname("首页", "", pluginfo(args.plugin).icon);
						
						addtypelist('<div align="center" class="list-block"><a href="javascript:void(0);" onclick="ExView.workers.type.loader();"><img src="img/logo.png"/><br>加载失败，请刷新重试！</a></div>', 2);
						}
					},
					showinfo: {
						text: '正在加载...' + ((args.page > 1) ? '<br>第' + args.page + '页' : ''),
						name:'首页',
						title: mySession.nowlistname,
						img: mySession.nowlistimg
					}
				}
			},
			finder: function(args) {
				return {
					reg: plugfns(args.plugin).pagerule,
					str: getresult(args.result),
					find: plugfns(args.plugin).pagefind,
					successfn: function(rr) {
						if (rr) {
							plugfns(args.plugin).pagedeal(rr)
						} else {
							addcardlist('<div align="center" class="list-block"><img src="img/logo.png"/><br>没有内容</div>', 2)
						}
					},
					errorfn: function() {
						if (!args.page) {
							setnowlistname("首页", "", pluginfo(args.plugin).icon)
						}
						ExView.fw.hidePreloader();
						mySession.isloading = 0;
						ExView.fw.alert("网络错误！", "ExView")
					}
				}
			},
			countloader: function(args) {
				return false
			},
			countfinder: function(args) {
				return{
					reg: plugfns(args.plugin).pagecountrule,
					str: args.result,
					find: plugfns(args.plugin).pagecountfind,
					successfn: function(rr) {
						
						console.log(rr);

						mySession.nowlistpages = (rr||"-1") + "|" + "首页" + "|" + "index";
						mySession.nowlistpage = 1;
						console.log(mySession.nowlistpages);
						return true
						
					}
				}
			}
		},
		typeflag: {
			loader: function(args) {
				//addtypelist('<div align="center" class="list-block"><img src="img/logo.png"/><br>类型<br>正在加载...<div class="progress"></span></div>', 2);
				return {
					successfn: function() {
						ExView.workers.index.loader()
					}
				}
			},
			finder: function(args) {
var typelist=[{tid:5,title:"同人志全部",group:{name:"tongrenzhi",title:"同人志"}},{tid:1,title:"同人志漢化",group:{name:"tongrenzhi",title:"同人志"}},{tid:12,title:"同人志日語",group:{name:"tongrenzhi",title:"同人志"}},{tid:2,title:"CG畫集",group:{name:"tongrenzhi",title:"同人志"}},{tid:3,title:"Cosplay",group:{name:"tongrenzhi",title:"同人志"}},{tid:6,title:"單行本全部",group:{name:"danhangben",title:"單行本"}},{tid:9,title:"單行本漢化",group:{name:"danhangben",title:"單行本"}},{tid:13,title:"單行本日語",group:{name:"danhangben",title:"單行本"}},{tid:7,title:"雜誌全部",group:{name:"zazhi",title:"雜誌"}},{tid:10,title:"雜誌單篇漢化",group:{name:"zazhi",title:"雜誌"}},{tid:14,title:"雜誌日語",group:{name:"zazhi",title:"雜誌"}}];
				addtypelist({
					tid: '',
					listfn: 'ExView.workers.index.loader({turnpage:1,front:1})',
					title: '首页',
					img: pluginfo(args.plugin).icon,
					group: {
						name: "daohang",
						title: "导航"
					},
					content: '首页'
				});
				typelist.forEach(function(item){
					addtypelist(obj_contact(item,{img:pluginfo(args.plugin).icon}));
				});
				return false;
			},
		},
		listflag: {
			loader: function(args) {
				return {
					url: pluginfo(args.plugin).apihost +"albums-index-"+(parseInt(args.page)>1?("page-"+args.page+"-"):"") +"cate-"+ args.keyword + ".html",
					method: "GET",
					timeout: 120,
					nativerequest: pluginfo(args.plugin).nativeres,
header:{"User-Agent":"ExView","Referer":pluginfo(args.plugin).apihost},	
					successfn: function(result, header) {
						if (result) {
							ExView.workers.list.countfinder(obj_contact(args, {
								result: result,
								header: header
							}));
							args.successfn && args.successfn({
								result: result,
								header: header
							})
						} else {
							ExView.fw.hidePreloader();
							mySession.isloading = 0;
							ExView.fw.alert('【' + mySession.nowlistname + '】<br>获取失败！', "ExView")
						}
					},
					showinfo: {
						text: '正在加载...' + ((args.page > 1) ? '<br>第' + args.page + '页' : ''),
						name:'【' + mySession.nowlistname + '】',
						title: mySession.nowlistname,
						img: mySession.nowlistimg
					}/*,
		encoding:"gb2312"*/
				}
			},
			finder: function(args) {
				return {
					reg: plugfns(args.plugin).pagerule,
					str: getresult(args.result),
					find: plugfns(args.plugin).pagefind,
					successfn: function(rr) {
						if (rr) {
							plugfns(args.plugin).pagedeal(rr)
						} else {
							addcardlist('<div align="center" class="list-block"><img src="img/logo.png"/><br>没有内容</div>', 1)
						}
					}
				}
			},
			countloader: function(args) {
				return false
			},
			countfinder: function(args) {

				return{
					reg: plugfns(args.plugin).pagecountrule,
					str: args.result,
					find: plugfns(args.plugin).pagecountfind,
					successfn: function(rr) {
						
						console.log(rr);

						mySession.nowlistpages = (rr||"-1") + "|" + args.keyword + "|" + "list";
						mySession.nowlistpage = 1;
						console.log(mySession.nowlistpages);
						return true
						
					}
				}				
				
				
			}
		},
		searchflag: {
			loader: function(args) {
				return {
					url: pluginfo(args.plugin).apihost + "albums-index-page-"+(args.page||1)+"-sname-"+args.keyword+".html",
					method: "GET",
					timeout: 120,	
					nativerequest: pluginfo(args.plugin).nativeres,
header:{"User-Agent":"ExView","Referer":pluginfo(args.plugin).apihost},						
					successfn: function(result, header) {
						if (result) {
							if (!args.multsearch) {
								ExView.workers.search.countfinder(obj_contact(args, {
									result: result,
									header: header
								}));
								setnowlistname("搜索【" + args.keyword + "】")
							}
							args.successfn && args.successfn({
								result: result,
								header: header
							})
						} else {
							if (!args.multsearch) {
								ExView.fw.hidePreloader();
								mySession.isloading = 0;
								ExView.fw.alert('【' + args.keyword + '】<br>获取搜索结果失败！', "ExView")
							} else {
								args.multsearch();
							}
						}
					},
					showinfo: {
						text: '正在搜索...' + ((args.page > 1) ? '<br>第' + args.page + '页' : ''),
						name:'【' + args.keyword + '】',
						title: "搜索"
					}/*,
		encoding:"gb2312"*/
				}
			},
			finder: function(args) {

				return {
					reg: plugfns(args.plugin).pagerule,
					str: getresult(args.result),
					find: plugfns(args.plugin).pagefind,
					successfn: function(rr, arr, i) {
						
						console.log(rr);
						if (rr) {
							plugfns(args.plugin).pagedeal(rr, args)
						} else {
							if (!args.multsearch) {
								/*mySession.nowlistpages = "-1" + "|" + args.keyword + "|" + "search";
								mySession.nowlistpage = 1;
								console.log(mySession.nowlistpages);*/
								addcardlist('<div align="center" class="list-block"><img src="img/logo.png"/><br>没有内容</div>', 1)
							} else {
								args.multsearch();
							}
						}
					}
				}
			},
			countloader: function(args) {
				return false
			},
			countfinder: function(args) {
				return{
					reg: plugfns(args.plugin).pagecountrule,
					str: args.result,
					find: plugfns(args.plugin).pagecountfind,
					successfn: function(rr) {
						
						console.log(rr);

						mySession.nowlistpages = (rr||"-1") + "|" + args.keyword + "|" + "search";
						mySession.nowlistpage = 1;
						console.log(mySession.nowlistpages);
						return true
						
					}
				}					
			}
		},
		contentflag: {
			loader: function(args) {
				return {
					url: pluginfo(args.plugin).apihost + "photos-index-aid-"+args.pid+".html",
					method: "GET",
					timeout: 120,
					nativerequest: pluginfo(args.plugin).nativeres,
header:{"User-Agent":"ExView","Referer":pluginfo(args.plugin).apihost},						
					successfn: function(result, header) {
/*mySession.contentinfo = {
							pid: args.pid
						};*/
						if (result) {
							args.successfn && args.successfn({
								result: result,
								header: header
							})
						} else {
							if (!args.checkupdate) {
								ExView.fw.hidePreloader();
								mySession.isloading = 0;
								ExView.fw.alert("内容页获取失败！", "ExView");
							}
						}
					},
					showinfo: {
						text: '正在加载内容页...',
						title: "内容页",
						name:getlistname(args.pid),
						img: getlistimg(args.pid)
					}
				}
			},
			finder: function(args) {
				return {
					reg: plugfns(args.plugin).pagecountrule,
					str: args.result,
					find: plugfns(args.plugin).pagecountfind,
					successfn: function(rr) {
						
						rr=rr||1;
						
						console.log(typeof(rr));
						if (rr) {
							
if(!args.checkupdate){		
var result=[];	
for(var i=0;i<parseInt(rr);i++){
							result[i]=additemlist({
								id: i,
								newest: (args.newest && i == 0),
								pid: args.pid,
								cid: i+1,
								title: "第"+(i+1)+"话",
								count: parseInt(rr),
								reverse: 0
							})	
}			

return result;
}else{
	return {pid:args.pid,cid:rr,title:"第"+rr+"话"};
}							
						} else {
							if (!args.checkupdate) {
								ExView.fw.hidePreloader();
								mySession.isloading = 0;
								ExView.fw.alert("内容页获取失败！", "ExView")
							}
						}
					},
					afterfn: function() {
						if (!args.checkupdate) {
							ExView.workers.content.infofinder(args)
						}
					}
				}
			},
			infoloader: function(args) {
				return false
			},
			infofinder: function(args) {
				console.log((args));
				return {
					reg: /class="userwrap">(.*?)<div\s*id="bodywrap"/g,
					str: getresult(args.result),
					find: "$1" ,
					successfn: function(rr, arr, i, result) {
						//alert(rr);
						console.log(JSON.stringify(rr));
						var img = getstr(/data-original="((?!\").*?)"/,rr);
						var title = getstr(/<h2>((?!<).*?)<\/h2>/,rr);
						var author = getstr(/lazy"><p>((?!<).*?)<\/p>/,rr);
						var type = getstr(/<label>分類：((?!<).*?)<\/label>/,rr).trim();
						var description = getstr(/<p>簡介：(.*?)<\/p>/,rr).trim();
						setlistpic({
							name: title,
							img: img,
							added: args.data,
							description: "<p>" + "【类型】" + type + "<br>【作者】"+author+ (description?("<br>"+"【简介】" + gettext(description)):"") + "</p>",
							comment: 0,
							preview: 1,
							tags: gettag(title)+gettag(type)+gettag(author)
						});
						return true
					}
				}
			}
		},
		parseflag: {
			loader: function(args) {
				return {
					url: pluginfo(args.plugin).apihost + "photos-index-page-"+args.cid+"-aid-"+args.pid+".html",
					method: "GET",
					timeout: 120,
					nativerequest: pluginfo(args.plugin).nativeres,
header:{"User-Agent":"ExView","Referer":pluginfo(args.plugin).apihost},						
					successfn: function(result, header) {
						args.successfn && args.successfn({
							result: result,
							header: header
						})
					},
					showinfo: {
						text: '正在加载图片信息...',
						title: "图片",
						name:getlistname(args.pid),
						img: getlistimg(args.pid)
					}
				}
			},
			finder: function(args) {
				console.log(args);
				return {
					reg: /<div class="pic_box"><a href="\/photos-view-id-(\d+).html">/g,
					str: getresult(args.result),
					find: "$1",
					successfn: function(rr,arr,i,result) {
						if (array_count(result)) {
							var source = result;
							source=source.map(function(ccid){
								return getpageload(pluginfo(args.plugin).apihost+"photos-view-id-"+ccid+".html",(args.plugin||mySession.nowplugin),{"cacheheader":{"User-Agent":"ExView","Referer":pluginfo(args.plugin).apihost},nativeres:pluginfo(args.plugin).nativeres});
							})
							console.log(source);
							if (args.download) {
								chapterpredownload({
									source: source,
									download: args.download,
									plugin: args.plugin
								});
								//chapterpredownload(pagesjson, args.download,args.plugin);
							} else {
								chapterviewer({
									source: source,
									type: "image",
									startindex: (args.startindex || 0),
									lazyload: pluginfo(args.plugin).lazyload,
									zoom: true,
									title: args.title
								});
								//ExView.views.picviewer(pagesjson, (args.startindex ? args.startindex : 0), ((pluginfo(args.plugin).lazyload == true || pluginfo(args.plugin).lazyload == 'on') ? true : false), 'light', 'standalone', true, args.title)
							}
						} else {
							if(!args.download){
								ExView.fw.hidePreloader();
								mySession.isloading = 0;
								ExView.fw.alert("图片信息获取失败！","ExView");						
							}else{
									chapterpredownload({
										error: "解析错误！",
										download: args.download,
										plugin: args.plugin
									});					
							}
						}
						return true
					}
				}
			}
		},
		commentflag: {
			loader: false,
			finder: false
		},
		previewflag: {
			loader: function(args) {
				//alert(JSON.stringify(args));
				return {
					url: pluginfo(args.plugin).apihost + "photos-index"+(parseInt(args.page)>1?("-page-"+args.page):"")+"-aid-"+args.pid+".html",
					method: "GET",
					data: "",
					timeout: 120,
					nativerequest: pluginfo(args.plugin).nativeres,
header:{"User-Agent":"ExView","Referer":pluginfo(args.plugin).apihost},	
					successfn: function(result, header) {
/*mySession.contentinfo = {
							pid: args.pid
						};*/
						if (result) {
							args.successfn && args.successfn({
								result: result,
								header: header
							})
						} else {
							ExView.fw.hidePreloader();
							mySession.isloading = 0;
							ExView.fw.alert("预览信息获取失败！", "ExView");
							myContent.previewloading = 1;
							var t=getTimeNow();
							$$("#previewpage").append('<div class="previewerrorinfo_'+t+'" style="width:100%;text-align:center;"><a class="button button-fill bg-red" href="javascript:void(0);">重试加载第'+args.page+'页</a></div>');	
							$$('.previewerrorinfo_'+t).on("click",function(){
								$$('.previewerrorinfo_'+t).remove();
								ExView.modules.listpreview(args);
							});							
						}
					},
					errorfn:function(){
							ExView.fw.hidePreloader();
							mySession.isloading = 0;
							ExView.fw.alert("预览信息获取失败！", "ExView")						
							myContent.previewloading = 1;
							var t=getTimeNow();
							$$("#previewpage").append('<div class="previewerrorinfo_'+t+'" style="width:100%;text-align:center;"><a class="button button-fill bg-red" href="javascript:void(0);">重试加载第'+args.page+'页</a></div>');	
							$$('.previewerrorinfo_'+t).on("click",function(){
								$$('.previewerrorinfo_'+t).remove();
								ExView.modules.listpreview(args);
							});
					},
					canclefn:function(){
							ExView.fw.hidePreloader();
							mySession.isloading = 0;				
							myContent.previewloading = 1;
							var t=getTimeNow();
							$$("#previewpage").append('<div class="previewerrorinfo_'+t+'" style="width:100%;text-align:center;"><a class="button button-fill bg-red" href="javascript:void(0);">重试加载第'+args.page+'页</a></div>');	
							$$('.previewerrorinfo_'+t).on("click",function(){
								$$('.previewerrorinfo_'+t).remove();
								ExView.modules.listpreview(args);
							});
					},
					showinfo: {
						text: '正在获取预览信息...',
						title: "预览页",
						name:getlistname(args.pid),
						img: getlistimg(args.pid)
					}
				}
			},
			finder: function(args) {
				console.log(args);
				return {
					reg: /<div class="pic_box"><a.*?photos-view-id-(\d+).html".*?data-original="((?!<).*?)"/g,
					str: getresult(args.result),
					find: "$1{{separator}}$2",
					successfn: function(rr, arr, i, result) {
						rr = rr.split("{{separator}}");
						var imgurl = rr[1];
						var pageurl = rr[0];
						myContent.preview["Page_" + (args.page || 1)].push({
							imgurl: imgurl,
							pageurl: pluginfo(args.plugin).apihost+"photos-view-id-"+pageurl+".html"
						})
					},
					beforefn: function() {
						myContent.preview =myContent.preview||[];
						if (myContent.preview["Page_" + (args.page || 1)] === undefined) {
							myContent.preview["Page_" + (args.page || 1)] = new Array()
						}
					}
				}
			},
			more: function(args) {
				return function() {
					if (!myContent.previewloading && parseInt(args.page || 1) < myContent.items.length) {
						myContent.previewloading = 1;
						ExView.modules.listpreview(obj_contact(args, {
							page: parseInt(args.page || 1) + 1,
							callback: function(key) {
								var content = ExView.modules.previewpage.add(key);
								//alert(content);
								$$("#previewpage").append(content);
								$$(".previewpage-content").css("zoom", parseFloat($$(".previewpage-content").css("zoom")));
								myContent.previewloading = 0;
							}
						}));
					}


				}
			}
		},
		pageimgflag: {
			parser: function(args){//[pagedom,pageurl,url,result,loadimgurl]
				//alert(args.url);
				//alert(getresult(args.result));
				return {
					reg: /class="posselect"><img src="((?!").*?)"/g,
					str: getresult(args.result),
					find: "$1",
					successfn: function(rr) {
						//rr = ((rr.substr(0, 2) == "//") ? ("https:" + rr) : rr);
						//alert(rr);
						rr=getimgload(rr,args.plugin,{"cacheheader":{"User-Agent":"ExView","Referer":pluginfo(args.plugin).apihost},nativeres:pluginfo(args.plugin).nativeres});
						console.log("xxx:"+rr);
						args.loadimgurl(rr);
					}
				}				
			}
		},
		updateflag: {
			loader: function(args) {
				return {
					url: pluginfo(args.plugin).apihost+(parseInt(args.page)>1?"albums-index-page-"+args.page+".html":""),
					method: "GET",
					timeout: 120,
					nativerequest: pluginfo(args.plugin).nativeres,
header:{"User-Agent":"ExView","Referer":pluginfo(args.plugin).apihost},						
					successfn: function(result, header) {
						args.successfn && args.successfn({
							result: result,
							header: header
						})
					}/*,
		encoding:"gb2312"*/
				}
			},
			finder: function(args) {

				return {
					reg: plugfns(args.plugin).pagerule,
					str: getresult(args.result),
					find: plugfns(args.plugin).pagefind,
					successfn: function(rr) {
						console.log(JSON.stringify(rr));
						if (rr) {
							plugfns(args.plugin).pagedeal(rr, args)
						}
					}
				}
			}
		},
		hotflag: {
			loader: function(args) {
				return {
					url: pluginfo(args.plugin).apihost +"albums-index-"+(parseInt(args.page)>1?("page-"+args.page+"-"):"") +"cate-3.html",
					method: "GET",
					timeout: 120,
					nativerequest: pluginfo(args.plugin).nativeres,
header:{"User-Agent":"ExView","Referer":pluginfo(args.plugin).apihost},						
					successfn: function(result, header) {
						args.successfn && args.successfn({
							result: result,
							header: header
						})
					}/*,
		encoding:"gb2312"*/
				}
			},
			finder: function(args) {

				return {
					reg: plugfns(args.plugin).pagerule,
					str: getresult(args.result),
					find: plugfns(args.plugin).pagefind,
					successfn: function(rr) {
						console.log(JSON.stringify(rr));
						if (rr) {
							plugfns(args.plugin).pagedeal(rr, args)
						}
					}
				}
			}
		}
	},
	fns: {
		pagecountrule: />(\d+)<\/a>\s*<span\s*class="next"/g,
		pagecountfind: "$1",		
		pagerule: /<li class="li\s*gallary_item">(.*?)<div\s*class="pic_ctl">/g,
		pagefind: "$1",
		pagedeal: function(rr, args) {
			args = args || {};
			
			
			var pid=getstr(/photos-index-aid-(\d+).html"/,rr);
			var title=getstr(/alt="((?!\").*?)"/,rr);
			var name=title+"【"+getstr(/(\d+)張照片/,rr)+"P】";
			var img=getstr(/data-original="((?!\").*?)"/,rr);
			var stitle=getstr(/創建於([\d,\-]+)/,rr);
			var content="【"+getstr(/(\d+)張照片/,rr)+"P】";
			//alert([pid,img,status,title,author,type,newest,update]);
			//return false;
			if (args.multupdate) {
				args.multupdate(obj_contact(args, {
					pid: pid,
					img: img,
					title: title,
					content: content
				}));
				return false;
			}
			if (args.multhot) {
				args.multhot(obj_contact(args, {
					pid: pid,
					img: img,
					title: title,
					content: content
				}));
				return false;
			}
			if (args.multsearch) {
				args.multsearch(obj_contact(args, {
					pid: pid,
					img: img,
					title: title,
					content: content
				}));
				return false;
			}
			addcardlist({
				pid: pid,
				title: title,
				name:   name ,
				img: img,
				content: "",
				stitle: stitle,
				comment: 0,
				preview: 1,
				extrabutton: ''
			});
		}
	}
})