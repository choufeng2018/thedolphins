<template>
    <div class="row">
        <div class="col-md-12">
            <div class="demo-btn">
                <button type="button" class="btn btn-red btn-outlined btn-square" @click="handleNew">新建</button>
                <button type="button" class="btn btn-orange btn-outlined btn-square" @click="handleShowModals">保存</button>
                <button type="button" class="btn btn-green btn-outlined btn-square" @click="handleDel">删除</button>
                <button type="button" class="btn btn-violet btn-outlined btn-square" @click="handlePreiew" v-if="!isPreiew">预览</button>
                <button type="button" class="btn btn-blue btn-outlined btn-square" @click="handleDesign" v-if="isPreiew">设计</button>
                <button type="button" class="btn btn-blue btn-outlined btn-square" @click="handleProperty">属性</button>
            </div>
        </div>
        <div :class="{'col-md-8':isProperty,'col-md-12':!isProperty}">
            <bt-droplist :componentClass="componentClass" :component-id="100" :component-pid="0" />
        </div>
        <div class="col-md-4" v-if="isProperty">
            <div class="panel panel-violet">
                <div class="panel-heading">属性</div>
                <div class="panel-body pan">
                    <bt-form :item-data="layoutdata" ref="layoutform" :form-data="tabsData" />
                    <div class="form-actions">
                        <div class="col-md-offset-3 col-md-9">
                            <button type="button" class="btn btn-primary" @click="handleSaveCom">保存</button>&nbsp;
                            <button type="button" class="btn btn-primary" @click="handleDelCom">删除</button>&nbsp;
                            <button type="button" class="btn btn-green" @click="handleReset">重置</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="panel panel-green">
                <div class="panel-heading">事件</div>
                <div class="panel-body pan">
                    <div class="form-actions">
                        <div class="col-md-offset-3 col-md-9">
                            <button type="button" class="btn btn-primary" @click="handleSaveEvent">保存</button>&nbsp;
                            <button type="button" class="btn btn-green" @click="handleResetEvent">重置</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <bt-modals :modals-active="showModals" modalsTitle="保存页面" @close="handleClose" @save="handleSave">
            <bt-form :item-data="modalsdata" ref="modalform" :form-data="formData" />
        </bt-modals>
    </div>
</template>
<style>
.demo {
    margin-left: 0px;
    margin-top: 10px;
    padding: 30px 15px 15px;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    position: relative;
    word-wrap: break-word;
    min-height: 823px;
    background-color: #fff;
}

.demo:after {
    border: 1px solid #DDDDDD;
    border-radius: 4px 0 4px 0;
    color: #9DA0A4;
    content: "设计";
    font-size: 12px;
    font-weight: bold;
    left: -1px;
    padding: 3px 7px;
    position: absolute;
    top: -1px;
}

.demo .bt-row:nth-child(odd) {
    background-color: #d3dce6;
    padding: 7px 7px;
}

.demo .bt-row:nth-child(even) {
    background-color: #c5c9c2;
    padding: 7px 7px;
}

.demo .bt-col:nth-child(odd) {
    background-color: #fefefe;
}

.demo .bt-col:nth-child(even) {
    background-color: #efefef;
}

.demo .bt-col:nth-child(odd):after {
    border: 1px solid #efefef;
}

.demo .bt-col:nth-child(even):after {
    border: 1px solid #ffffef;
}

.demo .bt-col {
    min-height: 80px;
    border-radius: 4px;
    padding: 25px 20px;
    padding-bottom: 5px;
}

.demo .bt-col:after {
    border-radius: 4px 0 4px 0;
    color: #9DA0A4;
    content: "列";
    font-size: 12px;
    font-weight: bold;
    left: -1px;
    padding: 3px 7px;
    position: absolute;
    top: -1px;
}

.dragenter {
    border: 1px dashed #ff0000;
}

.dragenter:after {
    border: 1px dashed #ff0000 !important;
}

.btactive {
    border: 1px dashed #ff0000 !important;
}

.btactive:after {
    border: 1px dashed #ff0000 !important;
}

.bt-row.haveactive {
    border: 1px dashed #ff00ff !important;
}

.dragblock {
    display: inline-block;
}
.dg.ac {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 0;
    z-index: 999  !important;
}
.dg li:not(.folder) {
    cursor: auto;
    height: 27px;
    line-height: 25px !important;
    padding: 0 4px 0 5px;
}
.dg .c input[type=text] {
    border: 0;
    margin-top: 0px !important;
    padding: 0px!important; 
    width: 100%;
    float: right;
}
</style>
<script>
import langConfig from '~/lang'
import layouteStore from '~/store/pages/layout.js'
import * as types from '~/store/mutation-types'
import lodash from 'lodash'
import dat from '~/mixins/dat.gui'

