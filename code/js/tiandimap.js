// 设置天地图的key
const key = '3ac822c5ac3f991e72481914b8ddc456'

// 天地图的失量图层
const TiandiMap_vec = new ol.layer.Tile({
  title: '天地图矢量图层',
  source: new ol.source.XYZ({
    url:
      'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + key, // 使用自己申请的天地图密钥,
    wrapX: false,
    //解决导出图片, 画布污染问题
    crossOrigin: 'Anonymous',
  }),
})
// 天地图的矢量注记图层
const TiandiMap_cva = new ol.layer.Tile({
  title: '天地图矢量注记图层',
  source: new ol.source.XYZ({
    url:
      'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + key, // 使用自己申请的天地图密钥
    wrapX: false, // 在横向不重复
    crossOrigin: 'Anonymous',
  }),
})
// 天地图影像图层
const TiandiMap_img = new ol.layer.Tile({
  title: '天地图影像图层',
  source: new ol.source.XYZ({
    url:
      'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + key,
    wrapX: false,
    crossOrigin: 'Anonymous',
  }),
})
// 天地图影像注记图层
const TiandiMap_cia = new ol.layer.Tile({
  title: '天地图影像注记图层',
  source: new ol.source.XYZ({
    url:
      'http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=' + key,
    wrapX: false,
    crossOrigin: 'Anonymous',
  }),
})