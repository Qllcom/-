let draw_del = null
function dels() {
  draw_del = createDraw(source, 'Box', function (e) {
    // 执行交互拉框查询
    const query = new Query({
      service: 'traffic',
      layerID: 4,
    })
    query.queryByGeom(e.feature.getGeometry(), delsSuccess)
  })
  map.addInteraction(draw_del)
}
// 6.3 实现删除成功的回调
function delsSuccess(result) {
  const fids = result.SFEleArray.map(function (item) {
    return item.FID
  }).toString()
  console.log(fids) // '7,15,14'

  // 调用删除接口
  const zd_point = new Point({
    doc: docLayer,
    layerID: 4,
  })
  zd_point.del(fids)

  // 收尾性的工作
  source.clear()
  map.removeInteraction(draw_del)
}



function del() {
  draw_del = createDraw(source, 'Point', function (e) {
    // 执行交互拉框查询
    const query = new Query({
      service: 'traffic',
      layerID: 4,
    })
    query.queryByPnt(e.feature.getGeometry().getCoordinates(), delSuccess)
    // query.queryByGeom(e.feature.getGeometry(), delSuccess)
  })
  map.addInteraction(draw_del)
}

function delSuccess(result) {
  const fids = result.SFEleArray.map(function (item) {
    return item.FID
  }).toString()
  console.log(fids) // '7,15,14'

  // 调用删除接口
  const zd_point = new Point({
    doc: docLayer,
    layerID: 4,
  })
  zd_point.del(fids)

  // 收尾性的工作
  source.clear()
  map.removeInteraction(draw_del)
}
