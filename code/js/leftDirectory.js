$('#layer-list').on('change', 'input', function () {
  console.log(this)
  let index = $(this).parent().index()
  console.log(index)
  let checked = $(this).prop('checked')
  console.log(checked)

  docLayer.setLayerStatus(index, checked ? 'include' : 'exclude')
})

function toggleLayer(flag) {
  // flag = 0 : 显示失量
  if (flag == 0) {
    gaodeImg.setVisible(false)
    gaodeVec.setVisible(true)
  } else if (flag == 1) {
    gaodeImg.setVisible(true)
    gaodeVec.setVisible(false)
  }
  // flag = 1 : 显示影像
}
// 交互
var shb = $('.triangle-1')
var shb2 = $('.triangle-2')
// let mapdoc1 = $('.map-doc1')
let mapdoc2 = $('.map-doc2')
let layerlist = $('.layer-list')
let layerclose = $('.container-close')
layerclose.on('click', function () {
  layerc.removeClass('show').addClass('hidden')
})
shb.on('click', function () {
  if (shb.hasClass('triangle-start')) {//如果有‘test’的样式，就去除他的样式，添加‘active’的样式
    shb.removeClass('triangle-start').addClass('triangle-active');
    mapdoc2.removeClass('show').addClass('hidden')

  } else if (shb.hasClass('triangle-active')) {//如果有‘active’的样式，就祛除他的样式，添加‘test’的样式
    shb.removeClass('triangle-active').addClass('triangle-start');
    mapdoc2.removeClass('hidden').addClass('show')
  }
})
shb2.on('click', function () {
  if (shb2.hasClass('triangle-start')) {//如果有‘test’的样式，就去除他的样式，添加‘active’的样式
    shb2.removeClass('triangle-start').addClass('triangle-active');
    layerlist.removeClass('show').addClass('hidden')
  } else if (shb2.hasClass('triangle-active')) {//如果有‘active’的样式，就祛除他的样式，添加‘test’的样式
    shb2.removeClass('triangle-active').addClass('triangle-start');
    layerlist.removeClass('hidden').addClass('show')
  }
})
