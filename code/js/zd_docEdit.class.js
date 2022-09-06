// 定义常量
const HOST = 'localhost'
const PORT = '6163'
const POINT_STYLE = {
  Angle: 0, // 角度
  Color: 6, // 子图的颜色号
  Space: 0,
  SymHeight: 5, // 点的高度
  SymID: 21, // 子图号
  SymWidth: 5, // 点的宽度
}
// const POINT_STYLE = {
//   Angle: 0, // 角度
//   Color: 541, // 子图的颜色号
//   Space: 0,
//   SymHeight: 5, // 点的高度
//   SymID: 31, // 子图号
//   SymWidth: 5, // 点的宽度
// }
const LINE_STYLE = {
  Color: 1, // 子图颜色号
  LinStyleID: 0, // 对应mapGIS符号样式后面的值
  LinStyleID2: 17, // 对应mapGIS符号样式前面的值
  LinWidth: 0.1, // 线宽
  Xscale: 10,
  Yscale: 10,
}
const POLYGON_STYLE = {
  EndColor: 1,
  FillColor: 107,
  FillMode: 0,
  OutPenWidth: 1,
  OverMethod: 0,
  PatAngle: 1,
  PatColor: 1,
  PatHeight: 1,
  PatID: 27,
  PatWidth: 1,
}

/**
 * 定义一个构造函数, 模拟Point类
 * @param {object} options :
 *                    - doc: 中地的地图文档
 *                    - style: 点的样式
 *                    - fields: 字段列表 {字段名: 字段类型} eg.{name:'string'}
 *                    - layerID: 图层编号, 从0开始
 */
class Point {
  // 静态属性
  static doc = null

  // 定义构造函数
  constructor(options) {
    // 在构造函数中, 完成属性的定义
    this.style = options.style || POINT_STYLE
    this.fName = options.fields ? Object.keys(options.fields) : []
    this.fLength = this.fName.length || 0
    this.fType = options.fields ? Object.values(options.fields) : []

    // self表示当前类
    self.doc = options.doc // 静态属性
    this.host = self.doc.ip || HOST
    this.port = self.doc.port || PORT
    this.layerID = options.layerID
  }

