<template>
  <hb-drawer-layout v-model="isShow" :title="userInfoDrawerDeploy.title">
    <el-form
      ref="userInfoForm"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="账号" prop="username">
        <el-input
          v-model="form.username"
          :disabled="userInfoDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input
          v-model="form.nickname"
          :disabled="userInfoDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          :disabled="userInfoDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordConfirm">
        <el-input
          type="password"
          v-model="form.passwordConfirm"
          :disabled="userInfoDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="账号类型">
        <el-radio v-model="form.userType" label="0" border>主账号</el-radio>
        <el-radio v-model="form.userType" label="1" border>子账号</el-radio>
      </el-form-item>
      <el-form-item
        label="关联账号"
        v-show="form.userType === '1' && userLinkData.length === 0"
      >
        <el-select
          v-model="linkUser"
          filterable
          remote
          reserve-keyword
          placeholder="请输入账号"
          :remote-method="remoteMethod"
          :loading="selectLoading"
          clearable
        >
          <el-option
            v-for="item in linkOptions"
            :key="item.value"
            :label="item.nickname"
            :value="item.id"
          >
            <span style="float: left">{{ item.nickname }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.username
            }}</span>
          </el-option>
        </el-select>
        <el-button style="margin-left: 15px;" type="primary" @click="handleLink"
          >关联</el-button
        >
      </el-form-item>
      <el-form-item label="主账号" v-show="form.userType === '1'">
        <el-table :data="userLinkData" size="mini" border style="width: 100%">
          <el-table-column
            prop="username"
            align="center"
            label="账号"
            width="150"
          >
          </el-table-column>
          <el-table-column prop="nickname" align="center" label="姓名">
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作">
            <template #default="scope">
              <el-button
                @click="handleUnLink(scope.row)"
                type="danger"
                size="small"
                >解绑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          :disabled="userInfoDrawerDeploy.disabled"
          v-model="form.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="启用"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="头像">
        <hb-avatar-uploader :src="imgId2Url(form.headPic)" @cropped="onCropped" />
      </el-form-item>
    </el-form>
    <template #actions v-if="userInfoDrawerDeploy.haveSubmit">
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit('userInfoForm')">
        确认
      </el-button>
    </template>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import HbAvatarUploader from '@/components/HbAvatarUploader.vue'
import { defineComponent, ref, nextTick, reactive } from 'vue'
import { self } from '@/common'
export default defineComponent ({
  name: 'UserInfoDrawer',
  components: {
    HbAvatarUploader
  },
  setup(props, { emit }) {
    const context = self()

    let isShow = ref(false)
    let userInfoDrawerDeploy: any = ref({})
    let selectLoading = ref(false)
    let linkUser: any = ref([])
    let linkOptions: any = ref([])
    let userLinkData: any = ref([])
    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const form: any = reactive({
      id: '',
      username: '',
      nickname: '',
      status: 1,
      password: '',
      passwordConfirm: '',
      headPic: '',
      userType: '0',
      userIdList: []
    })
    const rules = {
      username: [
        { required: true, message: '请输入账号', trigger: 'change' }
      ],
      nickname: [
        { required: true, message: '请输入昵称', trigger: 'change' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'change' }
      ],
      passwordConfirm: [
        { required: true, validator: validatePass, trigger: 'blur' }
      ]
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = (deploy: any) => {
      isShow.value = true
      userInfoDrawerDeploy.value = deploy
      nextTick(() => {
        //初始化表单
        Object.assign(form,{
          id: '',
          username: '',
          nickname: '',
          status: 1,
          password: '',
          passwordConfirm: '',
          headPic: '',
          userType: '0',
          userIdList: []
        })
        linkUser.value = ''
        linkOptions.value = []
        userLinkData.value = []
      })
    }

    const remoteMethod = async (query: any) => {
      if (query !== '') {
        selectLoading.value = true
        const res: any = await context.$api.queryMainAccountList(query)
        if (res.code === 0) {
          linkOptions.value = res.data
        }
        selectLoading.value = false
      } else {
        linkOptions.value = []
      }
    }

    const handleLink = () => {
      linkOptions.value.map((e: any) => {
        if (e.id === linkUser.value) {
          userLinkData.value.push({
            id: e.id,
            username: e.username,
            nickname: e.nickname
          })
        }
      })
    }

    const handleUnLink = (row: any) => {
      let index = 0
      for (let i = 0; i < userLinkData.value.length; i++) {
        if (row.id === userLinkData.value[i].id) {
          index = i
        }
      }

      userLinkData.value.splice(index, 1)
    }

    const handleSubmit = async (formName: any) => {
      const valid = await new Promise(resolve => {
        context.$refs[formName].validate((v: any) => {
          resolve(v)
        })
      })
      if (!valid) {
        return
      }
      //将关联账号列表里的id 放到userIdList里
      let userIdList: any = []
      userLinkData.value.map((e: any) => {
        userIdList.push(e.id)
      })
      form.userIdList = userIdList
      const res: any = await context.$api.userAdd(form)
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

    const onCropped = async (can:any) => {
      const data: any = await new Promise(resolve => {
        can.toBlob((data: any) => {
          resolve(data)
        })
      })
      const res: any = await context.$api.uploadImage(data)
      if (res.code === 0) {
        form.headPic = res.data
      }
    }

    const imgId2Url = (data: any) => {
      return context.$api.$imgId2Url(data)
    }

    return {
      open,
      remoteMethod,
      handleLink,
      handleUnLink,
      handleSubmit,
      onCropped,
      imgId2Url,
      isShow,
      selectLoading,
      linkUser,
      linkOptions,
      userInfoDrawerDeploy,
      userLinkData,
      form,
      rules
    }
  }
})
</script>

<style>
#headimgUpload .el-upload-list__item {
  transition: none !important;
}
</style>
<style scoped>
.disabled >>> .el-upload--picture-card {
  display: none;
}
</style>
