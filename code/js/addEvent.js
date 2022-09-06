let FID = 0 // 全局变量, 保存点的FID
let isEdit = false // 全局变量, false(添加状态) true(修改状态)

const addEventpopup = new ol.Overlay({
    //要转换成overlay的HTML元素
    element: document.querySelector('#addEvent-popup'),
    //当前窗口可见
    autoPan: true,
    //Popup放置的位置
    positioning: 'bottom-center',
    //是否应该停止事件传播到地图窗口
    stopEvent: true,
    autoPanAnimation: {
        //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
        duration: 250,
    },
})
map.addOverlay(addEventpopup)

map.addLayer(layer)


// 2.3 准备画笔
let draw_event = null // 全局变量, 保存交互式画笔
let coordinate = null // 全局变量, 保存新增加的点的坐标
function add() {
    isEdit = false
    draw_event = createDraw(source, 'Point', function (e) {
        // 保存新添加的点的坐标
        coordinate = e.feature.getGeometry().getCoordinates()
        // console.log(coordinate)

        // 显示popup弹窗
        var addEventHtml = `<div class="popup-title" style="color:#fff">
        添加事件<a href="#" id="add-event-closer" class="ol-popup-closer"></a>
    </div>
    <div id="add-event-content">
        <table class="add-table-control" width="400">
            <tr>
                <th>事件编号</th>
                <td><input type="text" class="form-control" placeholder="请输入事件编号" id="focus1"></td>
            </tr>
            <tr>
                <th>事件类型</th>
                <td>
                    <input class="form-control" list="sites1" placeholder="碰撞" id="focus2">
                    <datalist id="sites1">
                        <option value="碰撞">
                        <option value="刮擦">
                        <option value="失火">
                        <option value="翻车">
                        <option value="碾压">
                        <option value="其他">
                    </datalist>
                </td>
            </tr>
            <tr>
                <th>事件等级</th>
                <td>
                    <input class="form-control" list="sites2" placeholder="轻微事故" id="focus3">
                    <datalist id="sites2">
                        <option value="轻微事故">
                        <option value="一般事故">
                        <option value="重大事故">
                        <option value="特大事故">
                    </datalist>
                </td>
            </tr>
            <tr>
                <th>发生时间</th>
                <td>
                    <input type="text" class="form-control" id="focus4">
                </td>
            </tr>
            <tr>
                <th>发生地点</th>
                <td>
                    <input type="text" class="form-control" placeholder="请输入发生地点" id="focus5">
                </td>
            </tr>
            <tr>
                <th>车牌号</th>
                <td>
                    <input type="text" class="form-control" placeholder="请输入车牌号" id="focus6">
                </td>
            </tr>
            <tr>
                <th>驾驶员</th>
                <td>
                    <input type="text" class="form-control" placeholder="请输入驾驶员" id="focus7">
                </td>
            </tr>
            <tr>
                <th>处理状态</th>
                <td>
                    <input class="form-control" list="sites3" placeholder="未处理" id="focus8">
                    <datalist id="sites3">
                        <option value="未处理">
                        <option value="忽略">
                        <option value="通过">
                    </datalist>
                </td>
            </tr>
        </table>
    </div>
    <div class="addevent-footer"> <button id="handleaddEvent">提交</button><button
            id="addeventCancle">取消</button></div>`
        $('#addEvent-popup').append(addEventHtml)
        const addeventCancle = document.getElementById('addeventCancle')
        const handleaddEvent = document.getElementById('handleaddEvent')

        addeventCancle.onclick = function () {

            source.clear()
            // 隐藏popup弹窗
            addEventpopup.setPosition(undefined)
            // document.getElementById('add-event-closer').blur()
            $('#addEvent-popup').empty()
            // 移除交互式点控件
            map.removeInteraction(draw_event)
        }
        // 获取时间
        Date.prototype.format = function (fmt) {
            var o = {
                'y+': this.getFullYear, //年
                'M+': this.getMonth() + 1, //月份
                'd+': this.getDate(), //日
                'h+': this.getHours(), //小时
                'm+': this.getMinutes(), //分
                's+': this.getSeconds(), //秒
            }
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    (this.getFullYear() + '').substr(4 - RegExp.$1.length)
                )
            for (var k in o)
                if (new RegExp('(' + k + ')').test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1
                            ? o[k]
                            : ('00' + o[k]).substr(('' + o[k]).length)
                    )
            return fmt
        }
        var time = new Date().format('yyyy-MM-dd hh:mm:ss')
        $('#focus4').val(time)

        handleaddEvent.onclick = function () {
            var eventNumber = $('#focus1').val()
            var eventType = $('#focus2').val()
            var level = $('#focus3').val()
            var eventTime = $('#focus4').val()
            var eventAddr = $('#focus5').val()
            var licenseNumber = $('#focus6').val()
            var driver = $('#focus7').val()
            var status1 = $('#focus8').val()
            let eventLevel = 1
            let eventStatus = 0
            let eventcolor = 6
            console.log(level)
            switch (level) {
                // case '轻微事故':
                //     eventLevel = 1
                case '一般事故':
                    eventLevel = 2
                    break
                case '重大事故':
                    eventLevel = 3
                    break
                case '特大事故':
                    eventLevel = 4
                    break
            }
            switch (status1) {
                case '忽略':
                    eventStatus = 1
                    eventcolor = 4
                    break
                case '通过':
                    eventStatus = 2
                    eventcolor = 90
                    break
                // case '未处理':
                //     eventStatus = 0
                //     eventcolor = 6
                //     break
            }
            var eventstyle = new Zondy.Object.CPointInfo({
                Angle: 0,
                Color: eventcolor,
                Space: 0,
                SymHeight: 5,
                SymID: 21,
                SymWidth: 5,
            })
            const zd_point = new Point({
                doc: docLayer,
                layerID: 4,
                style: eventstyle,
                fields: {
                    '事件编号': 'string',
                    '事件类型': 'string',
                    '事件等级': 'short',
                    '发生时间': 'string',
                    '发生地点': 'string',
                    '车牌号': 'string',
                    '驾驶员': 'string',
                    '处理状态': 'short',
                    // mapLayer: 'long',
                    // 'mapLayer': 'string',
                },
            })
            if (isEdit) {
                // 调用修改的API
                zd_point.update(FID, null, [eventNumber, eventType, eventLevel, eventTime, eventAddr, licenseNumber, driver, eventStatus], null)
            } else {
                // 调用添加的API
                // 准备坐标数据
                zd_point.add(coordinate, [eventNumber, eventType, eventLevel, eventTime, eventAddr, licenseNumber, driver, eventStatus])
            }

            // 成功后, 完成一个收尾性工作
            // 清理画布
            // source_event.clear()
            source.clear()
            // 隐藏popup弹窗
            $('#addEvent-popup').empty()
            addEventpopup.setPosition(undefined)
            // 移除交互式点控件
            map.removeInteraction(draw_event)
        }


        e.feature.setStyle(icon_blue)
        document.querySelector('#add-event-closer').onclick = function () {

            source.clear()
            // 隐藏popup弹窗
            addEventpopup.setPosition(undefined)
            $('#addEvent-popup').empty()
            // 移除交互式点控件
            map.removeInteraction(draw_event)

        }
        addEventpopup.setPosition(coordinate)
    })
    map.addInteraction(draw_event)
}

