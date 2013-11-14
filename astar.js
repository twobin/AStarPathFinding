/*
* Algorithm of A * pathfinding
* Date: 2013-11-14
* (copyright) 2012-2013 twobin, https://github.com/twobin
*/
window.onload = function () {
    var oBox = document.getElementById('box');  // 主容器
    //创建一个文档碎片，把所有的新结点附加上，然后把文档碎片的内容一次性添加到document中，只需要一次页面刷新就可
    var oFrag = document.createDocumentFragment();  // 存放临时文档碎片
    var oStart = null;  // 起始点
    var oEnd = null;  // 结束点  
    var aPoint = oBox.getElementsByTagName('div');  // 存放地图元素
    var aMaps = [];  // 存放地图数据
    var maps = [];
    //参数设置
    var iRnd = 100;  // 随机障碍数
    var iRow = 30;  // 存放行数
    var iCol = 30;  // 存放列数
    var iWidth = 20;  // 单元格宽
    var iHeight = 20;  // 单元格高
    var iTime = 50;  // 动画延时
    //创建div元素，加入到oBox中
    function render() {
        oBox.innerHTML = '';        
        for (var i = 0; i < iRow; i++) {
            for (var j = 0; j < iCol; j++ ) {
                var oBlock = document.createElement('div');
                oBlock.className = 'block';
                oBlock.row = i;
                oBlock.col = j;
                oBlock.style.float = 'left';
                oBlock.style.left = iWidth * j + 'px';
                oBlock.style.top = iHeight * i + 'px';
                oBlock.style.width = iWidth - 1 + 'px';
                oBlock.style.height = iHeight - 1 + 'px';
                //先加入到文档碎片中
                oFrag.appendChild(oBlock);
            }
        }
        //再将文档碎片加入oBox中
        oBox.appendChild(oFrag);
    }    
    //将oBox中的div添加到aMaps中（创建地图）
    function module() {
        aMaps = [];
        aPoint = oBox.getElementsByTagName('div');//此时已经有div加入到oBox中        
        for (var i = 0; i < iRow; i++) {
            aMaps[i] = [];
            for (var j = 0; j < iCol; j++) {
                aMaps[i][j] = aPoint[i * iCol + j];
            }
        }    
    }    
    render();//创建div加入oBox中
    module();//创建地图aMaps
    rndFence(aMaps, iRnd, maps);//随机生成障碍物
    //在地图上的点击事件
    oBox.onclick = function (ev) {
        var ev = ev || window.event;//ev代表事件
        var target = ev.target || ev.srcElement;//target代表事件的目标对象，oBox中的div元素        
        // 设置起点、设置终点、设置障碍物
        //test() 方法用于检测一个字符串是否匹配某个模式
        if (/(\b|\s)+block(\b|\s)+/i.test(target.className)) {
            if (!oStart && target.val != 1) 
                target.start = true, 
                target.className += ' start', 
                oStart = target;
            else if (oStart && !oEnd) {
                if (!target.start && target.val != 1) 
                    target.end = true, 
                    target.className += ' end', 
                    oEnd = target;
                else if (target.start) 
                    return alert('起止点不能相同点');
            } 
            else if (oStart && oEnd) {
                if (!target.start && !target.end && target.val != 1) {
                  target.val = 1;
                  target.className += ' fence';
                }
                else if (target.start||target.end) 
                    return alert('障碍点熊放置在起止点上');
            }
        }
        //添加完起止点和障碍点后，将所有元素加入地图
        module();
        //开始计算路径（选择起止点后自动开始计算路径）
        if (oStart && oEnd) {
            var path = findway(aMaps, oStart, oEnd);
            if (!path) alert('无路可走');
            else {
                for (var i = 0; i < path.length; i++) {
                    //function之前加上运算符，由于解析的缘故 ,function会即时触发，就是一个语言特征
                    ~function (i) {
                        var timer = null;
                        timer = setTimeout(function () {
                            path[i].className += ' path';
                            clearTimeout(timer);
                        }, i * iTime) //iTime为动画延时，下一个path都比上一个path延时iTime
                    }(i);
                }
            }
        }
    };
};
// 随机生成障碍物
function rndFence(points, num, maps) {
    var total = points.length * points[0].length;//总数=行*列
    var index = 0;
    var col = 0;
    var row = 0;
    var n = 0;
    var arr = [];
    //当maps=null时
    if (!maps || !maps.length) {
        while (n < num) {
            index = rnd(0, total);//在0-总数之间生成随机数
            row = parseInt(index / points[0].length);//取得随机数在地图中第几行
            col = index % points[0].length;//第几列
            //points[row][col].val=undefine，因为里面只有div元素，没有value值
            if (!points[row][col].val) {
                points[row][col].val = 1;
                points[row][col].className += ' fence';
                n++;
            } 
            else {
                continue;
            }
        }
    } 
    //当maps！=null时，将maps中的障碍添加到points中
    else {
        for (var i = 0; i < maps.length; i++) {
            for (var j = 0; j < maps[0].length; j++) {
                if (maps[i][j] == 1) {
                    points[i][j].val = 1;
                    points[i][j].className += ' fence';
                }
            }
        }
    }
}
// 生成随机数
function rnd(begin, end){
    return Math.floor(Math.random() * (end - begin)) + begin;
}
// 获取四周点
function getRounds(points, current) {
    var u = null;//上
    var l = null;//左
    var d = null;//下
    var r = null;//右    
    var rounds = [];
    // 上
    if (current.row - 1 >= 0) {
        u = points[current.row - 1][current.col];
        rounds.push(u);
    }    
    // 左
    if (current.col - 1 >= 0) {
        l = points[current.row][current.col - 1];
        rounds.push(l);
    }
    // 下
    if (current.row + 1 < points.length) {
        d = points[current.row + 1][current.col];
        rounds.push(d);
    }    
    // 右
    if (current.col + 1 < points[0].length) {
        r = points[current.row][current.col + 1];
        rounds.push(r);
    }    
    return rounds;
}
// 监测是否在列表中
function inList(list, current) {
    for (var i = 0, len = list.length; i < len; i++) {
        if ((current.row == list[i].row && current.col == list[i].col) || (current == list[i])) 
            return true;
    }
    return false;
}
//寻找路径（astar算法）-地图、起点、终点
function findway(points, start, end) {
    var opens = [];  // 存放可检索的方块(开启列表)
    var closes = [];  // 存放已检索的方块（关闭列表）
    var cur = null;  // 当前指针
    var bFind = true;  // 是否检索  
    // 设置开始点的F、G为0并放入opens列表（F=G+H）
    start.F = 0;
    start.G = 0;
    start.H = 0;   
    // 将起点压入closes数组，并设置cur指向起始点
    closes.push(start);
    cur = start;    
    // 如果起始点紧邻结束点则不计算路径直接将起始点和结束点压入closes数组
    if (Math.abs(start.row - end.row) + Math.abs(start.col - end.col) == 1) {
        end.P = start;
        closes.push(end);
        bFind = false;
    }    
    // 计算路径
    while (cur && bFind) {
        //如果当前元素cur不在closes列表中，则将其压入closes列表中
        if (!inList(closes, cur)) 
            closes.push(cur);
        // 然后获取当前点四周点
        var rounds = getRounds(points, cur);
        // 当四周点不在opens数组中并且可移动，设置G、H、F和父级P，并压入opens数组
        for (var i = 0; i < rounds.length; i++) {
            if (rounds[i].val == 1 || inList(closes, rounds[i]) || inList(opens, rounds[i])) 
                continue;
            else if (!inList(opens, rounds[i]) && rounds[i].val != 1) {
                rounds[i].G = cur.G + 1;//不算斜的，只算横竖，设每格距离为1
                rounds[i].H = Math.abs(rounds[i].col - end.col) + Math.abs(rounds[i].row - end.row);
                rounds[i].F = rounds[i].G + rounds[i].H;
                rounds[i].P = cur;//cur为.P的父指针                
                opens.push(rounds[i]);
            }
        }        
        // 如果获取完四周点后opens列表为空，则代表无路可走，此时退出循环
        if (!opens.length) {
            cur = null;
            opens = [];
            closes = [];
            break;
        }        
        // 按照F值由小到大将opens数组排序
        opens.sort(function (a, b) {
            return a.F - b.F;
        });        
        // 取出opens数组中F值最小的元素，即opens数组中的第一个元素
        var oMinF = opens[0];
        var aMinF = [];  // 存放opens数组中F值最小的元素集合        
        // 循环opens数组，查找F值和cur的F值一样的元素，并压入aMinF数组。即找出和最小F值相同的元素有多少
        for (var i = 0; i < opens.length; i++) {
            if (opens[i].F == oMinF.F) 
                aMinF.push(opens[i]);
        }        
        // 如果最小F值有多个元素
        if (aMinF.length > 1) {
            // 计算元素与cur的曼哈顿距离
            for (var i = 0; i < aMinF.length; i++) {
                aMinF[i].D = Math.abs(aMinF[i].row - cur.row) + Math.abs(aMinF[i].col - cur.col);
            }           
            // 将aMinF按照D曼哈顿距离由小到大排序（按照数值的大小对数字进行排序）
            aMinF.sort(function (a, b) {
                return a.D - b.D;
            });                        
            oMinF = aMinF[0];
        }
        // 将cur指向D值最小的元素
        cur = oMinF;        
        // 将cur压入closes数组
        if (!inList(closes, cur)) 
            closes.push(cur);       
        // 将cur从opens数组中删除
        for (var i = 0; i < opens.length; i++) {
            if (opens[i] == cur) {
                opens.splice(i, 1);//将第i个值删除
                break;
            }
        }
        // 找到最后一点，并将结束点压入closes数组
        if (cur.H == 1) {
            end.P = cur;
            closes.push(end);
            cur = null;
        }
    }
    if (closes.length) {
        // 从结尾开始往前找
        var dotCur = closes[closes.length - 1];
        var path = [];  // 存放最终路径
        var i=0;
        while (dotCur) {
            path.unshift(dotCur);  // 将当前点压入path数组的头部
            dotCur = dotCur.P;  // 设置当前点指向父级            
            if (!dotCur.P) {
                dotCur = null;
            }
        }        
        return path;
    } 
    else {
        return false;
    }
}
