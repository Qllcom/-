const popup = new ol.Overlay({
    //要转换成overlay的HTML元素
    element: document.querySelector('#popup'),
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
map.addOverlay(popup)

const source = new ol.source.Vector({ wrapX: false })
const layer = new ol.layer.Vector({ source: source, style: null })
// let v_coordinate = null
let draw_video = null
function activeVideo() {
    draw_video = createDraw(source, 'Point', function (e) {
        // 获取点坐标
        // 根据点坐标 查询
        coordinate = e.feature.getGeometry().getCoordinates()
        e.feature.setStyle(icon_blue)
        // console.log(point)
        const query = new Query({
            service: 'traffic',
            layerID: 3,
        })
        query.queryByPnt(coordinate, videoSuccess, videoError)
    })
    map.addInteraction(draw_video)
}
function videoError(err) { }
function videoSuccess(result) {
    console.log(result) //
    if(result.SFEleArray.length == 0) {
        source.clear()
    }
    
    else if (result.SFEleArray.length != 0) {
        document.querySelector('video').src =
            result.SFEleArray[0].AttValue[3]
        // 显示popup弹窗
        // const arr1 = document.getElementById('arr').value
        // arr1 = result.SFEleArray[0].AttValue[2]
        // console.log(arr1)
        popup.setPosition(coordinate)
    }
    
    // 通过result可以获取URL的值
}
document.querySelector('.ol-popup-closer').onclick = function () {
    source.clear()
    map.removeInteraction(draw_video)
    //设置位置为undefined
    popup.setPosition(undefined)
}