  /**
   * 添加点
   * @param {array} point : 点坐标(一维数组) [x,y]
   * @param {array} attr : 属性值
   * @param {function} callback : 回调函数
   */
  add(point, attr, callback) {
    if (!Array.isArray(point)) {
      throw new TypeError('第一个参数必须是一个数组, 长度为2')
    }

    if (!Array.isArray(attr)) {
      throw new TypeError('第二个参数必须是一个数组')
    }

    // 2.1 构建几何信息
    //创建一个点形状，描述点形状的几何信息
    var gpoint = new Zondy.Object.GPoint(point[0], point[1]) //createPoint();
    //设置当前点要素的几何信息
    var fGeom = new Zondy.Object.FeatureGeometry({ PntGeom: [gpoint] })
    // 2.2 设置样式信息
    //描述点要素的符号参数信息
    var pointInfo = new Zondy.Object.CPointInfo(this.style)
    //设置当前点要素的图形参数信息
    var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
      InfoType: 1, // 点
      PntInfo: pointInfo,
    })
    // 2.3 设置属性信息
    //设置添加点要素的属性信息
    var attValue = attr
    // 2.4 构建要素对象
    //创建一个要素
    var feature = new Zondy.Object.Feature({
      fGeom: fGeom,
      GraphicInfo: webGraphicInfo,
      AttValue: attValue,
    })
    //设置要素为点要素
    feature.setFType(1)
    // 2.5 设置要素集
    //创建一个要素数据集
    var featureSet = new Zondy.Object.FeatureSet()
    //设置属性结构
    var cAttStruct = new Zondy.Object.CAttStruct({
      FldName: this.fName, // 属性的字段名
      FldNumber: this.fLength, // 属性的个数
      FldType: this.fType, // 属性的类型
    })
    featureSet.AttStruct = cAttStruct
    //添加要素到要素数据集
    featureSet.addFeature(feature)

    // 2.6 调用编辑服务接口
    //创建一个编辑服务类
    // 第一个参数: 服务的名称
    // 第二个参数: 图层的编号
    var editService = new Zondy.Service.EditDocFeature(
      self.doc.name,
      this.layerID,
      {
        ip: this.host,
        port: this.port, //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )

    if (callback) {
      editService.add(featureSet, callback)
    } else {
      editService.add(featureSet, this.onSuccess)
    }
  }

  /**
   * 删除点
   * @param {string} fids : OID列表, 多个OID之间使用,连接 eg: '9,10'
   * @param {function} callback : 成功的回调
   */
  del(fids, callback) {
    const deleteService = new Zondy.Service.EditDocFeature(
      self.doc.name,
      this.layerID,
      {
        ip: this.host,
        port: this.port, //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )

    if (callback) {
      deleteService.deletes(fids, callback)
    } else {
      deleteService.deletes(fids, this.onSuccess)
    }
  }

  /**
   * 更新点
   * @param {string} fid : OID唯一标识
   * @param {array} point : 新的坐标([x, y]), 可以为null: 不修改坐标
   * @param {array} attr : 新的属性列表, 可以为null: 不修改属性
   * @param {object} style : 点的样式对象, 可以为null: 不修改样式
   * @param {function} callback : 回调
   */
  update(fid, point, attr, style, callback) {
    // 根据fid查询旧数据
    const query = new Query({
      service: self.doc.name,
      layerID: this.layerID,
    })
    query.queryByFID(fid, (result) => {
      // 使用传递的数据覆盖产生新数据
      // 调用更新接口

      var fGeom = result.SFEleArray[0].fGeom
      var webGraphicInfo = result.SFEleArray[0].webGraphicInfo
      var attValue = result.SFEleArray[0].AttValue.slice(0, 1)

      if (point) {
        //创建一个点形状，描述点形状的几何信息
        var gpoint = new Zondy.Object.GPoint(point[0], point[1]) //createPoint();
        //设置当前点要素的几何信息
        fGeom = new Zondy.Object.FeatureGeometry({ PntGeom: [gpoint] })
      }

      // 2.2 设置样式信息
      //描述点要素的符号参数信息
      if (style) {
        var pointInfo = new Zondy.Object.CPointInfo(style)
        //设置当前点要素的图形参数信息
        webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
          InfoType: 1, // 点
          PntInfo: pointInfo,
        })
      }

      // 2.3 设置属性信息
      //设置添加点要素的属性信息
      if (attr) {
        attValue = attr
      }

      // 2.4 构建要素对象
      //创建一个要素
      var feature = new Zondy.Object.Feature({
        fGeom: fGeom,
        GraphicInfo: webGraphicInfo,
        AttValue: attValue,
      })
      //设置要素为点要素
      feature.setFType(1)
      feature.setFID(result.SFEleArray[0].FID)
      // 2.5 设置要素集
      //创建一个要素数据集
      var featureSet = new Zondy.Object.FeatureSet()
      //设置属性结构
      var cAttStruct = new Zondy.Object.CAttStruct({
        FldName: this.fName, // 属性的字段名
        FldNumber: this.fLength, // 属性的个数
        FldType: this.fType, // 属性的类型
      })
      featureSet.AttStruct = cAttStruct
      //添加要素到要素数据集
      featureSet.addFeature(feature)

      //创建一个编辑服务类
      var editService = new Zondy.Service.EditDocFeature(
        self.doc.name,
        this.layerID,
        {
          ip: this.host,
          port: this.port, //访问IGServer的端口号，.net版为6163，Java版为8089
        }
      )
      if (callback) {
        editService.update(featureSet, callback)
      } else {
        editService.update(featureSet, this.onSuccess)
      }
    })
  }

  onSuccess(data) {
    if (data.succeed) {
      alert('成功!')
      self.doc.refresh() // 重新加载地图文档
    } else {
      alert('失败!')
    }
  }
}

class Line {
  static doc = null
  // 定义构造函数
  constructor(options) {
    this.style = options.style || LINE_STYLE
    this.fName = options.fields ? Object.keys(options.fields) : []
    this.fLength = this.fName.length || 0
    this.fType = options.fields ? Object.values(options.fields) : []

    // self表示当前类
    self.doc = options.doc // 静态属性
    this.host = self.doc.ip || HOST
    this.port = self.doc.port || PORT
    this.layerID = options.layerID
  }

