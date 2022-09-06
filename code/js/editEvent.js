// let FID = 0
function edit() {
    isEdit = true
    draw_edit = createDraw(source, 'Point', function (e) {
        // 记录点坐标
        coordinate = e.feature.getGeometry().getCoordinates()
        e.feature.setStyle(icon_blue)
        // 执行点查询
        const query = new Query({
            service: 'traffic',
            layerID: 4,
        })
        query.queryByPnt(coordinate, editSuccess, editError)
    })
    map.addInteraction(draw_edit)
}

// 5.3 实现查询成功回调
function editSuccess(result) {
    console.log(result)
    // 如果可以查询到结果
    if(result.SFEleArray.length == 0) {
        source.clear()
    }
    else if (result.SFEleArray.length != 0) {
        // 获取字段的旧值
        // const name = result.SFEleArray[0].AttValue[1]
        // 记录FID
        FID = result.SFEleArray[0].FID

        // 设置input输入框的value值
        // document.querySelector('#city').value = name
        // 显示popup弹窗
        eventNumber = result.SFEleArray[0].AttValue[0]
        eventType = result.SFEleArray[0].AttValue[1]
        eventLevel = result.SFEleArray[0].AttValue[2]
        eventTime = result.SFEleArray[0].AttValue[3]
        eventAddr = result.SFEleArray[0].AttValue[4]
        licenseNumber = result.SFEleArray[0].AttValue[5]
        driver = result.SFEleArray[0].AttValue[6]
        eventStatus = result.SFEleArray[0].AttValue[7]
        // fid = result.SFEleArray[0].FID
        level = '轻微事故'
        status1 = '未处理'
        switch (eventLevel) {
            case '2':
                level = '一般事故'
                break
            case '3':
                level = '重大事故'
                break
            case '4':
                level = '特大事故'
                break
        }
        switch (eventStatus) {
            case '1':
                // console.log('11111')
                status1 = '忽略'
                break
            case '2':
                status1 = '通过'
                break
        }
        var editEventHtml = `<div class="popup-title" style="color: #fff; background-color: rgba(64, 158, 255); text-align: center;">
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

        $('#addEvent-popup').append(editEventHtml)
        document.querySelector('#focus1').value = eventNumber
        document.querySelector('#focus2').value = eventType
        document.querySelector('#focus3').value = level
        document.querySelector('#focus4').value = eventTime
        document.querySelector('#focus5').value = eventAddr
        document.querySelector('#focus6').value = licenseNumber
        document.querySelector('#focus7').value = driver
        document.querySelector('#focus8').value = status1
        addEventpopup.setPosition(coordinate)

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
            console.log(eventcolor)
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
                console.log(eventcolor)
                zd_point.update(FID, null, [eventNumber, eventType, eventLevel, eventTime, eventAddr, licenseNumber, driver, eventStatus], eventstyle)
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


        document.querySelector('#add-event-closer').onclick = function () {

            source.clear()
            // 隐藏popup弹窗
            addEventpopup.setPosition(undefined)
            $('#addEvent-popup').empty()
            // 移除交互式点控件
            map.removeInteraction(draw_event)

        }
        // 收尾工作
        // source.clear()
        map.removeInteraction(draw_edit)
    }
}
function editError() { }