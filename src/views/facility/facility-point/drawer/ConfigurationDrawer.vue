<template>
  <hb-drawer-layout v-model="isShow" :title="configurationDrawerDeploy.title">
    <el-form
      ref="pointForm"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="功能参数" prop="facilityParam">
        <el-input
          type="textarea"
          v-model="form.facilityParam"
          :disabled="configurationDrawerDeploy.disabled"
        />
      </el-form-item>
    </el-form>
    <template #actions v-if="configurationDrawerDeploy.haveSubmit">
      <el-button @click="isShow = false">取消</el-button>
      <el-button
        type="danger"
        v-show="form.facilityParamId !== undefined"
        @click="handleDelete()"
      >删除</el-button
      >
      <el-button type="primary" @click="handleSubmit('pointForm')"
        >确认</el-button
      >
    </template>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'ConfigurationDrawer',
  setup(props, { emit }) {
    const context = self()

    const isShow = ref(false)
    const configurationDrawerDeploy: any = ref({})
    const form: any = ref({
      facilityId: '',
      setFrom: 'sys',
      facilityParam: ''
    })

    let checkParam: any = (rule: any, value: string, callback: any) => {
      if (!value) {
        return callback(new Error('请输入功能参数'))
      }
      setTimeout(() => {
        if (!isJson(value)) {
          callback(new Error('请输入JSON格式参数'))
        } else {
          callback()
        }
      }, 1)
    }

    const rules = { facilityParam: [{ validator: checkParam, trigger: 'change' }] }

    const isJson = (str: string) => {
      try {
        const obj = JSON.parse(str)
        return !!(typeof obj == 'object' && obj)
      } catch (e) {
        return false
      }
    }

    const handleDelete = async () => {
      let res: any = await context.$api.facilityParamDelete(form.value.facilityParamId)
      if (res.code === 0) {
        isShow.value = false
        context.$notify({
          type: 'success',
          title: '提示',
          message: '操作成功！'
        })
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    const handleSubmit = async (formName: any) => {
      const valid: any = await new Promise((resolve: any) => {
        context.$refs[formName].validate((v: any) => {
          resolve(v)
        })
      })
      if (!valid) {
        return
      }

      let res: any = await context.$api.facilityParamSet(form.value)
      if (res.code === 0) {
        isShow.value = false
        context.$notify({
          type: 'success',
          title: '提示',
          message: '操作成功！'
        })
        emit('ok')
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = async (deploy: any, data: any) => {
      isShow.value = true
      configurationDrawerDeploy.value = deploy
      const res: any = await context.$api.facilityParamGet(data.id)
      if (res.code === 0 && res.data !== null) {
        form.value = res.data
      } else {
        form.value.facilityId = data.id
        form.value.setFrom = 'sys'
        form.value.facilityParam = ''
      }
    }

    return {
      open,
      handleSubmit,
      handleDelete,
      isShow,
      checkParam,
      configurationDrawerDeploy,
      form,
      rules
    }
  }
})
</script>
<style>
textarea {
  height: 300px;
}
</style>