  /**
   * 添加线要素
   * @param {array} points : 二维数组 [[x1, y1], [x2, y2]...]
   * @param {array} attr : 属性值
   * @param {function} callback : 回调函数
   */
  add(points, attr, callback) {
    // points: [[x1, y1], [x2, y2]...]
    // arr [{}, {}]
    if (!Array.isArray(points)) {
      throw new TypeError('第一个参数必须是两维数组')
    }
    // 构建线要素的点
    const pointObj = []
    for (const item of points) {
      // item: [x1, y1]
      pointObj.push(new Zondy.Object.Point2D(item[0], item[1]))
    }
    //构成折线的弧段
    const gArc = new Zondy.Object.Arc(pointObj)
    //构成线的折线
    const gAnyLine = new Zondy.Object.AnyLine([gArc])
    //设置线要素的几何信息
    const gline = new Zondy.Object.GLine(gAnyLine)
    //设置要素的几何信息
    const fGeom = new Zondy.Object.FeatureGeometry({ LinGeom: [gline] })

    // 设置样式信息
    //设置添加线要素的图形参数信息
    const clineInfo = new Zondy.Object.CLineInfo(this.style)
    //设置要素的图形参数信息
    const graphicInfo = new Zondy.Object.WebGraphicsInfo({
      InfoType: 2,
      LinInfo: clineInfo,
    })

    //创建一个线要素
    const newFeature = new Zondy.Object.Feature({
      fGeom: fGeom,
      GraphicInfo: graphicInfo,
      AttValue: attr,
    })
    //设置要素为线要素
    newFeature.setFType(2)

    //创建一个要素数据集
    const featureSet = new Zondy.Object.FeatureSet()

    //创建属性结构设置对象
    const cAttStruct = new Zondy.Object.CAttStruct({
      FldName: this.fName,
      FldNumber: this.fLength,
      FldType: this.fType,
    })
    //设置要素数据集的树形结构
    featureSet.AttStruct = cAttStruct
    //将添加的线要素添加到属性数据集中
    featureSet.addFeature(newFeature)

    //创建一个地图编辑对象
    var editDocFeature = new Zondy.Service.EditDocFeature(
      self.doc.name,
      this.layerID,
      {
        ip: this.host,
        port: this.port, //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    if (callback) {
      editDocFeature.add(featureSet, callback)
    } else {
      editDocFeature.add(featureSet, this.onSuccess)
    }
  }

  onSuccess(data) {
    if (data.succeed) {
      alert('成功!')
      self.doc.refresh() // 重新加载地图文档
    } else {
      alert('失败!')
    }
  }
}

class Polygon {
  static doc = null
  // 定义构造函数
  constructor(options) {
    this.style = options.style || POLYGON_STYLE
    this.fName = options.fields ? Object.keys(options.fields) : []
    this.fLength = this.fName.length || 0
    this.fType = options.fields ? Object.values(options.fields) : []

    // self表示当前类
    self.doc = options.doc // 静态属性
    this.host = self.doc.ip || HOST
    this.port = self.doc.port || PORT
    this.layerID = options.layerID
  }

  /**
   * 添加区要素
   * @param {array} points 三维数组, [0: [[x1, y1], [x2, y2]...]]
   * @param {*} attr
   * @param {*} callback
   */
  add(points, attr, callback) {
    // 2.1 构建几何信息
    var pointObj = new Array()
    // points: 三维数组
    // 下标为0: 第一个多边形(区)
    for (let item of points[0]) {
      pointObj.push(new Zondy.Object.Point2D(item[0], item[1]))
    }
    //设置区要素的几何信息
    var gArc = new Zondy.Object.Arc(pointObj)
    //构成区要素折线
    var gAnyLine = new Zondy.Object.AnyLine([gArc])
    //构成区要素
    var gRegion = new Zondy.Object.GRegion([gAnyLine])
    //构成区要素的几何信息
    var fGeom = new Zondy.Object.FeatureGeometry({ RegGeom: [gRegion] })
    // 2.2 设置样式信息
    //设置区要素的图形参数信息
    var cRegionInfo = new Zondy.Object.CRegionInfo(this.style)
    //要素图形参数信息
    var graphicInfo = new Zondy.Object.WebGraphicsInfo({
      InfoType: 3,
      RegInfo: cRegionInfo,
    })
    // 2.3 设置属性信息

    // 2.4 构建区要素对象
    //创建一个新的区要素
    var newFeature = new Zondy.Object.Feature({
      AttValue: attr,
      fGeom: fGeom,
      GraphicInfo: graphicInfo,
    })
    newFeature.setFType(3)
    // 2.5 设置要素集
    //创建一个要素数据集
    var featureSet = new Zondy.Object.FeatureSet()

    var cAttValue = new Zondy.Object.CAttStruct({
      FldNumber: this.fLength,
      FldType: this.fType,
      FldName: this.fName,
    })
    featureSet.AttStruct = cAttValue
    featureSet.addFeature(newFeature)
    // 2.6 调用地图编辑服务接口
    //创建一个要素编辑服务对象
    var editDocFeature = new Zondy.Service.EditDocFeature(
      self.doc.name,
      this.layerID,
      {
        ip: this.host,
        port: this.port, //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    if (callback) {
      editDocFeature.add(featureSet, callback)
    } else {
      editDocFeature.add(featureSet, this.onSuccess)
    }
  }

  onSuccess(data) {
    if (data.succeed) {
      alert('成功!')
      self.doc.refresh() // 重新加载地图文档
    } else {
      alert('失败!')
    }
  }
}

class Query {
  constructor(options) {
    this.service = options.service
    this.layerID = options.layerID
    this.host = options.host || HOST
    this.port = options.port || PORT
  }

