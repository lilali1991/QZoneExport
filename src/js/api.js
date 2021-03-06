/**
 * QQ空间Rest API配置
 */
const QZone_URLS = {

    /** 个人统计 */
    MAIN_INFO_URL: "https://user.qzone.qq.com/proxy/domain/r.qzone.qq.com/cgi-bin/main_page_cgi",

    /** 说说列表URL */
    MESSAGES_LIST_URL: "https://user.qzone.qq.com/proxy/domain/taotao.qq.com/cgi-bin/emotion_cgi_msglist_v6",

    /** 说说详情URL */
    MESSAGES_DETAIL_URL: "https://user.qzone.qq.com/proxy/domain/taotao.qq.com/cgi-bin/emotion_cgi_msgdetail_v6",

    /** 说说评论列表URL */
    MESSAGES_COMMONTS_URL: "https://user.qzone.qq.com/proxy/domain/taotao.qq.com/cgi-bin/emotion_cgi_msgdetail_v6",

    /** 日志列表URL */
    BLOGS_LIST_URL: "https://user.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/blognew/get_abs",

    /** 日志评论列表URL */
    BLOGS_COMMENTS_URL: "https://user.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/blognew/get_comment_list",

    /** 日志详情URL */
    BLOGS_INFO_URL: "https://user.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/blognew/blog_output_data",

    /** 私密日志列表URL */
    DIARY_LIST_URL: "https://user.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/privateblog/privateblog_get_titlelist",

    /** 私密日志详情URL */
    DIARY_INFO_URL: "https://user.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/privateblog/privateblog_output_data",

    /** 相册路由URL */
    PHOTOS_ROUTE_URL: 'https://user.qzone.qq.com/proxy/domain/route.store.qq.com/GetRoute',

    /** 相册列表URL */
    ALBUM_LIST_URL: 'https://user.qzone.qq.com/proxy/domain/photo.qzone.qq.com/fcgi-bin/fcg_list_album_v3',

    /** 相册评论列表URL */
    ALBUM_COMMENTS_URL: 'https://user.qzone.qq.com/proxy/domain/app.photo.qzone.qq.com/cgi-bin/app/cgi_pcomment_xml_v2',

    /** 相片列表URL */
    IMAGES_LIST_URL: 'https://h5.qzone.qq.com/proxy/domain/photo.qzone.qq.com/fcgi-bin/cgi_list_photo',

    /** 相片评论列表 */
    IMAGES_COMMENTS_URL: 'https://user.qzone.qq.com/proxy/domain/app.photo.qzone.qq.com/cgi-bin/app/cgi_pcomment_xml_v2',

    /** 好友列表URL */
    FRIENDS_LIST_URL: "https://h5.qzone.qq.com/proxy/domain/r.qzone.qq.com/cgi-bin/tfriend/friend_show_qqfriends.cgi",

    /** 好友资料 */
    QZONE_USER_INFO_URL: "https://h5.qzone.qq.com/proxy/domain/base.qzone.qq.com/cgi-bin/user/cgi_userinfo_get_all",

    /** 好友添加时间 */
    USER_ADD_TIME_URL: "https://user.qzone.qq.com/proxy/domain/r.qzone.qq.com/cgi-bin/friendship/cgi_friendship",

    /** 好友亲密度 */
    INTIMACY_URL: "https://user.qzone.qq.com/proxy/domain/r.qzone.qq.com/cgi-bin/main_page_cgi",

    /** 留言板列表URL */
    BOARD_LIST_URL: 'https://user.qzone.qq.com/proxy/domain/m.qzone.qq.com/cgi-bin/new/get_msgb',

    /** 视频列表URL */
    VIDEO_LIST_URL: 'https://h5.qzone.qq.com/proxy/domain/taotao.qq.com/cgi-bin/video_get_data',

    /** 我的收藏 */
    FAVORITE_LIST_URL: 'https://h5.qzone.qq.com/proxy/domain/fav.qzone.qq.com/cgi-bin/get_fav_list',

    /** 点赞数目 */
    LIKE_COUNT_URL: 'https://user.qzone.qq.com/proxy/domain/r.qzone.qq.com/cgi-bin/user/qz_opcnt2',

    /** 点赞数目 */
    LIKE_COUNT_URL_88: 'https://rsh.qzone.qq.com/cgi-bin/user/qz_opcnt2_sh',

    /** 点赞列表 */
    LIKE_LIST_URL: 'https://user.qzone.qq.com/proxy/domain/users.qzone.qq.com/cgi-bin/likes/get_like_list_app'
};

var API = {

};

/**
 * 工具类
 */