export default {
    name: 'BtLayoutPage',
    data() {
        return {
            langConfig,
            showModals: false,
            modalsdata: layouteStore.design,
            layoutdata: layouteStore.layout,
            tabsData: {},
            isPreiew: false,
            componentClass: 'demo',
            isProperty: true,
            formData: [],
            modalsType: types.APPEND_API,
            gui: {}
        }
    },
    mounted() {
        var gui = new dat.gui.GUI()
        this.gui = gui
        this.handleGetData()
    },
    beforeRouteUpdate(to, from, next) {
        next()
        this.handleGetData()
    },
    methods: {
        handleGetData() {
            let vm = this
            let id = vm.$route.params.id
            vm.$store.commit(types.GET_CURRENT_API, 'rb_designmanage')
            if (vm.$store.getters.getCurrentModel['rb_designmanage']) {
                let Mdata = vm.$store.getters.getCurrentModel['rb_designmanage'].data
                let item = lodash.find(Mdata, {
                    '_id': id
                })
                if (item) {
                    vm.$store.state.designid = id
                    vm.$store.state.design = item.design
                    let maxobj = lodash.maxBy(this.$store.state.design, 'id')
                    let maxid = 100
                    if (lodash.isObject(maxobj) && lodash.isInteger(maxobj.id)) {
                        maxid = maxobj.id
                    }
                    vm.$store.state.maxid = maxid
                    let formItem = {}
                    formItem.name = item.name
                    formItem.flag = item.flag
                    formItem._id = id
                    formItem.className = item.className
                    this.formData = []
                    this.formData.push(formItem)
                    console.log(this.formData)
                } else {
                    vm.handleNew()
                    this.formData = []
                }

                var obj = {
                    message: 'Hello World',
                    displayOutline: false,
                    maxSize: 6.0,
                    speed: 5,
                    height: 10,
                    noiseStrength: 10.2,
                    growthSpeed: 0.2,
                    type: 'three',
                    explode: function() {
                        alert('Bang!')
                    },
                    color0: '#ffae23', // CSS string
                    color1: [0, 128, 255], // RGB array
                    color2: [0, 128, 255, 0.3], // RGB with alpha
                    color3: {
                        h: 350,
                        s: 0.9,
                        v: 0.3
                    }
                }

                this.gui.remember(obj)
                this.gui.add(obj, 'message')
                this.gui.add(obj, 'displayOutline')
                this.gui.add(obj, 'explode')
                this.gui.add(obj, 'maxSize').min(-10).max(10).step(0.25)
                this.gui.add(obj, 'height').step(5)
                    // Choose from accepted values
                this.gui.add(obj, 'type', ['one', 'two', 'three'])
                    // Choose from named values
                this.gui.add(obj,
                    'speed', {
                        Stopped: 0,
                        Slow: 0.1,
                        Fast: 5
                    })

                var f1 = this.gui.addFolder('Colors')
                f1.addColor(obj, 'color0')
                f1.addColor(obj, 'color1')
                f1.addColor(obj, 'color2')
                f1.addColor(obj, 'color3')
                var f2 = this.gui.addFolder('Another Folder')
                f2.add(obj, 'noiseStrength')
                var f3 = f2.addFolder('Nested Folder')
                f3.add(obj, 'growthSpeed')

            }
        },
        handleNewAction() {
            this.$store.commit('designInit')
            this.$store.state.maxid = 100
            this.$store.state.designitem.id = this.$store.state.maxid
            this.$store.state.designitem.name = '拖拉列表组件'
            this.$store.state.designitem.component = 'bt-droplist'
            this.$store.state.designitem.componentdata = {}
            this.$store.state.designitem.pid = 0
            this.$store.state.designitem.index = this.$store.state.maxid
            this.$store.state.designitem.real = false

            let designitem = lodash.cloneDeep(this.$store.state.designitem)
            this.$store.commit('designPush', designitem)
        },
        handleNew() {
            let vm = this
            if (this.$store.state.designChange) {
                this.$confirm('新建操作, 设计中有修改是否继续新建?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    vm.handleNewAction()
                    this.$message({
                        type: 'info',
                        message: '已新建成功'
                    })
                }).catch(() => {

                })
            } else {
                vm.handleNewAction()
            }
        },
        handleDel() {
            let vm = this
            let id = vm.$store.state.designid

            this.modalsType = types.EDIT_API
            if (id.length == 0) {
                return
            }

            this.$confirm('页面删除操作, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                vm.$store.dispatch(types.DELETE_API, {
                    'model': 'rb_designmanage',
                    'id': id,
                }).then(() => {
                    vm.handleNew()
                    this.formData = []
                    this.$notify({
                        title: '成功',
                        message: '页面删除成功!',
                        type: 'success'
                    })
                })
            }).catch(() => {

            })
        },
        handlePreiew() {
            this.isPreiew = true
            this.$store.commit('componentColChange', {
                'id': 0,
            })
            this.componentClass = ''
        },
        handleDesign() {
            this.isPreiew = false
            this.componentClass = 'demo'
        },
        handleSaveCom() {

        },
        handleDelCom() {

        },
        handleReset() {

        },
        handleSaveEvent() {

        },
        handleResetEvent() {

        },
        handleProperty() {
            this.isProperty = !this.isProperty
        },
        handleClose() {
            this.showModals = false
        },
        handleSave() {
            let vm = this
            let modalform = vm.$refs.modalform
            let modalformValue = modalform.getForm()
            let id = this.$store.state.designid

            this.modalsType = types.EDIT_API
            if (id.length == 0) {
                this.modalsType = types.APPEND_API
            }
            modalformValue.form.design = this.$store.state.design

            if (modalformValue.validate) {
                if (this.modalsType == types.APPEND_API) {
                    vm.$store.dispatch(types.APPEND_API, {
                        'model': 'rb_designmanage',
                        'form': modalformValue.form
                    }).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '页面新建成功',
                            type: 'success'
                        })
                        vm.showModals = false
                    })
                } else {
                    vm.$store.dispatch(types.EDIT_API, {
                        'model': 'rb_designmanage',
                        'id': id,
                        'form': modalformValue.form,
                    }).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '页面修改成功!',
                            type: 'success'
                        })
                        vm.showModals = false
                    })
                }
            }
        },
        handleShowModals() {
            this.showModals = true
            return false
        },
    },
    computed: {},
}
</script>