  /**
   * 点查询
   * @param {array} point : 创建的点创建坐标
   * @param {function} querySuccess : 查询成功的回调
   * @param {function} queryError : 查询失败的回调
   */
  queryByPnt(point, querySuccess, queryError) {
    // 2.2 创建一个用于查询的点
    const pointObj = new Zondy.Object.Point2D(point[0], point[1])
    // 设置查询的搜索半径(容差半径)
    pointObj.nearDis = 0.001

    // 2.3 创建查询结构对象, 告诉服务端查询结果中应该包含哪些信息
    const queryStruct = new Zondy.Service.QueryFeatureStruct()
    // 是否包含几何信息
    queryStruct.IncludeAttribute = true
    // 是否包含属性信息
    queryStruct.IncludeGeometry = true
    // 是否样式信息
    queryStruct.IncludeWebGraphic = true

    // 2.4 创建查询规则
    const rule = new Zondy.Service.QueryFeatureRule({
      //是否相交
      Intersect: true,
    })

    // 2.5 创建查询参数对象
    const queryParam = new Zondy.Service.QueryParameter({
      geometry: pointObj,
      resultFormat: 'json',
      struct: queryStruct,
      rule: rule,
      //显示查询到的要素数量
      cursorType: null,
    })

    // 2.6 实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      this.service,
      this.layerID,
      {
        ip: this.host,
        port: this.port, //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(querySuccess, queryError)
  }

  /**
   * 根据几何信息查询
   * @param {ol.Feature.Geometry} geom : 用于查询的几何图形
   * @param {function} querySuccess : 成功的回调
   */
  queryByGeom(geom, querySuccess) {
    if (!querySuccess) {
      throw new Error('必须设置第二个参数(成功的回调)')
    }
    // 3.1 创建查询的几何图形
    // 创建一个用于查询的区
    const geomObj = new Zondy.Object.Polygon()
    // 将ol的几何图形转换成中地的几何图形
    geomObj.setByOL(geom)

    // 3.2 设置查询的结构
    const queryStruct = new Zondy.Service.QueryFeatureStruct({
      IncludeAttribute: true, // 需要包含属性信息
      IncludeGeometry: true, // 需要包含几何信息
      IncludeWebGraphic: true, // 需要包含样式信息
    })

    // 3.3 设置查询规则
    const rule = new Zondy.Service.QueryFeatureRule({
      //是否相交
      Intersect: true,
    })

    // 3.4 创建查询参数
    const queryParam = new Zondy.Service.QueryParameter({
      geometry: geomObj,
      struct: queryStruct,
      rule: rule,
      //显示查询到的要素数量
      cursorType: null,
    })

    // 3.5 调用查询的接口
    const queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      this.service,
      this.layerID,
      {
        ip: this.host,
        port: this.port, //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(querySuccess)
  }

  /**
   * 根据sql查询
   * @param {string} sql : sql的where条件语句
   * @param {function} querySuccess : 成功的回调
   */
  queryBySQL(sql, querySuccess) {
    // 2.1 设置查询结构
    const queryStruct = new Zondy.Service.QueryFeatureStruct({
      IncludeAttribute: true, // 需要包含属性信息
      IncludeGeometry: true, // 需要包含几何信息
      IncludeWebGraphic: true, // 需要包含样式信息
    })
    // 2.2 设置查询参数, where条件
    const queryParam = new Zondy.Service.QueryParameter({
      struct: queryStruct,
      //显示查询到的要素数量
      cursorType: null,
    })
    queryParam.where = sql
    // 2.3 调用查询接口
    const queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      this.service,
      this.layerID,
      {
        ip: this.host,
        port: this.port, //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(querySuccess)
  }

  /**
   * 根据OID查询
   * @param {string} fids : OID的值, 多个值使用,连接(中间不能写空格) eg '1,2'
   * @param {function} querySuccess : 成功的回调
   */
  queryByFID(fids, querySuccess) {
    // 2.1 设置查询结构
    const queryStruct = new Zondy.Service.QueryFeatureStruct({
      IncludeAttribute: true, // 需要包含属性信息
      IncludeGeometry: true, // 需要包含几何信息
      IncludeWebGraphic: true, // 需要包含样式信息
    })
    // 2.2 设置查询参数, where条件
    const queryParam = new Zondy.Service.QueryParameter({
      objectIds: fids,
      struct: queryStruct,
      //显示查询到的要素数量
      cursorType: null,
    })
    // 2.3 调用查询接口
    const queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      this.service,
      this.layerID,
      {
        ip: this.host,
        port: this.port, //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(querySuccess)
  }
}
