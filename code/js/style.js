const icon_blue = new ol.style.Style({
    /**{olx.style.IconOptions}类型*/
    image: new ol.style.Icon({
      anchor: [0.5, 60],
      anchorOrigin: 'top-right',
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      offsetOrigin: 'top-right',
      // offset:[0,10],
      //图标缩放比例
      scale: 0.5,
      //透明度
      opacity: 0.75,
      //图标的url
      src: './images/blueIcon.png',
    }),
  })
const icon_red = new ol.style.Style({
    /**{olx.style.IconOptions}类型*/
    image: new ol.style.Icon({
      anchor: [0.5, 60],
      anchorOrigin: 'top-right',
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      offsetOrigin: 'top-right',
      // offset:[0,10],
      //图标缩放比例
      scale: 0.5,
      //透明度
      opacity: 0.75,
      //图标的url
      src: './images/blueIcon.png',
    }),
  })



  const txt = new ol.style.Style({
    text: new ol.style.Text({
      offsetX: 0,
      offsetY: 10,
      font: 'normal 12px 微软雅黑',
      text: '武汉市',
      //文本填充样式（即文字颜色）
      fill: new ol.style.Fill({ color: '#aa3300' }),
      //描边颜色
      stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 }),
    }),
  })

  const label_blue = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 60],
      anchorOrigin: 'top-right',
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      offsetOrigin: 'top-right',
      // offset:[0,10],
      //图标缩放比例
      scale: 0.5,
      //透明度
      opacity: 0.75,
      //图标的url
      src: './images/blueIcon.png',
    }),
    text: new ol.style.Text({
      offsetX: 0,
      offsetY: 10,
      font: 'normal 12px 微软雅黑',
      text: '标注',
      //文本填充样式（即文字颜色）
      fill: new ol.style.Fill({ color: '#aa3300' }),
      //描边颜色
      stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 }),
    }),
  })
  const label_red = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 60],
      anchorOrigin: 'top-right',
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      offsetOrigin: 'top-right',
      // offset:[0,10],
      //图标缩放比例
      scale: 0.5,
      //透明度
      opacity: 0.75,
      //图标的url
      src: './images/Icon-red.png',
    }),
    text: new ol.style.Text({
      offsetX: 0,
      offsetY: 10,
      font: 'normal 12px 微软雅黑',
      text: '标注',
      //文本填充样式（即文字颜色）
      fill: new ol.style.Fill({ color: '#aa3300' }),
      //描边颜色
      stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 }),
    }),
  })

