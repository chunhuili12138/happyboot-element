<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'是否启用'">
            <el-select
              v-model="tableData.searchCondition.enable"
              clearable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, key) in isEnableOptions"
                :key="key"
                :label="item"
                :value="key"
              />
            </el-select>
          </hb-form-item-container>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button
            type="primary"
            permission-key="add"
            size="medium"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button type="primary" size="medium" @click="pageConditionSearch"
            >查询</el-button
          >
          <el-button type="primary" size="medium" plain @click="handleReset"
            >重置</el-button
          >
          <el-button
            permission-key="delete"
            type="danger"
            size="medium"
            @click="handleMultiDelete"
            v-show="tableData.selectedRow.length > 0"
            >批量删除</el-button
          >
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
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column type="index" align="center" width="50" label="#" />
      <el-table-column prop="linkUrl" align="center" label="url地址" />
      <el-table-column prop="des" align="center" label="描述" />
      <el-table-column prop="enable" align="center" label="是否启用" width="50">
        <template #default="scope">{{
          isEnableOptions[scope.row.enable]
        }}</template>
      </el-table-column>
      <el-table-column
        prop="sortOrder"
        align="center"
        label="排序"
        width="80"
      />
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template #default="scope">
          <el-button @click="handleDetail(scope.row)" type="text"
            >查看</el-button
          >
          <el-button
            @click="handleEdit(scope.row)"
            type="text"
            permission-key="edit"
            >编辑</el-button
          >
          <el-button
            @click="handleDelete(scope.row)"
            type="text"
            permission-key="delete"
            style="color: red"
            >删除</el-button
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
      />
    </template>
    <form-drawer ref="FD" @handleSubmit="handleSearch" />
    <detail-drawer ref="DD" />
  </hb-page-layout>
</template>
<script lang='ts'>
import FormDrawer from './drawer/FormDrawer.vue'
import DetailDrawer from './drawer/DetailDrawer.vue'
import { defineComponent, ref } from 'vue'
import { self } from '@/common'
import { createPage } from '@/common/page'
import { drawerLoader } from '@/common/drawer'

export default defineComponent ({
  name: 'index',
  components: {
    FormDrawer,
    DetailDrawer
  },
  setup() {
    const context = self()
    const drawer = drawerLoader()

    const {
      pageData: tableData,
      defaultDataLoader: handleSearch,
      pageNoChange,
      pageSizeChange,
      rowSelected,
      pageConditionSearch,
      defaultPageReset: handleReset,
      defaultDeleteHandle:handleDelete,
      defaultMultiDeleteHandle:handleMultiDelete
    } = createPage({
      conditions: {
        enable: {
          default:'',
          reset: ''
        },
      },
      dataAPI: context.$api.getBanner,
      deleteAPI: context.$api.deleteBanner
    })

    const isEnableOptions = { 0: '否', 1: '是' }

    const handleAdd = () => {
      drawer('FD').add()
    }

    const handleEdit = (row: any) => {
      drawer('FD').edit({ id: row.id })
    }

    const handleDetail = (row: any) => {
      drawer('DD').detail({ id: row.id })
    }

    return {
      pageSizeChange,
      handleSearch,
      handleAdd,
      handleEdit,
      handleDetail,
      handleDelete,
      handleMultiDelete,
      handleReset,
      pageNoChange,
      rowSelected,
      pageConditionSearch,
      tableData,
      isEnableOptions,
    }
  }
})
</script>
