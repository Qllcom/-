//显示隐藏函数
function conversion(data) {
  if (data.hasClass('hidden')) {
    data.removeClass('hidden').addClass('show')
  } else if (data.hasClass('show')) {
    data.removeClass('show').addClass('hidden')
  }
}


// 鼠标位置控件
var mousePositionControl = new ol.control.MousePosition({
  //坐标格式
  coordinateFormat: ol.coordinate.createStringXY(4),
  //地图投影坐标系（若未设置则输出为默认投影坐标系下的坐标）
  projection: 'EPSG:4326',
  //坐标信息显示样式类名，默认是'ol-mouse-position'
  className: 'custom-mouse-position',
  //显示鼠标位置信息的目标容器
  target: document.getElementById('mouse-position'),
  //未定义坐标的标记
  undefinedHTML: '&nbsp;',
})
map.addControl(mousePositionControl)

const mposition = $('.mouse-position')
mposition.addClass('show')
function mousep() {
  // conversion(mposition)
  // sline.addClass('decline')
  if (mposition.hasClass('hidden')) {
    mposition.removeClass('hidden').addClass('show')
    sline.removeClass('decline')
  } else if (mposition.hasClass('show')) {
    mposition.removeClass('show').addClass('hidden')
    sline.addClass('decline')
  }
}

//实例化比例尺控件（ScaleLine）
const scaleLineControl = new ol.control.ScaleLine({
  //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
  units: 'metric',
})
map.addControl(scaleLineControl)
const sline = $('.ol-scale-line')
sline.addClass('show')
function scalel() {
  conversion(sline)
}

// 复位控件
const zoomToExtent = new ol.control.ZoomToExtent({
  //确定一个范围, 左下角经度, 左下角维度, 右上角经度, 右上角维度
  extent: [
    114.321103824701, 30.4545175015849, 114.417985804936, 30.5289619425023,
  ],
  // extent: [114.38, 30.470, 114.38, 30.52554],
})
//添加控件
map.addControl(zoomToExtent)
const zoomext = $('.ol-zoom-extent')
zoomext.addClass('show')
function zoomtoext() {
  conversion(zoomext)
}

//放大缩小
const zoom = $('.ol-zoom')
zoom.addClass('show')
function zoomInOn() {
  conversion(zoom)
}

// 底图切换
// 地图切换
// 矢量图层组与影像图层组初始样式设置
$('.map_vec').css('border-color', 'rgba(64, 158, 255)')
$('.map_img').css('border-color', 'rgba(255, 255, 255)')
// 矢量图层组与影像图层组切换
$('.map_vec').bind('click', function () {
  map.getLayers().item(2).setVisible(true)
  map.getLayers().item(3).setVisible(true)
  map.getLayers().item(0).setVisible(false)
  map.getLayers().item(1).setVisible(false)
  $('.map_vec').css('border-color', 'rgba(64, 158, 255)')
  $('.map_img').css('border-color', 'rgba(255, 255, 255)')
})
$('.map_img').bind('click', function () {
  map.getLayers().item(0).setVisible(true)
  map.getLayers().item(1).setVisible(true)
  map.getLayers().item(2).setVisible(false)
  map.getLayers().item(3).setVisible(false)
  $('.map_vec').css('border-color', 'rgba(255, 255, 255)')
  $('.map_img').css('border-color', 'rgba(64, 158, 255)')
})

// const mapvec = $('.map-vec')
// const mapimg = $('.map-img')
// mapvec.addClass('show')
// mapimg.addClass('show')
const maplist = $('.maplist')
maplist.addClass('show')
function layerSwitch() {
  // conversion(mapvec)
  // conversion(mapimg)
  conversion(maplist)
}



//5. 鹰眼控件
const overviewMapControl = new ol.control.OverviewMap({
  //鹰眼控件样式（see in overviewmap-custom.html to see the custom CSS used）
  className: 'ol-overviewmap ol-custom-overviewmap',
  //鹰眼中加载同坐标系下不同数据源的图层
  layers: [TiandiMap_img, TiandiMap_cia, TiandiMap_vec, TiandiMap_cva],
  view: new ol.View({
    projection: 'EPSG:4326',
  }),
  //鹰眼控件展开时功能按钮上的标识（网页的JS的字符编码）
  collapseLabel: '\u00BB',
  //鹰眼控件折叠时功能按钮上的标识（网页的JS的字符编码）
  label: '\u00AB',
  //初始为展开显示方式
  collapsed: false,
})
//2.5.2 添加控件
map.addControl(overviewMapControl)

const overviewm = $('.ol-overviewmap')
overviewm.addClass('show')
function overview() {
  conversion(overviewm)
}


// 滑块控件
var zoomslider = new ol.control.ZoomSlider({
  // className: 'ol-zoomslider ol-unsele hidden'
})
map.addControl(zoomslider)
const zsl = $('.ol-zoomslider')
zsl.addClass('show')
function zs() {
  conversion(zsl)
  // if (zsl.hasClass('hidden')) {
  //   zsl.removeClass('hidden').addClass('show')
  // } else if (zsl.hasClass('show')) {
  //   zsl.removeClass('show').addClass('hidden')
  // }
}

// 左侧目录
const layerc = $('.layer-container')
function show() {
  if (layerc.hasClass('show')) {
    // alert('已存在图层')
    layerc.removeClass('show').addClass('hidden')
  } else if (layerc.hasClass('hidden')) {
    layerc.removeClass('hidden').addClass('show')
  }

}

function allSwitch() {
  mousep()
  scalel()
  zoomtoext()
  zoomInOn()
  layerSwitch()
  overview()
  zs()
  show()

}
function singleHide(e) {
  if (e.hasClass('show')) {
    e.removeClass('show').addClass('hidden')
  }
}
function singleShow(e) {
  if (e.hasClass('hidden')) {
    e.removeClass('hidden').addClass('show')
  }
}

function allHide() {
  const controlArr = [mposition, sline, zoomext, zoom, maplist, overviewm, zsl, layerc]
  controlArr.forEach(function (e) {
    singleHide(e)
  })
}
function allShow() {
  const controlArr = [mposition, sline, zoomext, zoom, maplist, overviewm, zsl, layerc]
  controlArr.forEach(function(e) {
    singleShow(e)
  })
}