API.Utils = {

    /**
     * 转换为ArrayBuffer
     */
    toArrayBuffer(str) {
        let buf = new ArrayBuffer(str.length)
        let view = new Uint8Array(buf)
        for (let i = 0; i !== str.length; ++i) {
            view[i] = str.charCodeAt(i) & 0xFF
        }
        return buf;
    },

    /**
     * 根据年月份分组数据
     * @param {array} data 数据集合
     * @param {string} timeField 时间字段名
     */
    groupedByTime(data, timeField) {
        data = data || [];
        let groupData = new Map();
        for (const item of data) {
            let time = item[timeField];
            let date = null;
            if (typeof (time) === 'string') {
                date = new Date(time);
            } else {
                date = new Date(time * 1000);
            }
            if (!date) {
                date = new Date('1970-01-01');
            }
            let yearTempData = groupData.get(date.getFullYear()) || new Map();
            let monthTempData = yearTempData.get(date.getMonth() + 1) || [];
            monthTempData.push(item);
            yearTempData.set(date.getMonth() + 1, monthTempData);
            groupData.set(date.getFullYear(), yearTempData);
        }
        return groupData;
    },

    /**
     * 获取文件类型
     * @param {string} url 文件URL
     * @param {funcation} doneFun 回调函数
     */
    getMimeType(url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            // 超时设置
            xhr.timeout = (Qzone_Config.Common.autoFileSuffixTimeOut || 15) * 1000;
            xhr.onreadystatechange = function () {
                if (2 == xhr.readyState) {
                    let contentType = xhr.getResponseHeader('content-type') || xhr.getResponseHeader('Content-Type') || '';
                    let suffix = contentType.split('/')[1];
                    if ('octet-stream' === suffix) {
                        let disposition = xhr.getResponseHeader('content-disposition') || xhr.getResponseHeader('Content-Disposition') || '';
                        suffix = disposition.split('=')[1].split('.')[1];
                    }
                    var ret = {
                        suffix: suffix,
                        size: xhr.getResponseHeader('content-length') || xhr.getResponseHeader('Content-Length') || 0
                    };
                    this.abort();
                    resolve(ret);
                }
            }
            xhr.onerror = function (e) {
                reject(e);
            }
            xhr.ontimeout = function (e) {
                this.abort();
                reject(e);
            }
            xhr.send();
        });
    },

    /**
     * 获取文件后缀名
     * @param {string} url 文件地址
     */
    async getFileSuffix(url) {
        return await this.getMimeType(url).then((data) => {
            let suffix = data.suffix
            if (suffix) {
                return '.' + suffix;
            }
            return '';
        }).catch((e) => {
            console.error('获取文件类型异常', url, e);
            return '';
        });
    },


    /**
     * 根据配置获取文件后缀名
     * @param {string} url 文件地址
     */
    async autoFileSuffix(url) {
        if (!Qzone_Config.Common.isAutoFileSuffix) {
            return '';
        }
        url = API.Utils.makeDownloadUrl(url, true);
        return API.Utils.getFileSuffix(url);
    },

    /**
     * 写入内容到文件
     * @param {string} content 内容
     * @param {string} filepath FileSystem路径
     */
    writeText(content, filepath) {
        return new Promise(function (resolve, reject) {
            QZone.Common.Filer.write(filepath, { data: content, type: "text/plain", append: true }, (fileEntry) => {
                resolve(fileEntry);
            }, (error) => {
                reject(error);
            });
        });
    },

    /**
     * 写入内容到Excel
     * @param {string} buffer 内容
     * @param {string} filepath FS的文件路径
     */
    writeExcel(buffer, filepath) {
        return new Promise(function (resolve, reject) {
            QZone.Common.Filer.write(filepath, { data: buffer }, (fileEntry) => {
                resolve(fileEntry);
            }, (err) => {
                reject(err);
            });
        });

    },

    /**
     * 下载并写入文件到FileSystem
     * @param {string} url 图片URL
     * @param {string} path FileSystem文件路径
     */
    writeFile(url, path) {
        return new Promise(async function (resolve, reject) {
            await API.Utils.send(url, 'blob').then((xhr) => {
                let res = xhr.response;
                QZone.Common.Filer.write(path, { data: res, type: "blob" }, (fileEntry) => {
                    resolve(fileEntry);
                }, (e) => {
                    reject(e);
                });
            }).catch((e) => {
                reject(e);
            })
        });
    },

    /**
     * 切换根目录
     */
    siwtchToRoot() {
        return new Promise(async function (resolve, reject) {
            QZone.Common.Filer.cd('/', (root) => {
                resolve(root);
            }, (e) => {
                reject(e);
            });
        });
    },

    /**
     * 压缩
     * @param {string} root 文件或文件夹路径
     * @param {function} doneFun 
     * @param {function} failFun 
     */
    Zip(root) {
        return new Promise(async function (resolve, reject) {
            let zipOneFile = function (entry) {
                let newName = encodeURIComponent(entry.name);
                let fullPath = entry.fullPath.replace(entry.name, newName);
                QZone.Common.Filer.open(fullPath, (f) => {
                    let reader = new FileReader();
                    reader.onload = function (event) {
                        QZone.Common.Zip.file(entry.fullPath, event.target.result, { binary: true });
                    }
                    reader.readAsArrayBuffer(f);
                }, reject);
            };

            (function (path) {
                let cl = arguments.callee;
                QZone.Common.Filer.ls(path, (entries) => {
                    var i = 0;
                    for (i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        if (entry.isDirectory) {
                            QZone.Common.Zip.folder(entry.fullPath);
                            cl(path + entry.name + '/');
                        } else {
                            zipOneFile(entry);
                        }
                    }
                    resolve();
                }, reject);
            })(root);
        });
    },

    /**
     * 发送请求
     * @param {string} url 
     * @param {string} responseType 
     * @param {integer} timeout 超时秒数 
     */
    send(url, responseType, timeout) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("GET", url);
            if (responseType) {
                request.responseType = responseType;
            }
            // 允许跨域
            request.withCredentials = true;
            // 超时秒数
            if (timeout) {
                request.timeout = timeout * 1000;
            }
            request.onload = function () {
                resolve(this);
            };
            request.onerror = function (error) {
                reject(error);
                this.abort();
            };
            request.ontimeout = function (error) {
                reject(error);
                this.abort();
            };
            request.send();
        });
    },

    /**
     * 下载文件
     * @param {string} url 
     */
    downloadFile(url) {
        return API.Utils.send(url, 'blob');
    },

    /**
     * GET 请求
     * @param {string} url 请求URL
     */
    get(url, params) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                type: 'GET',
                data: params,
                // async: false,
                // cache: false,
                retries: Qzone_Config.Common.listRetryCount,// 重试次数
                retryInterval: Qzone_Config.Common.listRetrySleep * 1000,// 每次重试间隔秒数
                success: function (result) {
                    resolve(result);
                },
                error: function (xhr, status, error) {
                    if (this.retries > 0) {
                        this.retries--;
                        // 指定秒数后继续请求
                        let scope = this;
                        setTimeout(function () {
                            console.warn('请求接口异常，正在尝试重试', url, params, scope.retries);
                            $.ajax(scope);
                        }, this.retryInterval);
                        return;
                    }
                    console.info('重试次数已用完，准备回调');
                    reject(error);
                }
            });
        });
    },

    /**
     * 获取URL参数值
     * @param {string} name 
     */
    getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    },

    /**
     * 获取URL参数值
     * @param {string} url 
     * @param {string} name 
     */
    getUrlParam(url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = url.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    },

    /**
     * 获取URL参数值
     * @param {string} url 
     */
    toParams(url) {
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
            reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
            arr_url = reg_url.exec(url),
            ret = {};
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1], result;
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2];
            }
        }
        return ret;
    },

    /**
     * 通过参数构建URL
     * @param {string} url 
     * @param {object} params 
     */
    toUrl(url, params) {
        let paramsArr = [];
        if (params) {
            Object.keys(params).forEach(item => {
                paramsArr.push(item + '=' + params[item]);
            })
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArr.join('&');
            } else {
                url += '&' + paramsArr.join('&');
            }

        }
        return url;
    },

    /**
     * 获得一个Cookie值
     * @param {string} name 
     */
    getCookie(name) {
        if (location.protocol === 'chrome-extension:') {
            chrome.cookies.get({
                url: "https://user.qzone.qq.com",
                name: name
            }, (res) => {
                console.info("cookie", name, res);
            });
        }
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }
    },

    /**
     * 从 HTML 页面找到 token 保存起来
     */
    getQzoneToken() {
        $("script").each(function () {
            var t = $(this).text();
            t = t.replace(/\ /g, "");
            if (t.indexOf('window.g_qzonetoken') !== -1) {
                var qzonetokenM = /return"(\w*?)";/g;
                var qzonetoken = qzonetokenM.exec(t);
                if (qzonetoken != null && qzonetoken != '') {
                    QZone.Common.Config.token = qzonetoken[1];
                    return false;
                }
            }
        });
        return QZone.Common.Config.token;
    },

    /**
     * 获取QQ号
     */
    initUin() {
        // 获取目标QQ
        let rs = /\/user\.qzone\.qq\.com\/([\d]+)/.exec(window.location.href);
        if (rs) {
            // 获取登录QQ
            QZone.Common.Owner.uin = /\d.+/g.exec(API.Utils.getCookie('uin'))[0] - 0;
            QZone.Common.Target = {
                uin: rs[1] - 0,
                title: document.title,
                description: $('meta[name="description"]').attr("content"),
            }
        }
        return QZone.Common;
    },

    /**
     * 生成 g_tk
     * @param {string} url
     */
    initGtk(url) {
        var skey;
        url = url || window.location.href;
        if (url.indexOf("qzone.qq.com") > 0) {
            skey = API.Utils.getCookie("p_skey");
        } else {
            if (url.indexOf("qq.com") > 0) {
                skey = API.Utils.getCookie("skey") || API.Utils.getCookie("rv2");
            }
        }
        var hash = 5381;
        for (var i = 0, len = skey.length; i < len; ++i) {
            hash += (hash << 5) + skey.charAt(i).charCodeAt();
        }
        return QZone.Common.Config.gtk = hash & 2147483647;
    },

    /**
     * @param {integer} ms 毫秒
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    },

    /**
     * 生成一个UUID
     */
    newUid() {
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    /**
     * 生成一个简短的UUID
     * @param {integer} len 长度
     * @param {integer} radix 算法类型
     */
    newSimpleUid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4'; for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },

    /**
     * 替换文件名特殊符号
     *
     * @param {原名} name
     */
    filenameValidate(name) {
        var reg = new RegExp(/'|#|&| |!|\\|\/|:|\?|"|<|>|\*|\|/g);
        name = name.replace(reg, "_");
        return name;
    },

    /**
     * 按照长度给指定的数字前面补0
     * @param {int} num 
     * @param {int} length 
     */
    prefixNumber(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    },

    /**
     * 转码
     * @param {string} b 
     */
    decode(b) {
        return b && b.replace(/(%2C|%25|%7D)/g, function (b) {
            return unescape(b);
        })
    },

    /**
     * 获取超链接
     */
    getLink(url, title, type) {
        // 默认HTML超链接
        let res = "<a href='{url}' target='_blank'>{title}</a>";
        switch (type) {
            case 'MD':
                res = '[{title}]({url})'.format(title, url);
                break;
            default:
                break;
        }
        return res.format({
            url: url,
            title: title
        });
    },

    /**
     * 转换@内容
     * @param {string} contet @内容
     * @param {string} type 转换类型，默认TEXT,可选HTML,MD
     */
    formatMention(contet, type) {
        if (!contet) {
            return contet;
        }
        const format = (item) => {
            var result = "<a href='https://user.qzone.qq.com/{uin}' target='_blank'>@{name}</a>".format(item);
            switch (type) {
                case 'MD':
                    result = '[@{name}](https://user.qzone.qq.com/{uin})'.format(item);
                    break;
            }
            return result;
        }
        if (typeof contet === 'object') {
            return format(contet);
        }
        return contet = contet.replace(/@\{uin:([^\}]*),nick:([^\}]*?)(?:,who:([^\}]*))?(?:,auto:([^\}]*))?\}/g, function (str, uin, name) {
            return format({
                uin: uin,
                name: name
            });
        })
    },

    /**
     * 转换表情内容
     * @param {string} contet 表情内容
     * @param {string} type 转换类型，默认TEXT,可选HTML,MD
     */
    formatEmoticon(contet, type) {
        if (!contet) {
            return contet;
        }

        // 替换无协议的链接
        contet = contet.replace(/src=\"\/qzone\/em/g, 'src=\"http://qzonestyle.gtimg.cn/qzone/em');

        // 转换emoji表情链接
        contet = contet.replace(/\[em\]e(\d+)\[\/em\]/gi, function (emoji, eid) {
            // 默认返回HMTL格式
            let res = "<img src='http://qzonestyle.gtimg.cn/qzone/em/e{0}.gif' >".format(eid);
            switch (type) {
                case 'MD':
                    res = '![](http://qzonestyle.gtimg.cn/qzone/em/e{0}.gif)'.format(eid);;
            }
            return res;
        });

        return contet;
    },

    /**
     * 替换URL链接
     * @param {string} contet URL
     * @param {string} type 转换类型，默认TEXT,可选HTML,MD
     */
    urlFormat(contet, type) {
        if (!contet) {
            return contet;
        }

        return contet = contet.replace(/(https|http|ftp|rtsp|mms)?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*/g, function (url) {
            switch (type) {
                case 'MD':
                    url = '[网页链接](' + url + ')';
                    break;
            }
            return url;
        })
    },

    /**
     * 转换HTML特殊字符
     */
    escHTML(content) {
        var l = { "&amp;": /&/g, "&lt;": /</g, "&gt;": />/g, "&#039;": /\x27/g, "&quot;": /\x22/g };
        for (var i in l) {
            content = content.replace(l[i], i);
        }
        return content;
    },

    /**
     * 获取分享来源标题
     */
    getURLTitle(item, index) {
        return item["url_title_" + index] || "";
    },

    /**
     * 获取评论数
     */
    getCommentCount(item) {
        return item.replies || item.reply_num || item.cmtnum || 0;
    },

    /**
     * 转换内容
     * @param {string} contet @内容
     * @param {string} type 转换类型，默认TEXT,可选HTML,MD
     * @param {boolean} isRt 是否是处理转发内容
     */
    formatContent(item, type, isRt) {
        if (typeof item === 'string') {
            // 转换特殊符号
            item = API.Utils.escHTML(item);
            // 转换话题
            item = API.Utils.formatTopic(item, type);
            // 转换表情
            item = API.Utils.formatEmoticon(item, type);
            // 转换@内容
            item = API.Utils.formatMention(item, type);
            return item;
        }
        var conlist = (isRt && item.rt_con && item.rt_con['conlist']) || item.conlist || [];
        var contents = [];
        var titleIndex = 0;
        for (let index = 0; index < conlist.length; index++) {
            let info = conlist[index];
            // 说说内容类型
            switch (info.type) {
                case 0:
                    info.custom_url = "http://user.qzone.qq.com/{uin}".format(info);
                    // 转换特殊符号
                    info.custom_display = API.Utils.escHTML(info.nick);
                    // 转换表情
                    info.custom_display = API.Utils.formatEmoticon(info.custom_display, type);
                    // 转换@内容
                    info.custom_display = API.Utils.formatMention({
                        uin: info.uin,
                        name: info.custom_display
                    }, type);
                    // 添加到内容数组
                    contents.push(info.custom_display);
                    break;
                case 1:
                    // 分享来源？
                    titleIndex++;
                    // 获取分享URL
                    info.url = API.Utils.escHTML(info.url);
                    // 获取分享提示
                    info.text = API.Utils.getURLTitle(item, titleIndex) || info.url;
                    // 获取Link
                    info.custom_display = API.Utils.getLink(info.url, info.text, type);
                    // 添加到内容数组
                    contents.push(info.custom_display)
                    break;
                case 2:
                    // 普通说说内容？
                    if (info.con) {
                        // 转换话题
                        info.custom_display = API.Utils.formatTopic(info.con, type);
                        // 转换表情
                        info.custom_display = API.Utils.formatEmoticon(info.custom_display, type);
                        // 替换换行符
                        switch (type) {
                            case 'MD':
                                info.custom_display = info.custom_display.replaceAll('\n', '\r\r\r\n');
                                break;
                            default:
                                info.custom_display = info.custom_display.replaceAll('\n', '<br>');
                                break;
                        }
                        // 添加到内容数组
                        contents.push(info.custom_display)
                    }
                    break;
            }
        }
        let content = contents.join("");
        content = content.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "");
        return content;
    },

    /**
     * 字节转换大小
     * @param {byte} bytes 
     */
    bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    },

    /**
     * 创建文件夹
     * @param {string} path 
     */
    createFolder(path) {
        return new Promise(function (resolve, reject) {
            QZone.Common.Filer.mkdir(path, false, (entry) => {
                resolve(entry);
            }, (e) => {
                reject(e);
            });
        });
    },

    /**
     * 消息通知
     */
    notification: (title, message) => {
        if (!window.Notification) {
            return;
        }
        Notification.requestPermission().then(function (permission) {
            if (permission === 'denied') {
                console.debug('用户拒绝通知');
                return;
            }
            if (permission === 'granted') {
                console.debug('用户允许通知');
                var notice_ = new Notification(title, {
                    body: message,
                    icon: API.Utils.getUserLogoUrl(QZone.Common.Target.uin || API.Utils.initUin().Target.uin),
                    requireInteraction: true
                });
                notice_.onclick = function () {
                    // 单击消息提示框，进入浏览器页面
                    window.focus();
                }
            }
        });
    },

    /**
     * 转换时间
     *  @param {integer} time 
     */
    formatDate(time) {
        return new Date(time * 1000).format('yyyy-MM-dd hh:mm:ss');
    },

    /**
     * 转换JSON对象
     *  @param {string} json 
     *  @param {string} jsonpKey 
     */
    toJson(json, jsonpKey) {
        json = json.replace(jsonpKey, "");
        json = json.replace(/\);$/, "");
        json = json.replace(/\)$/, "");
        return JSON.parse(json);
    },

    /**
     * 转换话题
     * @param {string} content 内容
     * @param {string} type 转换类型，默认HTML,MD
     */
    formatTopic(content, type) {
        return content.replace(/^(?!&)#((?:.|<br\/>)+?)(?!&)#/gi, function (t, e) {
            let url = 'http://rc.qzone.qq.com/qzonesoso/?search=' + encodeURIComponent(e);
            let res = '<a href="{0}" target="_blank">{1}</a>'.format(url, API.Utils.escHTML(t));
            switch (type) {
                case 'MD':
                    res = API.Utils.getLink(url, t, type);
                    break;
                default:
                    break;
            }
            return res;
        });
    },

    /**
     * 随机秒数
     */
    randomSeconds(min, max) {
        min = min - 0;
        max = max - 0;
        var range = max - min;
        var random = Math.random();
        var num = min + Math.round(random * range); //四舍五入
        return num;
    },

    /**
     * 获取用户空间的头像地址
     */
    getUserLogoUrl(uin) {
        return "http://qlogo{host}.store.qq.com/qzone/{uin}/{uin}/{size}".format({
            host: uin % 4 || 1,
            uin: uin,
            size: 100
        });
    },

    /**
     * 是否获取结束
     */
    hasNextPage(pageIndex, pageSize, total, list) {
        return list.length < total && pageIndex * pageSize < total;
    },

    /**
     * 替换URL
     * @param {string} url URL
     */
    toHttps(url) {
        url = url || '';
        if (url.indexOf('//p.qpimg.cn/cgi-bin/cgi_imgproxy') > -1) {
            // 替换图片代理URL为实际URL
            url = API.Utils.toParams(url)['url'] || url;
        }
        // 替换相对协议
        url = url.replace(/^\/\//g, 'https://');
        // 替换HTTP协议
        url = url.replace(/http:\//, "https:/");
        return url;
    },

    /**
     * 替换URL
     * @param {string} url URL
     */
    toHttp(url) {
        url = url || '';
        if (url.indexOf('//p.qpimg.cn/cgi-bin/cgi_imgproxy') > -1) {
            // 替换图片代理URL为实际URL
            url = API.Utils.toParams(url)['url'] || url;
        }
        // 替换相对协议
        url = url.replace(/^\/\//g, 'http://');
        // 替换HTTPS协议
        url = url.replace(/https:\//, "http:/");
        return url;
    },

    /**
     * 迅雷下载
     * @param {ThunderInfo} taskInfo 
     */
    downloadByThunder(taskInfo) {
        thunderLink.newTask(taskInfo);
    },

    /**
     * 浏览器下载(发送消息给背景页下载)
     * @param {BrowserTask} task
     */
    downloadByBrowser(task) {
        return new Promise(function (resolve, reject) {
            try {
                // 简单克隆
                let options = JSON.parse(JSON.stringify(task));

                // 删除多余属性
                delete options.id;
                delete options.dir;
                delete options.name;
                delete options.source;
                delete options.downloadState;

                chrome.runtime.sendMessage({
                    from: 'content',
                    type: 'download_browser',
                    options: options
                }, function (id) {
                    task.setId(id);
                    resolve(task);
                    console.debug('添加到下载器完成', id);
                })
            } catch (error) {
                reject(0)
            }
        });
    },

    /**
     * 获取浏览器下载管理器的列表
     * @param {string} state
     */
    getDownloadList(state) {
        return new Promise(function (resolve, reject) {
            try {
                chrome.runtime.sendMessage({
                    from: 'content',
                    type: 'download_list',
                    options: {
                        limit: 0,
                        orderBy: ['-startTime'],
                        state: state
                    }
                }, function (data) {
                    resolve(data)
                    console.debug('获取下载器列表完成', data);
                })
            } catch (error) {
                reject([])
            }
        });
    },

    /**
     * 根据ID获取指定下载项
     * @param {integer} downloadId
     */
    getDownloadById(downloadId) {
        return new Promise(function (resolve, reject) {
            try {
                chrome.runtime.sendMessage({
                    from: 'content',
                    type: 'download_list',
                    options: {
                        id: downloadId
                    }
                }, function (data) {
                    resolve(data)
                    console.debug('获取下载项完成', data);
                })
            } catch (error) {
                reject([])
            }
        });
    },

    /**
     * 恢复下载
     * @param {integer} downloadId
     */
    resumeDownload(downloadId) {
        return new Promise(function (resolve, reject) {
            try {
                chrome.runtime.sendMessage({
                    from: 'content',
                    type: 'download_resume',
                    downloadId: downloadId
                }, function (data) {
                    resolve(data)
                    console.debug('恢复下载完成', data);
                })
            } catch (error) {
                reject(0)
            }
        });
    },

    /**
     * Base64编码
     * @param {string} str 原始字符串
     */
    utf8ToBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    },

    /**
     * Base64解码
     * @param {string} str base64字符串
     */
    base64ToUtf8(str) {
        return decodeURIComponent(escape(atob(str)));
    },

    /**
     * 转换URL
     * @param {string} e 
     */
    trimDownloadUrl(url) {
        if (url && url.indexOf("?t=5&") > 0) {
            url = url.replace("?t=5&", "?")
        } else if (url && url.indexOf("?t=5") > 0) {
            url = url.replace("?t=5", "")
        } else if (url && url.indexOf("&t=5") > 0) {
            url = url.replace("&t=5", "")
        }
        return url
    },

    /**
     * 转换下载链接
     * @param {string} e 
     */
    makeDownloadUrl(url, isDownload) {
        var d = "save=1" + (isDownload ? '&d=1' : '');
        if (url && url.indexOf("?") > 0) {
            url = url + "&" + d
        } else if (url) {
            url = url + "?" + d
        }
        return this.trimDownloadUrl(url);
    },

    /**
     * 转换查看地址
     * @param {string} e 
     */
    makeViewUrl(url) {
        url = url.replace("?save=1&d=1", "")
        url = url.replace("&save=1&d=1", "")
        url = url.replace("?save=1", "")
        url = url.replace("&save=1", "")
        url = url.replace("?d=1", "")
        url = url.replace("&d=1", "")
        return url
    }
};

/**
 * QQ空间公共模块
 */
API.Common = {

    /**
     * 获取来源类型（该判断不严谨）
     */
    getSourceType(source) {
        if (source.tid) {
            return 'Messages';
        } else if (source.vid) {
            return 'Videos';
        } else if (source.phototype) {
            return 'Images';
        } else if (source.blogid) {
            return 'Blogs';
        }
        return 'Others';
    },

    /**
     * 获取用户统计信息
     */
    getUserStatistics() {
        let params = {
            "uin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "param": 16,
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        }
        return API.Utils.get(QZone_URLS.MAIN_INFO_URL, params);
    },

    /**
     * 获取点赞列表
     * @param {string} unikey 来源Key
     */
    getLikeInfo(unikey) {
        let params = {
            "fupdate": 1,
            "unikey": unikey,
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
        }
        let _like_info_url = QZone.Common.Owner.uin % 100 == 88 ? LIKE_COUNT_URL_88 : LIKE_COUNT_URL
        return API.Utils.get(_like_info_url, params);
    },

    /**
     * 获取点赞列表
     * @param {string} unikey 来源Key
     * @param {string} begin_uin 分页拉取，第一次为0，以后为上次数据最末uin的值
     */
    getLikeList(unikey, begin_uin) {
        let params = {
            "uin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "unikey": unikey,
            "begin_uin": begin_uin || 0,
            "query_count": 60,
            "if_first_page": begin_uin === 1 ? 1 : 0,//标识是否为首次请求 第一次请求为1，以后为0
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        }
        return API.Utils.get(QZone_URLS.LIKE_LIST_URL, params);
    },

    /**
     * 获取用户空间地址
     */
    getUserUrl(uin) {
        return 'https://user.qzone.qq.com/' + uin;
    },

    /**
     * 获取唤起QQ聊天地址
     * @param {string} uin 目标QQ号
     */
    getMessageUrl(uin) {
        return "tencent://message/?uin=" + uin;
    },

    /**
     * 获取用户空间超链接
     */
    getUserLink(uin, nickName, type) {
        return API.Utils.getLink(this.getUserUrl(uin), nickName, type);
    },

    /**
     * 获取用户空间超链接
     */
    getMessageLink(uin, nickName, type) {
        return API.Utils.getLink(this.getMessageUrl(uin), nickName, type);
    }
}

/**
 * 日志模块API
 */
API.Blogs = {

    getBlogMediaTypeTitle(e) {
        var t = {
            0: "日志中包含图片",
            13: "日志中包含视频"
        };
        for (var i in t) {
            if (API.Blogs.getEffectBit(e, i)) {
                return t[i];
            }
        }
        return null;
    },

    getBlogLabel(e) {
        var t = [["8", "审核不通过"], ["22", "审核中"], ["4", "顶"], ["21", "荐"], ["3", "转"], ["28", "转"], ["35", "转"], ["36", "转"]];
        var a = '';
        for (var o = 0; o < t.length; o++) {
            var n = t[o][0];
            if (n == 22) {
                continue;
            }
            if (API.Blogs.getEffectBit(e, n)) {
                a += '[{0}]'.format(t[o][1]);
                break;
            }
        }
        return a;
    },

    getEffectBit(e, t) {
        if (t < 0 || t > 63) {
            throw new Error("nBit param error")
        }
        if (t < 32) {
            return (e.effect || e.effect1) & 1 << t
        } else if (t < 64) {
            return e.effect2 & 1 << t
        }
    },

    /**
     * 获取日志UniKey，用于获取点赞数据
     * @param {string} blogid 日志ID
     */
    getUniKey(blogid) {
        return 'http://user.qzone.qq.com/{0}/blog/{1}'.format(QZone.Common.Target.uin, blogid);
    },

    /**
     * 获取日志列表
     *
     * @param {string} uin QQ号
     * @param {integer} page 第几页
     */
    getBlogs(page) {
        let params = {
            "hostUin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "blogType": "0",
            "cateName": "",
            "cateHex": "",
            "statYear": new Date().getFullYear(),
            "reqInfo": "7",
            "pos": page * Qzone_Config.Blogs.pageSize,
            "num": Qzone_Config.Blogs.pageSize,
            "sortType": "0",
            "source": "0",
            "rand": Math.random(),
            "ref": "qzone",
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "verbose": "1",
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        };
        return API.Utils.get(QZone_URLS.BLOGS_LIST_URL, params);
    },

    /**
     * 获取日志详情
     *
     * @param {integer} blogid 日志ID
     */
    getInfo(blogid) {
        let params = {
            "uin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "blogid": blogid,
            "styledm": "qzonestyle.gtimg.cn",
            "imgdm": "qzs.qq.com",
            "bdm": "b.qzone.qq.com",
            "mode": "2",
            "numperpage": "50",
            "timestamp": Math.floor(Date.now() / 1000),
            "dprefix": "",
            "inCharset": "gb2312",
            "outCharset": "gb2312",
            "ref": "qzone",
            "page": "1",
            "refererurl": "https://qzs.qq.com/qzone/app/blog/v6/bloglist.html#nojump=1&page=1&catalog=list"
        };
        return API.Utils.get(QZone_URLS.BLOGS_INFO_URL, params);
    },


    /**
     * 获取日志评论列表
     *
     * @param {string} uin QQ号
     * @param {integer} page 第几页
     */
    getComments(blogid, page) {
        let params = {
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "num": Qzone_Config.Blogs.Comments.pageSize,
            "topicId": (QZone.Common.Target.uin || API.Utils.initUin().Target.uin) + "_" + blogid,
            "start": page * Qzone_Config.Blogs.Comments.pageSize,
            "r": Math.random(),
            "iNotice": 0,
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "format": "jsonp",
            "ref": "qzone",
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        };
        return API.Utils.get(QZone_URLS.BLOGS_COMMENTS_URL, params);
    }

};

/**
 * 私密日记模块API
 */
API.Diaries = {

    /**
     * 获取私密日志列表
     *
     * @param {integer} page 第几页
     */
    getDiaries(page) {
        let params = {
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "vuin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "pos": page * Qzone_Config.Diaries.pageSize,
            "numperpage": Qzone_Config.Diaries.pageSize,
            "pwd2sig": "",
            "r": Math.random(),
            "fupdate": "1",
            "iNotice": "0",
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "format": "jsonp",
            "ref": "qzone",
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        };
        return API.Utils.get(QZone_URLS.DIARY_LIST_URL, params);
    },

    /**
    * 获取私密日志详情
    *
    * @param {string} uin QQ号
    * @param {integer} blogid 日志ID
    */
    getInfo(blogid) {
        let params = {
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "blogid": blogid,
            "pwd2sig": QZone.Common.Config.pwd2sig || "",
            "styledm": "qzonestyle.gtimg.cn",
            "imgdm": "qzs.qq.com",
            "bdm": "b.qzone.qq.com",
            "rs": Math.random(),
            "private": "1",
            "ref": "qzone",
            "refererurl": "https://qzs.qq.com/qzone/app/blog/v6/bloglist.html#nojump=1&catalog=private&page=1"
        };
        return API.Utils.get(QZone_URLS.DIARY_INFO_URL, params);
    }
};

/**
 * QQ好友模块API
 */
API.Friends = {

    /**
     * 获取QQ好友列表
     * @param {string} uin QQ号
     */
    getFriends() {
        let params = {
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "follow_flag": 0,//是否获取关注的认证空间
            "groupface_flag": 0,//是否获取QQ群组信息
            "fupdate": 1,
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        };
        return API.Utils.get(QZone_URLS.FRIENDS_LIST_URL, params);
    },

    /**
     * 获取QQ好友详情
     */
    getQzoneUserInfo() {
        let params = {
            "uin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "vuin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "fupdate": "1",
            "rd": Math.random(),
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        };
        // code = -3000 未登录
        // code = -4009 无权限
        return API.Utils.get(QZone_URLS.QZONE_USER_INFO_URL, params);
    },

    /**
     * 获取QQ好友添加时间
     * @param {string} 目标QQ号
     */
    getFriendshipTime(targetUin) {
        let params = {
            "activeuin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "passiveuin": targetUin,
            "situation": 1,
            "isCalendar": 1,
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        };
        return API.Utils.get(QZone_URLS.USER_ADD_TIME_URL, params);
    },

    /**
     * 获取好友亲密度
     * @param {string} 目标QQ号
     */
    getIntimacy(targetUin) {
        let params = {
            "uin": targetUin,
            "param": 15,
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        };
        return API.Utils.get(QZone_URLS.INTIMACY_URL, params);
    }
};

/**
 * 说说模块API
 */
API.Messages = {

    /**
     * 获取说说UniKey，用于获取点赞数据
     * @param {string} tid 说说ID
     */
    getUniKey(tid) {
        return 'http://user.qzone.qq.com/{0}/mood/{1}'.format(QZone.Common.Target.uin, tid);
    },

    /**
     * 获取说说列表
     * @param {integer} page 第几页
     */
    getMessages(page) {
        let params = {
            "uin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "ftype": 0,
            "sort": 0,
            "pos": page * Qzone_Config.Messages.pageSize,
            "num": Qzone_Config.Messages.pageSize,
            "replynum": 100,
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "callback": "_preloadCallback",
            "code_version": 1,
            "format": "jsonp",
            "need_private_comment": 1,
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        };
        return API.Utils.get(QZone_URLS.MESSAGES_LIST_URL, params);
    },


    /**
     * 转换数据
     * @param pageIndex 需要转换的数据
     * @param data 需要转换的数据
     * @param onprocess 获取评论进度回调函数
     */
    convert(data) {
        data = data || [];
        for (let index = 0; index < data.length; index++) {

            let item = data[index];
            item.index = index;

            // ID
            item.custom_id = item.tid;
            item.custom_owner = {
                uin: item.uin,
                name: item.name
            }
            // 内容
            item.custom_content = item.content;
            // 评论
            item.custom_comments = item.commentlist || [];
            // 评论数
            item.custom_comment_total = API.Utils.getCommentCount(item);
            // 配图
            item.custom_images = item.pic || [];
            // 配图数
            item.custom_image_total = item.pictotal || 0;
            // 音乐
            item.custom_audio = item.audio || [];
            // 音乐数，一般没有或一条
            item.custom_audio_total = item.audiototal || 0;
            // 视频
            item.custom_video = item.video || [];
            for (let index = 0; index < item.custom_video.length; index++) {
                let video = item.custom_video[index];
                // 处理异常数据的视频URL
                video.video_id = video.video_id || '';
                video.video_id = video.video_id.replace("http://v.qq.com/", "");
            }
            // 视频数
            item.custom_video_total = item.videototal || 0;
            // 位置
            item.custom_location = {
                id: item.lbs['id'] || '',
                idname: item.lbs['idname'] || '',
                name: item.lbs['name'] || '',
                pos_x: item.lbs['pos_x'] || '',
                pos_y: item.lbs['pos_y'] || ''
            };
            // 来源说说，一般为转发说说
            // 转发的说说
            item.custom_original = {
                data: item.rt_con,
                uin: item.rt_uin || '',
                nickname: item.rt_uinname || ''
            };
            // 来源
            item.custom_source = {
                id: item.source_appid,
                name: item.source_name,
                url: item.source_url,
            };
            // 转发数量
            item.custom_forward_total = item.fwdnum || 0;
            // 创建时间
            item.custom_create_time = API.Utils.formatDate(item.created_time);
        }
        return data;
    },

    /**
     * 获取全文说说的列表
     * @param {Array} items 说说列表
     */
    getMoreItems(items) {
        let new_items = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.has_more_con === 1 || item.rt_has_more_con === 1) {
                // 长说说与转发长说说
                new_items.push(item)
            }
        }
        return new_items;
    },

    /**
     * 获取全文说说的条目数
     * @param {Array} items 说说列表
     */
    getMoreCount(items) {
        return getMoreItems(items).length
    },

    /**
     * 获取说说全文
     * @param {integer} id 说说ID
     */
    getFullContent(id) {
        let params = {
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken(),
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "tid": id,
            "uin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "t1_source": 1,
            "not_trunc_con": 1,
            "hostuin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "code_version": 1,
            "format": "jsonp",
            "qzreferrer": 'https://user.qzone.qq.com'
        }
        return API.Utils.get(QZone_URLS.MESSAGES_DETAIL_URL, params);
    },


    /**
     * 获取说说评论列表
     * @param {integer} page 第几页
     */
    getComments(id, page) {
        let params = {
            "uin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "tid": id,
            "t1_source": "undefined",
            "ftype": 0,
            "sort": 0,
            "pos": page * Qzone_Config.Messages.Comments.pageSize,
            "num": Qzone_Config.Messages.Comments.pageSize,
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "callback": "_preloadCallback",
            "code_version": 1,
            "format": "jsonp",
            "need_private_comment": 1,
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        }
        return API.Utils.get(QZone_URLS.MESSAGES_COMMONTS_URL, params);
    },

    /**
     * 转换多媒体内容
     */
    formatMedia(item) {
        let downloadType = Qzone_Config.Common.downloadType;
        let isQzoneUrl = downloadType === 'QZone';
        let images = item.custom_images || [];
        let videos = item.custom_video || [];
        let audios = item.custom_audio || [];
        let result = [];
        if (images.length > 0) {
            // 说说配图
            if (images.length == 1) {
                result.push('\r\n\r\n')
                // 数量等于1的，不限制图片宽高
                result.push('<div>\n');
                for (let index = 0; index < images.length; index++) {
                    const image = images[index];
                    let url = isQzoneUrl ? image.custom_url : image.custom_filepath
                    result.push('<img src="{0}" align="center" />\n'.format(url));
                }
                result.push('</div>\n');
                result.push('\r\n\r\n');
            } else if (2 <= images.length && images.length <= 3) {
                result.push('\r\n\r\n')
                // 数量小于3的，一行存放所有照片
                result.push('<div>\n');
                for (let index = 0; index < images.length; index++) {
                    const image = images[index];
                    let url = isQzoneUrl ? image.custom_url : image.custom_filepath
                    result.push('<img src="{0}" width="200px" align="center" />\n'.format(url));
                }
                result.push('</div>\n');
                result.push('\r\n\r\n');
            } else if (images.length == 4) {
                // 数量为4的，两行，每行两张照片
                result.push('\r\n\r\n')
                let _images = _.chunk(images, 2);
                for (let i = 0; i < _images.length; i++) {
                    const _image_list = _images[i];
                    result.push('<div>\n');
                    for (let j = 0; j < _image_list.length; j++) {
                        const _temp = _image_list[j];
                        let url = isQzoneUrl ? _temp.custom_url : _temp.custom_filepath
                        result.push('<img src="{0}" width="200px" height="200px" align="center" />\n'.format(url));
                    }
                    result.push('</div>\n');
                }
                result.push('\r\n\r\n');
            } else if (5 <= images.length && images.length <= 6) {
                // 数量为5和6的，两行，每行2到3张照片
                result.push('\r\n\r\n')
                let _images = _.chunk(images, 3);
                for (let i = 0; i < _images.length; i++) {
                    const _image_list = _images[i];
                    result.push('<div>\n');
                    for (let j = 0; j < _image_list.length; j++) {
                        const _temp = _image_list[j];
                        let url = isQzoneUrl ? _temp.custom_url : _temp.custom_filepath
                        result.push('<img src="{0}" width="200px" height="200px" align="center" />\n'.format(url));
                    }
                    result.push('</div>\n');
                }
                result.push('\r\n\r\n');
            } else if (images.length >= 7) {
                // 数量为7,8,9的，三行，每行2到3张照片
                result.push('\r\n\r\n')
                let _images = _.chunk(images, 3);
                for (let i = 0; i < _images.length; i++) {
                    const _image_list = _images[i];
                    result.push('<div>\n');
                    for (let j = 0; j < _image_list.length; j++) {
                        const _temp = _image_list[j];
                        let url = isQzoneUrl ? _temp.custom_url : _temp.custom_filepath
                        result.push('<img src="{0}" width="200px" height="200px" align="center" />\n'.format(url));
                    }
                    result.push('</div>\n');
                }
                result.push('\r\n\r\n');
            }
        } else if (videos.length > 0) {
            // 视频
            for (let index = 0; index < videos.length; index++) {
                const video = videos[index];
                let url = API.Messages.getVideoUrl(video);
                let filepath = isQzoneUrl ? video.custom_url : video.custom_filepath
                result.push('\r\n\r\n');
                result.push('[![点击查看视频]({0})]({1})\n'.format(filepath, url));
                result.push('\r\n\r\n');
            }
        } else if (audios.length > 0) {
            // 歌曲
            for (let index = 0; index < audios.length; index++) {
                const audio = audios[index];
                result.push('\r\n\r\n');
                let albumname = audio.albumname;
                let singername = audio.singername;
                let custom_url = audio.custom_url;
                let playurl = audio.playurl;
                if (isQzoneUrl) {
                    result.push('[![{0}-{1}]({2})]({3})\n'.format(albumname, singername, custom_url, playurl));
                } else {
                    custom_url = audio.custom_filepath;
                    result.push('[![{0}-{1}]({2})]({3})\n'.format(albumname, singername, custom_url, playurl));
                }
                result.push('\r\n\r\n');
            }
        }
        return result.join('');
    },

    /**
     * 获取视频连接
     * @param {object} 视频信息
     */
    getVideoUrl(video) {
        // URL3个人相册视频？
        let url = video.url3;
        if (video.source_type == "share") {
            // 分享视频连接？
            url = video.rt_url;
        }
        // 腾讯视频或第三方视频？
        if (video.url2) {
            let params = {
                "origin": "https://user.qzone.qq.com",
                "vid": video.video_id,
                "autoplay": true,
                "volume": 1,
                "disableplugin": "UiSpeed,UiDefinition,IframeBottomOpenClientBar",
                "additionplugin": "IframeUiSearch",
                "platId": "qzone_feed",
                "show1080p": false,
                "isDebugIframe": false
            }
            url = API.Utils.toUrl('https://v.qq.com/txp/iframe/player.html', params);
        }
        return url;
    }

};

