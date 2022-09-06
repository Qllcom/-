const querypopup = new ol.Overlay({
    //要转换成overlay的HTML元素
    element: document.querySelector('#query-popup'),
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
map.addOverlay(querypopup)

document.querySelector('#query-popup-closer').onclick = function () {
    $('#event-table').empty()
    // $('#event-table').append(eventProperties)

    source.clear()
    // 移除交互式点控件
    map.removeInteraction(draw_query)
    querypopup.setPosition(undefined)
}
let draw_query = null
function query() {
    draw_query = createDraw(source, 'Box', function (e) {
        // 拿到点击的坐标
        const geom = e.feature.getGeometry()
        // console.log(point)

        const query = new Query({
            service: 'traffic', // 发布的服务的名称
            layerID: 4, // 需要查询的图层的id, 从0开始计数
        })
        query.queryByGeom(geom, onSuccess)
    })
    map.addInteraction(draw_query)
}

let queryHtml = null
let eventProperties = `<tr id="event-properties">
<th>序号</th>
<th>事件编号</th>
<th>事件类型</th>
<th>事件等级</th>
<th>发生时间</th>
<th>发生地点</th>
<th>车牌号</th>
<th>驾驶员</th>
<th>处理状态</th>
</tr>`



function onSuccess(result) {
    console.log(result)
    $('#event-table').append(eventProperties)
    let x = result.SFEleArray[0].fGeom.PntGeom[0].Dot.x
    let y = result.SFEleArray[0].fGeom.PntGeom[0].Dot.y
    var points = [x, y]
    for (let i = 0; i < result.TotalCount; i++) {
        let x = result.SFEleArray[i].fGeom.PntGeom[0].Dot.x
        let y = result.SFEleArray[i].fGeom.PntGeom[0].Dot.y
        var coordinate = [x, y]

        const point = new ol.geom.Point(coordinate)
        const pointFeature = new ol.Feature({
            geometry: point,
        })
        pointFeature.setStyle(icon_red)
        //   2.4 添加到数据源
        const source_batch = new ol.source.Vector({
            // features: [pointFeature],
            wrapX: false,
        })
        source.addFeature(pointFeature)

        eventNumber = result.SFEleArray[i].AttValue[0]
        eventType = result.SFEleArray[i].AttValue[1]
        eventLevel = result.SFEleArray[i].AttValue[2]
        eventTime = result.SFEleArray[i].AttValue[3]
        eventAddr = result.SFEleArray[i].AttValue[4]
        licenseNumber = result.SFEleArray[i].AttValue[5]
        driver = result.SFEleArray[i].AttValue[6]
        eventStatus = result.SFEleArray[i].AttValue[7]
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
        queryHtml = `<tr>
        <td>${i}</td>
        <td>${eventNumber}</td>
        <td>${eventType}</td>
        <td>${level}</td>
        <td>${eventTime}</td>
        <td>${eventAddr}</td>
        <td>${licenseNumber}</td>
        <td>${driver}</td>
        <td>${status1}</td>
      </tr>`
        $('#event-table').append(queryHtml)
    }
    querypopup.setPosition(points)
}