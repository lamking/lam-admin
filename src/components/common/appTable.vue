<template>
  <div>
    <div class="operating-space">
      <Row type="flex" justify="space-between">
        <i-col span="16">
          <!--操作区-->
          <div class="operating-item">
            <template v-if="item.vIf ? item.vIf() : true " v-for="item in operation">
              <!--使用vIf来控制显示-->
              <template v-if="item.type === 'button'">
                <Button :style="item.style" :type="item.btnType || 'ghost'" @click="item.onClick" :key="item.text">
                  {{item.text}}
                </Button>
              </template>
            </template>
          </div>
        </i-col>
        <i-col span="8">
          <!--搜索区-->
          <div class="search-item" v-if="searchText && showSearch">
            <Row type="flex" align="bottom">
              <i-col span="24">
                <i-input :icon="isSearch ? 'close-circled' : 'search'" v-model="searchValue"
                         :placeholder="'使用' + searchText + '搜索 使用回车键搜索'" style="" @on-enter="searchSubmit('search')"
                         @on-click="searchSubmit"></i-input>
              </i-col>
            </Row>
          </div>
        </i-col>
      </Row>
    </div>
    <div class="filter-box" v-if="filter && filter.length > 0">
      <!--条件筛选区-->
      <Row>
        <i-col span="4" class="filter-item" v-for="item in filter" :key="item.id">
          <!--层级选择-->
          <template v-if="item.type === 'cascader'">
            <Cascader style="width:80%; margin-right: 10px;" :placeholder="item.label" :data="item.cascaderData"
                      change-on-select
                      @on-change="cascaderOnChange"></Cascader>
          </template>
          <!--地址选择-->
          <template v-if="item.type === 'areaCascader'">
            <Cascader :placeholder="item.label" :data="item.cascaderData" change-on-select
                      style="width:95%; margin-right: 10px;"
                      @on-change="areaCascaderOnChange"></Cascader>
          </template>
          <template v-if="item.type === 'datepicker'">
            <DatePicker format="yyyy-MM-dd HH:mm" :type="item.pickerType"
                        :placeholder="item.label" style="width: 95%" v-model="item.time"
                        @on-change="datePickerOnChange" @on-ok="datePickerOnOk"></DatePicker>
          </template>
          <!--默认类型-->
          <template v-if="!item.type">
            <Select remote :filterable="item.filterable" v-model="filterParams[item.field]" style="width:95%"
                    :clearable="item.clearable == '' ? item.clearable : true"
                    :placeholder="item.label" :remote-method="item.remoteMethod">
              <Option v-for="optionsItem in item.options" :value="optionsItem[item.key]" :key="optionsItem[item.field]">
                {{optionsItem[item.fieldLabel]}}
              </Option>
            </Select>
          </template>
        </i-col>
      </Row>
    </div>
    <Table :disabled-hover="false" style="height: 100%" ref="table" :columns="myColumns" :data="tableData"
           :border="border"
           @on-selection-change="onSelectionChange">
    </Table>
    <Row style="margin: 10px 0;" type="flex" justify="space-between">
      <i-col span="12">
        <!--批量操作-->
        <Select size="small" v-model="multipleOpertionItem" style="width: 200px;" placeholder="批量操作"
                v-if="multipleOpertion && multipleOpertion.length > 0">
          <template v-for="(item, index) in multipleOpertion">
            <Option :value="index" :key="item.label">{{item.label}}</Option>
          </template>
        </Select>
        <Button size="small" type="ghost" @click="multipleOpertionClick"
                v-if="multipleOpertion && multipleOpertion.length > 0">确定
        </Button>
      </i-col>
      <i-col span="12">
        <!--分页-->
        <Page style="float: right" :total="pageParams.totalElements" :current="pageParams.page + 1"
              :page-size-opts="[5, 10, 15, 30, 50]" :page-size="pageParams.size" show-sizer @on-change="pageChange"
              show-total v-if="pageParams.totalElements"
              @on-page-size-change="pageSizeChange"></Page>
      </i-col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: 'app-table',
    props: {
      tableColumns: {
        // 表格的列
        type: Array
      },
      url: {
        // 数据请求地址
        type: String
      },
      operation: {
        // 左上角的操作区
        type: Array
      },
      params: {
        // 请求时带的参数
        type: Object
      },
      filter: {
        // 条件筛选
        type: Array,
        default: () => {
          return []
        }
      },
      filterParams: {
        // 条件筛选所绑定的数值
        type: Object
      },
      showCheckbox: {
        // 是否展示多选框
        type: Boolean
      },
      multipleOpertion: {
        // 多选操作
        type: Array
      },
      showSearch: {
        // 是否显示搜索框
        type: Boolean,
        default: () => {
          return true
        }
      },
      customTableData: {
        // 使用父组件的表格数据
      },
      border: {
        // 是否显示表格的Border
        type: Boolean,
        default: () => {
          return false
        }
      }
    },
    data () {
      return {
        myColumns: [],
        tableData: [],
        // 搜索的内容
        searchValue: '',
        // 是否处于搜索状态
        isSearch: false,
        // 分页参数
        pageParams: {
          size: 30, // 每页数量
          page: 0, // 当前页数
          totalElements: 0, // 数据总数
          totalPages: 0 // 数据总页数
        },
        // 多选的操作
        multipleOpertionItem: null,
        // 当前选中项
        isSelectOpertion: [],
        // 用于时间选择器
        datePicker: {
          startTime: '',
          endTime: ''
        }
      }
    },
    computed: {
      /**
       * 根据columns的search字段进行整理数据
       * */
      search () {
        let arr = []
        this.tableColumns.forEach(val => {
          if (val.isSearch) {
            arr.push(val)
          }
          if (val.childrenNode) {
            val.childrenNode.forEach(val2 => {
              if (val2.isSearch) {
                arr.push(val2)
              }
            })
          }
        })
        return arr
      },
      /**
       * 根据search字段处理搜索的提示字符
       * */
      searchText () {
        return this.handlerSearchText()
      }
    },
    watch: {
      /**
       * 选择了筛选框
       * */
      filterParams: {
        deep: true,
        handler: function () {
          // console.log('选择了筛选框')
          this.getData()
        }
      },
      customTableData: {
        // 父组件的数据传进来
        deep: true,
        handler: function () {
          // console.log('父组件的数据传进来')
          this.getData()
        }
      }
    },
    mounted () {
      this.getData()
      this.handlerFilter()
    },
    methods: {
      /**
       * 处理列表的渲染
       * Tips：根据columns的type进行渲染
       * */
      renderColumns () {
        let arr = []
        this.tableColumns.forEach(val => {
          if (val.vIf ? val.vIf() : true) {
            // 使用vIf控制是否渲染列
            if (val.type === 'group') {
              // 目前只支持一组
              val.children = val.childrenNode
              val.children.map(val => {
                val.render = this.renderMethods(val)
              })
            } else {
              val.render = this.renderMethods(val)
            }
            arr.push(val)
          } else {
          }
        })
        // 展示多选框
        if (this.showCheckbox) {
          arr.unshift({
            type: 'selection',
            width: 60,
            align: 'center'
          })
        }
        this.myColumns = arr
      },
      renderMethods (val) {
        let rowRenders = {}
        rowRenders = {
          img: (h, {column, index, row}) => {
            // 设置一个默认的图片样式
            let style = {
              height: '40px'
            }
            return h('img', {
              attrs: {
                src: row[val.key]
              },
              style: val.style || style,
              on: {
                click: () => {
                  this.$store.dispatch('openPreview', row[val.key])
                }
              }
            })
          },
          custom: (h, {column, index, row}) => {
            return val.customRender(h, {column, index, row})
          },
          'switch': (h, {column, index, row}) => {
            return val.customRender(h, {column, index, row})
          },
          filter: (h, {column, index, row}) => {
            let findObj = {}
            column.filterOptions.forEach(val => {
              if (val.value === row[column.key]) {
                findObj = val
                return true
              }
            })
            return h('span', findObj.label)
          },
          dropdown: (h, {column, index, row}) => {
            // 处理展示数据
            let arr = []
            val.dropdownList.forEach(val => {
              if (typeof val.vIf === 'function') {
                if (val.vIf({column, index, row})) {
                  arr.push(
                    h('DropdownItem', {
                      props: {
                        name: val.name
                      }
                    }, val.name)
                  )
                }
              } else {
                arr.push(
                  h('DropdownItem', {
                    props: {
                      name: val.name
                    }
                  }, val.name)
                )
              }
            })
            return h('Dropdown', {
              props: {
                trigger: 'click'
              },
              on: {
                'on-click': (name) => {
                  // 根据dropDownItem的name值查询
                  let obj = val.dropdownList.find((val) => {
                    return val.name === name
                  })
                  obj.onClick({column, index, row})
                }
              }
            }, [
              h('Button', {
                props: {
                  type: (val.button && val.button.type) || 'ghost'
                }
              }, [
                h('a', {
                  style: {
                    color: (val.button && val.button.type === 'primary') ? '#fff' : '#333',
                    marginRight: '5px'
                  }
                }, (val.button && val.button.label) || '操作'),
                h('Icon', {
                  props: {
                    type: 'arrow-down-b'
                  }
                })
              ]),
              h('DropdownMenu', {
                slot: 'list'
              }, arr)
            ])
          },
          customIndex: (h, {column, index, row}) => {
            // 序号
            let customIndex = (index + (this.pageParams.size * this.pageParams.page)) + 1
            return h('span', customIndex)
          },
          objType: (h, {column, index, row}) => {
            // 对象内取值 默认取2级 使用level指定层级
            let arr = column.objEle.split('.')
            let str = ''
            switch (column.level) {
              case 3:
                str = row[arr[0]] && row[arr[0]][arr[1]][arr[2]]
                break
              case 4:
                str = row[arr[0]] && row[arr[0]][arr[1]][arr[2]][arr[3]]
                break
              default:
                str = row[arr[0]] && row[arr[0]][arr[1]]
            }
            return h('span', str)
          },
          price: (h, {column, index, row}) => {
            // 将价格格式化为两位小数
            return h('span', row[column.key].toFixed(2))
          },
          url: (h, {column, index, row}) => {
            return h('a', {
              on: {
                click: () => {
                  window.open(row[column.key])
                }
              }
            }, row[column.key])
          }
        }
        return rowRenders[val.type]
      },
      /**
       * 获取数据 渲染表格
       * */
      getData () {
        if (this.customTableData) {
          this.tableData = this.customTableData
          this.pageParams.totalElements = this.customTableData.totalElements
          this.pageParams.totalPages = this.customTableData.totalPages
          this.renderColumns()
        } else {
          this.$http.post(this.url, Object.assign({}, this.pageParams, this.params, this.filterParams, {query: this.searchValue})).then((res) => {
            this.tableData = res.data.content
            this.pageParams.totalElements = res.data.totalElements
            this.pageParams.totalPages = res.data.totalPages
            this.pageParams.size = res.data.size
            // 获取完数据 渲染列数据
            this.renderColumns()
          })
        }
      },
      /**
       * 导出表格
       * Tips: 导出成CSV表格
       * @param myFileName 文件名
       * @param columns 列字段的规则 默认是根据columns的exportCsv字段判断
       */
      // Todo 根据filter条件进行导出
      exportCsv (myFileName, columns) {
        this.$refs.table.exportCsv({
          filename: myFileName,
          columns: columns || this.myColumns.filter((col, index) => {
            return col.exportCsv
          }),
          data: this.tableData
        })
      },
      /**
       * 搜索
       * */
      // TODO 加点展开动画
      searchSubmit (event) {
        if (this.isSearch && event !== 'search') {
          this.searchValue = ''
          this.isSearch = false
        } else {
          this.isSearch = true
        }
        this.getData()
      },
      /**
       * 页码切换时触发
       * */
      pageChange (index) {
        console.log('页码切换时触发')
        this.pageParams.page = index - 1
        this.getData()
      },
      /**
       * 每页数量切换时触发
       * */
      pageSizeChange (size) {
        console.log('每页数量切换时触发')
        if (this.pageParams.size !== size) {
          // 为了处理 一个页面自动会获取两次数据的BUG
          this.pageParams.size = size
          this.pageParams.page = 0
          this.getData()
        }
      },
      /**
       * 将筛选功能中的label作为一个选项，意思就是全部
       * */
      handlerFilter () {
        // this.filter.map(val => {
        //   val.options.unshift({
        //     id: ' ',
        //     label: val.label
        //   })
        // })
      },
      /**
       * 执行批量操作
       * */
      // Todo 加入一些常规的操作，例如删除
      multipleOpertionClick () {
        let ids = []
        this.isSelectOpertion.forEach(val => {
          ids.push(val.id)
        })
        if (ids.length <= 0) {
          this.$Message.error('请选择条目')
          return
        }
        // 返回选中条目的ID与当前行数据
        if (JSON.stringify(this.multipleOpertionItem) !== 'null') {
          this.multipleOpertion[this.multipleOpertionItem].onClick(ids, this.isSelectOpertion)
        }
      },
      /**
       * 触发多选时的操作
       * */
      onSelectionChange (selection) {
        this.isSelectOpertion = selection
      },
      /**
       * 层级选择器回调
       * @param e
       */
      cascaderOnChange (value, selectedData) {
        let arrLength = value.length
        switch (arrLength) {
          case 1:
            this.filterParams[selectedData[0]['CascaderField'][0]] = value[0]
            this.filterParams[selectedData[0]['CascaderField'][1]] = ''
            this.filterParams[selectedData[0]['CascaderField'][2]] = ''
            break
          case 2:
            this.filterParams[selectedData[0]['CascaderField'][1]] = value[1]
            this.filterParams[selectedData[0]['CascaderField'][2]] = value[2]
            break
          case 3:
            this.filterParams[selectedData[0]['CascaderField'][2]] = value[2]
            break
        }
      },
      /**
       * 地址层级选择器
       * 针对地区选择
       */
      areaCascaderOnChange (value, selectedData) {
        this.filterParams['area.provinceId'] = value[0]
        this.filterParams['area.cityId'] = value[1]
        // this.filterParams['area.id'] = value[1]
      },
      /**
       * 日期选择器
       */
      datePickerOnChange (e) {
        if (e[0] && e[1]) {
          // 默认使用固定字段进行时间筛选
          this.datePicker['startTime'] = e[0] && (e[0] + ':00')
          this.datePicker['endTime'] = e[1] && (e[1] + ':00')
        } else {
          this.filterParams['startTime'] = ''
          this.filterParams['endTime'] = ''
        }
      },
      datePickerOnOk () {
        this.filterParams['startTime'] = this.datePicker['startTime']
        this.filterParams['endTime'] = this.datePicker['endTime']
      },
      handlerSearchText () {
        let arr = []
        this.search.forEach(val => {
          arr.push(val.title)
        })
        return arr.length > 0 ? arr.join('、') : ''
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .operating-space {
    margin-bottom: 10px;
    .operating-item {
      button {
        margin: 0 10px 10px 0;
      }
    }
  }

  .filter-box {
    .filter-title {
      margin-bottom: 10px;
    }
    .filter-item {
      margin-bottom: 10px;
    }
  }
</style>
<style>
  .ivu-table th {
    background: none !important;
    height: 42px !important;
  }
</style>