/**
 * 留言板模块API
 */
API.Boards = {

    /**
     * 获取留言板列表
     * @param {integer} page 第几页
     */
    getBoards(page) {
        let params = {
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "hostUin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "start": page * Qzone_Config.Boards.pageSize,
            "s": Math.random(),
            "format": "jsonp",
            "num": Qzone_Config.Boards.pageSize,
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        };
        return API.Utils.get(QZone_URLS.BOARD_LIST_URL, params);
    },

    /**
     * 获取留言人
     * @param {object} board 留言对象
     */
    getOwner(board) {
        let nickname = QZone.Common.Owner.uin == board.uin ? "我" : (board.nickname || board.nick);
        nickname = nickname || '匿名用户';
        return nickname;
    }
};

/**
 * 相册模块API
 */
API.Photos = {

    /**
     * 获取相册路由
     */
    async getRoute() {
        let params = {
            "UIN": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "type": "json",
            "version": 2,
            "json_esc": 1,
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        }
        let data = await API.Utils.get(QZone_URLS.PHOTOS_ROUTE_URL, params);
        data = API.Utils.toJson(data, /^photoDomainNameCallback\(/);

        var e = new RegExp("^domain_\\d$"), o, c = [];

        function u(t, a, e) {
            for (var i = 0, o = c.length; i < o; i++) {
                if (c[i].domain === t) {
                    c[i].failed = a;
                    return
                }
            }
            c.push({
                domain: t,
                failed: a,
                idcNum: e
            })
        }
        function m() {
            for (var e = 0, i = c.length; e < i; e++) {
                if (!c[e].failed) {
                    return c[e]
                }
            }
            return false
        }

        if (data.domain && data.domain["default"]) {
            o = data.domain["default"];
            if (data[o] && data[o].p) {
                u(data[o].p, 0, data.idcno || 102)
            }
        }
        for (o in data) {
            if (e.test(o) && data[o].p) {
                u(data[o].p, 0, 102)
            }
        }
        let res = m();
        QZone.Common.Target.route = res.idcNum || 102
        return QZone.Common.Target.route;
    },

    /**
     * 获取相册UniKey，用于获取点赞数据
     * @param {string} albumId 相册ID
     */
    getUniKey(albumId) {
        return 'http://user.qzone.qq.com/{0}/mood/{1}'.format(QZone.Common.Target.uin, albumId);
    },

    /**
     * 获取查看相片的在线链接
     * @param {object} photo 相片对象
     */
    getImageViewLink(photo) {
        return 'https://user.qzone.qq.com/{0}/photo/{1}/{2}'.format(QZone.Common.Target.uin, photo.albumId, photo.lloc || photo.sloc);
    },

    /**
     * 获取相册列表
     * @param {integer} page 当前页
     */
    getAlbums(page) {
        let params = {
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "callback": "shine0_Callback",
            "t": String(Math.random().toFixed(16)).slice(-9).replace(/^0/, '9'),
            "hostUin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "appid": 4,
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "source": "qzone",
            "plat": "qzone",
            "format": "jsonp",
            "notice": 0,
            "filter": 1,
            "handset": 4,
            "needUserInfo": 1,
            "idcNum": QZone.Common.Target.route || this.getRoute(),
            "mode": 2, // 视图：普通视图
            "sortOrder": 2, // 排序类型：自定义排序
            "pageStart": page * Qzone_Config.Photos.pageSize,
            "pageNum": Qzone_Config.Photos.pageSize,
            // "needSave": 1, // 保存视图
            "callbackFun": "shine0",
            "_": Date.now()
        }
        return API.Utils.get(QZone_URLS.ALBUM_LIST_URL, params);
    },

    /**
     * 获取相册评论列表
     * @param {string} albumId 相册ID
     * @param {integer} page 当前页
     */
    getAlbumComments(albumId, page) {
        let params = {
            "need_private_comment": 1,
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "hostUin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "start": page * Qzone_Config.Photos.Comments.pageSize,
            "num": Qzone_Config.Photos.Comments.pageSize,
            "order": 1, //倒序
            "topicId": albumId,
            "format": "json",
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "t": Date.now(),
            "cmtType": 1,
            "plat": "qzone",
            "source": "qzone",
            "random": Math.random(),
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        };
        return API.Utils.get(QZone_URLS.ALBUM_COMMENTS_URL, params);
    },

    /**
     * 获取相册相片列表
     * @param {string} topicId 相册ID
     * @param {integer} page 当前页
     */
    getImages(topicId, page) {
        let params = {
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "callback": "shine0_Callback",
            "t": String(Math.random().toFixed(16)).slice(-9).replace(/^0/, '9'),
            "mode": 0,
            "idcNum": QZone.Common.Target.route || this.getRoute(), // 存储相册的服务器路由？
            "hostUin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "topicId": topicId,
            "noTopic": 0,
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "pageStart": page * Qzone_Config.Photos.Images.pageSize,
            "pageNum": Qzone_Config.Photos.Images.pageSize,
            "skipCmtCount": 0,
            "singleurl": 1,
            "batchId": "",
            "notice": 0,
            "appid": 4,
            "inCharset": "gb2312",
            "outCharset": "gb2312",
            "source": "qzone",
            "plat": "qzone",
            "outstyle": "json",
            "format": "jsonp",
            "json_esc": 1,
            "callbackFun": "shine0",
            "_": Date.now()
        };
        return API.Utils.get(QZone_URLS.IMAGES_LIST_URL, params);
    },

    /**
     * 获取相片评论列表
     * @param {string} albumId 相册ID
     * @param {integer} page 当前页
     */
    getImageComments(albumId, picKey, page) {
        let params = {
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "hostUin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "start": page * Qzone_Config.Photos.Images.Comments.pageSize,
            "num": Qzone_Config.Photos.Images.Comments.pageSize,
            "order": 1, // 倒序
            "topicId": albumId + '_' + picKey,
            "format": "jsonp",
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "ref": "photo",
            "need_private_comment": 1,
            "albumId": albumId,
            "qzone": "qzone",
            "plat": "qzone",
            "random": Date.now(),
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        };
        return API.Utils.get(QZone_URLS.IMAGES_COMMENTS_URL, params);
    },

    /**
     * 获取相片外链(无权限也可以访问)
     */
    getExternalUrl(oldurl) {
        //var reg = /http\w?:\/\/.*?\/psb\?\/(.*?)\/(.*?)\/\w\/(.*?)&/gi
        var reg = /http\w?:\/\/.*?\/ps(\w)\?\/(.*?)\/(.*?)\/\w\/(.*?)$/gi
        var reg2 = /http\w?:\/\/.*?\/psc\?\/(.*?)$/gi
        var result;
        var newurl;
        if ((result = reg.exec(oldurl)) !== null) {
            console.log('匹配1');
            newurl = "//r.photo.store.qq.com/ps" + result[1] + "?/" + result[2] + "/" + result[3] + "/r/" + result[4] + "_yake_qzoneimgout.png";
            return newurl;
        } else {
            if ((result = reg2.exec(oldurl)) !== null) {
                console.log('匹配2');
                newurl = "//r.photo.store.qq.com/psc?/" + result[1] + "/r/_yake_qzoneimgout.png";
                return newurl;
            }
        }
        return oldurl;
    },

    /**
     * 获取照片下载URL
     * @param {object} photo 
     */
    getDownloadUrl(photo, type) {
        let url = photo.url;
        switch (type) {
            case 'raw':
                // 原图，原图不存在去高清，高清不存在取普通
                url = photo.raw || photo.origin_url || photo.url;
                break;
            case 'original':
                // 高清，高清不存在取普通
                url = photo.origin_url || photo.url;
                break;
            default:
                // 一般
                url = photo.downloadUrl || photo.url;
                break;
        }
        return API.Utils.trimDownloadUrl(url);
    },

    /**
     * 获取相册预览地址
     * @param {object} url 
     */
    getPhotoPreUrl(url) {
        var reg = /http\w?:\/\/.*?\/ps(\w)\?\/(.*?)\/(.*?)\/\w\/(.*?)$/gi
        var reg2 = /http\w?:\/\/.*?\/psc\?\/(.*?)$/gi
        var result;
        var newurl;
        if ((result = reg.exec(url)) !== null) {
            newurl = "https://r.photo.store.qq.com/ps" + result[1] + "?/" + result[2] + "/" + result[3] + "/m/" + result[4];
            return newurl;
        } else {
            if ((result = reg2.exec(url)) !== null) {
                newurl = "https://r.photo.store.qq.com/psc?/" + result[1] + "/m";
                return newurl;
            }
        }
        return API.Utils.trimDownloadUrl(url);
    },

    /**
     * 获取相片类型
     * @param {string} photo 相片对象
     */
    getPhotoType(photo) {
        const type = photo.phototype;
        // 默认类型
        let extName = ".jpeg";
        switch (type) {
            case 1:
                extName = ".jpeg";
                break;
            case 2:
                extName = ".gif";
                break;
            case 3:
                extName = ".png";
                break;
            case 4:
                extName = ".bmp";
                break;
            case 5:
                extName = ".jpeg";
                break;
        }
        return extName;
    }

};

/**
 * 视频模块API
 */
API.Videos = {

    /**
     * 获取视频列表
     * @param {integer} page 当前页
     */
    getVideos(page) {
        let params = {
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "callback": "shine0_Callback",
            "t": String(Math.random().toFixed(16)).slice(-9).replace(/^0/, '9'),
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "hostUin": QZone.Common.Target.uin || API.Utils.initUin().Target.uin,
            "appid": 4,
            "getMethod": 2,
            "start": page * Qzone_Config.Videos.pageSize,
            "count": Qzone_Config.Videos.pageSize,
            "need_old": 0,
            "getUserInfo": 0,
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "refer": "qzone",
            "source": "qzone",
            "callbackFun": "shine0",
            "_": Date.now()
        }
        return API.Utils.get(QZone_URLS.VIDEO_LIST_URL, params);
    },

    /**
     * 获取视频文件名
     * @param {string} url 视频地址
     */
    getFileName(url) {
        url = url || '';
        let result = /http:\/\/(.+)\/(.+\.mp4)\?(.+)/gi.exec(url);
        if (result) {
            return result[2];
        }
        return API.Utils.newSimpleUid(8, 16) + '.mp4';
    }
};



/**
 * 收藏夹模块API
 */
API.Favorites = {

    /**
     * 获取查询类型
     */
    getQueryType(innerType) {
        let Fav_Tyep = {
            0: "全部",
            1: "日志",
            2: "照片",
            3: "说说",
            4: "分享",
            5: "文字",
            6: "网页",
            7: "未知",
            8: "未知"
        }
        return Fav_Tyep[innerType] || "未知";
    },


    /**
     * 获取类型
     */
    getType(innerType) {
        let Fav_Tyep = {
            0: "全部",
            1: "网页",
            2: "本地图片",
            3: "日志",
            4: "照片",
            5: "说说",
            6: "文字",
            7: "分享",
            8: "未知"
        }
        return Fav_Tyep[innerType] || "未知";
    },

    /**
     * 转换数据
     */
    convert(data) {
        for (var i = 0; i < data.length; i++) {
            let temp = data[i];
            temp.custom_create_time = API.Utils.formatDate(temp.create_time);
            temp.custom_uin = QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin;
            temp.custom_name = '我';
            temp.custom_abstract = temp.abstract || "";
            temp.album_info = temp.album_info || {};
            temp.blog_info = temp.blog_info || {};
            temp.photo_list = temp.photo_list || [];
            temp.shuoshuo_info = temp.shuoshuo_info || {};
            temp.share_info = temp.share_info || {};
            temp.url_info = temp.url_info || {};
            // 源信息
            temp.source_info = {};
            // 多媒体-配图
            temp.custom_images = temp.img_list || [];
            temp.custom_origin_images = temp.origin_img_list || [];
            // 多媒体-视频
            temp.source_info.video_list = [];
            temp.custom_video = [];
            // 多媒体-歌曲
            temp.source_info.music_list = [];
            temp.custom_audio = [];
            switch (temp.type) {
                case 1:
                    // 网页                   
                    temp.source_info.video_list = temp.url_info.video_list || [];
                    temp.source_info.music_list = temp.url_info.music_list || [];
                    break;
                case 3:
                    // 日志                    
                    temp.source_info.video_list = temp.blog_info.video_list || [];
                    temp.source_info.music_list = temp.blog_info.music_list || [];
                    break;
                case 4:
                    // 照片或相册？
                    temp.source_info.video_list = temp.album_info.video_list || [];
                    temp.source_info.music_list = temp.album_info.music_list || [];
                    break;
                case 5:
                    // 说说
                    temp.source_info.video_list = temp.shuoshuo_info.video_list || [];
                    temp.source_info.music_list = temp.shuoshuo_info.music_list || [];
                    temp.shuoshuo_info.detail_shuoshuo_info = temp.shuoshuo_info.detail_shuoshuo_info || {};
                    break;
                case 7:
                    // 分享
                    temp.share_info.reason = temp.share_info.reason.split('||')[0];
                    temp.source_info.video_list = temp.share_info.video_list || [];
                    temp.source_info.music_list = temp.share_info.music_list || [];
                    break;
                default:
                    console.warn('其他收藏类型或未知类型不转换数据', temp);
                    break;
            }
            // 统一处理多媒体信息
            // 配图
            for (let index = 0; index < temp.custom_images.length; index++) {
                const url = temp.custom_images[index];
                if (temp.type === 1) {
                    temp.custom_images[index] = {
                        url: url
                    };
                    temp.custom_origin_images[index] = {
                        url: url
                    };
                    continue;
                }
                let temp_urls = url.split('/');
                // 删除最后一个参数
                temp_urls.pop();
                // 添加新的参数
                temp_urls.push("0");
                temp.custom_images[index] = {
                    url: temp_urls.join('/')
                };
                temp.custom_origin_images[index] = {
                    url: temp_urls.join('/')
                };
            }
            // 视频
            for (const video of temp.source_info.video_list) {
                temp.custom_video.push(video.video_info);
            }
            // 歌曲
            for (const music of temp.source_info.music_list) {
                temp.custom_audio.push(music.music_info);
            }
        }
        return data;
    },

    /**
     * 获取收藏列表
     * @param {integer} page 当前页
     */
    getFavorites(page) {
        let params = {
            "uin": QZone.Common.Owner.uin || API.Utils.initUin().Owner.uin,
            "type": 0,//全部\
            "start": page * Qzone_Config.Favorites.pageSize,
            "start": page * Qzone_Config.Favorites.pageSize,
            "num": Qzone_Config.Favorites.pageSize,
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "need_nick": 1,
            "need_cnt": 0,
            "need_new_user": 0,
            "fupdate": 1,
            "random": Math.random(),
            "g_tk": QZone.Common.Config.gtk || API.Utils.initGtk(),
            "qzonetoken": QZone.Common.Config.token || API.Utils.getQzoneToken()
        }
        return API.Utils.get(QZone_URLS.FAVORITE_LIST_URL, params);
    }

};