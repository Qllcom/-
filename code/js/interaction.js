/**
 * 根据type类型, 创建画笔
 * @param {ol.source.Vector} source: 画布对象
 * @param {string} type: 支持的画笔的类型['Point', 'LineString', 'Circle', 'Polygon', 'Square', 'Box']
 * @param {function} callback: 绘制完成的回调函数
 * @returns {ol.interaction.Draw} 交互式画笔对象
 */
function createDraw(source, type, callback) {
  let geometryFunction = null
  let maxPoints = null

  const support = ['Point', 'LineString', 'Circle', 'Polygon', 'Square', 'Box']
  if (!support.includes(type)) {
    type = 'Point' // 默认值为点
  }
  if (type == 'Square') {
    // 特殊处理
    type = 'Circle'
    geometryFunction = ol.interaction.Draw.createRegularPolygon(4)
  } else if (type == 'Box') {
    type = 'LineString'
    geometryFunction = function (coordinates, geometry) {
      if (!geometry) {
        //多边形
        geometry = new ol.geom.Polygon(null)
      }
      var start = coordinates[0]
      var end = coordinates[1]
      geometry.setCoordinates([
        [start, [start[0], end[1]], end, [end[0], start[1]], start],
      ])
      return geometry
    }
    maxPoints = 2
  }
  let draw = null

  draw = new ol.interaction.Draw({
    source: source,
    type: type,
    geometryFunction: geometryFunction,
    maxPoints: maxPoints,
  })

  callback && draw.on('drawend', callback)
  return draw
}
