<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'功能名称'">
            <el-input
              v-model="tableData.searchCondition.facilityName"
            ></el-input>
          </hb-form-item-container>
        </el-col>
        <el-col :md="6">
          <hb-form-item-container :label="'功能平台'">
            <el-select
              v-model="tableData.searchCondition.facilityPlatform"
              clearable
              placeholder="请选择平台"
              style="width: 100%"
            >
              <el-option
                v-for="item in dataDict.FACILITY_PLATFORM?.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </hb-form-item-container>
        </el-col>
        <el-col :md="6">
          <hb-form-item-container :label="'功能类型'">
            <el-select
              v-model="tableData.searchCondition.facilityType"
              clearable
              placeholder="请选择类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in dataDict.FACILITY_TYPE?.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </hb-form-item-container>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button
            type="primary"
            size="medium"
            @click="handleAdd"
            permission-key="add"
          >
            新增
          </el-button>
          <el-button
            type="primary"
            size="medium"
            @click="pageConditionSearch"
          >
            查询
          </el-button>
          <el-button type="primary" size="medium" plain @click="handleReset">
            重置
          </el-button>
          <el-button
            permission-key="delete"
            type="danger"
            size="medium"
            @click="handleMultiDelete"
            v-show="tableData.selectedRow.length > 0"
          >
            批量删除
          </el-button>
        </el-col>
      </el-row>
    </template>
    <el-table
      size="mini"
      :data="tableData.list"
      @selection-change="rowSelected"
      border
      v-loading="tableData.loading"
      style="width: 100%"
    >
      <el-table-column type="selection" align="center" width="50">
      </el-table-column>
      <el-table-column prop="facilityName" align="center" label="功能名称">
      </el-table-column>
      <el-table-column prop="facilityKey" align="center" label="功能标识">
      </el-table-column>
      <el-table-column prop="facilityType" align="center" label="功能类型">
        <template #default="scope">{{
            dataDict.FACILITY_TYPE?.mappings[scope.row.facilityType]
          }}
        </template>
      </el-table-column>
      <el-table-column prop="facilityIcon" align="center" label="图标路径">
      </el-table-column>
      <el-table-column prop="facilityPlatform" align="center" label="功能平台">
        <template #default="scope">{{
            dataDict.FACILITY_PLATFORM?.mappings[scope.row.facilityPlatform]
          }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="170">
        <template #default="scope">
          <el-button
            permission-key="configuration"
            @click="handleConfiguration(scope.row)"
            type="text"
          >参数设定
          </el-button
          >
          <el-button
            permission-key="edit"
            @click="handleEdit(scope.row)"
            type="text"
          >编辑
          </el-button
          >
          <el-button
            permission-key="delete"
            @click="handleDelete(scope.row)"
            type="text"
            style="color: red"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <template #pagination>
      <el-pagination
        background
        :page-sizes="[20, 50, 100]"
        :page-size="tableData.searchCondition.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
      >
      </el-pagination>
    </template>
    <point-drawer ref="PD" @ok="handleSearch" />
    <configuration-drawer ref="CD" @ok="handleSearch" />
  </hb-page-layout>
</template>

<script lang='ts'>
import { self } from '@/common'
import PointDrawer from '@/views/facility/facility-point/drawer/PointDrawer.vue'
import ConfigurationDrawer from '@/views/facility/facility-point/drawer/ConfigurationDrawer.vue'
import { defineComponent, ref } from 'vue'
import { createPage } from '@/common/page'
import { loadDict } from '@/common/dict'
import { drawerLoader } from '@/common/drawer'

export default defineComponent({
  name: 'index',
  components: {
    PointDrawer,
    ConfigurationDrawer
  },
  setup() {
    const context = self()
    const drawer = drawerLoader()

    const {
      pageData: tableData,
      defaultDataLoader: handleSearch,
      pageSizeChange,
      pageNoChange,
      rowSelected,
      pageConditionSearch,
      defaultPageReset: handleReset,
      defaultDeleteHandle: handleDelete,
      defaultMultiDeleteHandle: handleMultiDelete
    } = createPage({
      conditions: {
        facilityName: {
          default: '',
          reset: ''
        },
        facilityPlatform: {
          default: '',
          reset: ''
        },
        facilityType: {
          default: '',
          reset: ''
        }
      },
      dataAPI: context.$api.facilityPage,
      deleteAPI: context.$api.facilityDelete
    })

    const { dataDict } = loadDict(['FACILITY_PLATFORM', 'FACILITY_TYPE'])

    const pointDrawerDeploy: any = ref({})

    const handleAdd = () => {
      pointDrawerDeploy.value.title = '新增'
      pointDrawerDeploy.value.haveSubmit = true
      pointDrawerDeploy.value.disabled = false
      pointDrawerDeploy.value.mode = 'add'
      drawer('PD').open(pointDrawerDeploy.value, '')
    }

    const handleEdit = (row: any) => {
      pointDrawerDeploy.value.title = '编辑'
      pointDrawerDeploy.value.haveSubmit = true
      pointDrawerDeploy.value.disabled = false
      pointDrawerDeploy.value.mode = 'edit'
      drawer('PD').open(pointDrawerDeploy.value, row)
    }

    const handleConfiguration = (row: any) => {
      let configurationDrawerDeploy: any = {}
      configurationDrawerDeploy.title = '配置'
      configurationDrawerDeploy.haveSubmit = true
      configurationDrawerDeploy.disabled = false
      drawer('CD').open(configurationDrawerDeploy, row)
    }

    return {
      pageSizeChange,
      handleSearch,
      handleAdd,
      handleEdit,
      handleConfiguration,
      handleDelete,
      handleMultiDelete,
      handleReset,
      pageNoChange,
      rowSelected,
      pageConditionSearch,
      tableData,
      pointDrawerDeploy,
      dataDict,
    }
  }
})
</script>

<style scoped></style>