// 3.4 关闭popup弹窗

// 取消

function handleaddEvent2() {
    var eventNumber = $('#focus1').val()
    var eventType = $('#focus2').val()
    var level = $('#focus3').val()
    var eventTime = $('#focus4').val()
    var eventAddr = $('#focus5').val()
    var licenseNumber = $('#focus6').val()
    var driver = $('#focus7').val()
    var status1 = $('#focus8').val()
    let eventLevel = 1
    let eventStatus = 0
    let eventcolor = 6
    console.log(level)
    switch (level) {
        case '轻微事故':
            eventLevel = 1
        case '一般事故':
            eventLevel = 2
            break
        case '重大事故':
            eventLevel = 3
            break
        case '特大事故':
            eventLevel = 4
            break
    }
    switch (status1) {
        case '忽略':
            eventStatus = 1
            eventcolor = 4
            break
        case '通过':
            eventStatus = 2
            eventcolor = 90
            break
        case '未处理':
            eventStatus = 0
            eventcolor = 6
            break
    }
    // 3-2.添加点
    var gpoint = new Zondy.Object.GPoint(coordinate[0], coordinate[1])
    var fGeom = new Zondy.Object.FeatureGeometry({
        PntGeom: [gpoint],
    })
    // 样式信息
    var pointInfo = new Zondy.Object.CPointInfo({
        Angle: 0,
        Color: eventcolor,
        Space: 0,
        SymHeight: 5,
        SymID: 21,
        SymWidth: 5,
    })
    var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
        InfoType: 1,
        PntInfo: pointInfo,
    })
    // 属性值
    var attValue = [
        eventNumber, eventType, eventLevel, eventTime, eventAddr, licenseNumber, driver, eventStatus, 0
    ]
    var feature = new Zondy.Object.Feature({
        fGeom: fGeom,
        GraphicInfo: webGraphicInfo,
        AttValue: attValue,
    })
    feature.setFType(1)
    var featureSet = new Zondy.Object.FeatureSet()
    //属性结构
    var cAttStruct = new Zondy.Object.CAttStruct({
        FldName: [
            '事件编号',
            '事件类型',
            '事件等级',
            '发生时间',
            '发生地点',
            '车牌号',
            '驾驶员',
            '处理状态',
            'mpLayer',
        ],
        FldNumber: 7,
        FldType: [
            'string',
            'string',
            'short',
            'string',
            'string',
            'string',
            'string',
            'short',
            'long',
        ],
    })
    featureSet.AttStruct = cAttStruct
    featureSet.addFeature(feature)
    var editService = new Zondy.Service.EditDocFeature('traffic', 4, {
        ip: 'localhost',
        port: '6163',
    })
    editService.add(featureSet, addeventSuccess)
    addeventCancle()
}

// 5.添加事件成功的回调
function addeventSuccess(data) {
    if (data.succeed) {
        alert('操作成功！')
        docLayer.refresh()
    } else {
        alert('操作失败！')
    }
}