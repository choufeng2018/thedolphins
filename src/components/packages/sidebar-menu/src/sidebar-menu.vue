<template>
    <nav id="sidebar" role="navigation" class="navbar-default navbar-static-side">
        <div class="sidebar-collapse menu-scroll" id="side-menu">
            <bt-menu>
                <li class="user-panel">
                    <div class="thumb">
                        <img src="/assets/128.png" alt="" class="img-circle" />
                    </div>
                    <div class="info">
                        <p>林祖鑫</p>
                        <ul class="list-inline list-unstyled">
                            <li><a href="extra-profile.html" data-hover="tooltip" title="Profile"><i class="fa fa-user"></i></a>
                            </li>
                            <li><a href="email-inbox.html" data-hover="tooltip" title="Mail"><i class="fa fa-envelope"></i></a>
                            </li>
                            <li><a href="#" data-hover="tooltip" title="Setting" data-toggle="modal" data-target="#modal-config"><i class="fa fa-cog"></i></a>
                            </li>
                            <li><a href="extra-signin.html" data-hover="tooltip" title="Logout"><i class="fa fa-sign-out"></i></a>
                            </li>
                        </ul>
                    </div>
                    <div class="clearfix"></div>
                </li>
                <bt-menu-item v-for="(menuItem, index) in menuStore" :to="menuItem.to" :menu-name="menuItem.menuName" :menu-title="menuItem.menuTitle" :menu-icon="menuItem.menuIcon">
                    <template v-if="menuItem.menu">
                        <bt-menu navlevel="1" collapse="true">
                            <template v-if="menuItem.menutree">
                                <bt-menu-item v-for="menuItem1 in rb_desigMenu" :to="menuItem1.to" :menu-name="menuItem1.menuName" :menu-title="menuItem1.menuTitle" :menu-icon="menuItem1.menuIcon">
                                    <template v-if="menuItem1.menu">
                                        <bt-menu navlevel="2" collapse="true">
                                            <bt-menu-item v-for="(menuItem2, index2) in menuItem1.menu" :to="menuItem2.to" :menu-name="menuItem2.menuName" :menu-title="menuItem2.menuTitle" :menu-icon="menuItem2.menuIcon" :draggable="menuItem2.component?true:false" :component="menuItem2.component" :component-data="menuItem2.componentdata" />
                                        </bt-menu>
                                    </template>
                                </bt-menu-item>
                            </template>
                            <template v-else>
                                <bt-menu-item v-for="(menuItem1, index1) in menuItem.menu" :to="menuItem1.to" :menu-name="menuItem1.menuName" :menu-title="menuItem1.menuTitle" :menu-icon="menuItem1.menuIcon">
                                    <template v-if="menuItem1.menu">
                                        <bt-menu navlevel="2" collapse="true">
                                            <bt-menu-item v-for="(menuItem2, index2) in menuItem1.menu" :to="menuItem2.to" :menu-name="menuItem2.menuName" :menu-title="menuItem2.menuTitle" :menu-icon="menuItem2.menuIcon" :draggable="menuItem2.component?true:false" :component="menuItem2.component" :component-data="menuItem2.componentdata" />
                                        </bt-menu>
                                    </template>
                                </bt-menu-item>
                            </template>
                        </bt-menu>
                    </template>
                </bt-menu-item>
            </bt-menu>
        </div>
    </nav>
</template>
<script>
import langConfig from '~/lang'
import * as types from '~/store/mutation-types'
import lodash from 'lodash'

export default {
    name: 'BtSidebarMenu',
    props: ['menuStore'],
    data() {
        return {
            langConfig,
            tableName: ['rb_designmanage', 'rb_designclass'],
            rb_desigMenu: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    methods: {
        handleNodeClick(data) {
            console.log(data)
        },
        eventData() {
            let vm = this

            vm.$store.commit(types.GET_CURRENT_API, 'rb_designclass')

            let filterData = {}
            let menuItem = {
                menuTitle: '默认页面',
                menuIcon: 'fa-credit-card',
                menuName: 'menu1',
                menu: []
            }
            filterData.default = menuItem
            if (vm.$store.getters.getCurrentModel['rb_designclass']) {
                let data = vm.$store.getters.getCurrentModel['rb_designclass'].data

                data.forEach(item => {
                    let menuItemTemp = {}
                    menuItemTemp.menuTitle = item.className
                    menuItemTemp.menuIcon = 'fa-credit-card'
                    menuItemTemp.menuName = 'menu1'
                    menuItemTemp.menu = []
                    filterData[item._id] = menuItemTemp
                })
                vm.$store.commit(types.GET_CURRENT_API, 'rb_designmanage')
                if (vm.$store.getters.getCurrentModel['rb_designmanage']) {
                    let Mdata = vm.$store.getters.getCurrentModel['rb_designmanage'].data
                    Mdata.forEach(item => {
                        let dateitem = lodash.find(data, {
                            '_id': item.className
                        })
                        let menuItemTemp = {}
                        menuItemTemp.menuTitle = item.name
                        menuItemTemp.menuIcon = 'fa-credit-card'
                        menuItemTemp.to = '/layout/' + item._id
                        if (dateitem) {
                            filterData[item.className].menu.push(menuItemTemp)
                        } else {
                            filterData.default.menu.push(menuItemTemp)
                        }
                    })
                }
            }
            this.rb_desigMenu = filterData
            return filterData
        },
        operationGet() {
            let vm = this
            vm.$store.dispatch(types.GET_ARRAY_API, vm.tableName).then(() => {
                this.eventData()
            })
        },
    },
    beforeMount() {
        this.operationGet()
    },
    computed: {

    },
}
</script>
