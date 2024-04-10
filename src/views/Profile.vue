<template>
  <div style="margin-top: 20px; margin-left: 20px; margin-right: 20px">

    <el-page-header>
      <template #content>
        <div>
          <span style="font-size: medium"> "我"的档案 </span>
          <span style="font-size: small"> Profile </span>
          <el-tag :type="this.userLabelType">{{this.userLabel}}</el-tag>
        </div>
      </template>
    </el-page-header>

    <el-descriptions class="margin-top" :column="3" size="small" border style="margin-top: 20px">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user/>
            </el-icon>
            Name｜姓名
          </div>
        </template>
        张三
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <iphone/>
            </el-icon>
            Telephon｜电话
          </div>
        </template>
        18100000000
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <location/>
            </el-icon>
            Place｜地址
          </div>
        </template>
        Beijing
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <tickets/>
            </el-icon>
            Status｜状态
          </div>
        </template>
        <el-tag size="small" v-if="this.userStatus === 1" type="primary">研一学生</el-tag>
        <el-tag size="small" v-if="this.userStatus === 2" type="success">研二学生</el-tag>
        <el-tag size="small" v-if="this.userStatus === 3" type="warning">研三学生</el-tag>
        <el-tag size="small" v-if="this.userStatus === 4" type="info">我是谁？</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <office-building/>
            </el-icon>
            Address｜地址
          </div>
        </template>
        Beihang University - the School of IT
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <Opportunity/>
            </el-icon>
            Ability｜能力值
          </div>
        </template>
        <el-rate v-model="this.abilityValue" size="small"
                 :colors="['#FF9900', '#67c23a', '#409eff']"
                 disabled show-score/>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <Apple/>
            </el-icon>
            Healthy｜健康情况
          </div>
        </template>
        <el-rate v-model="this.healthyValue" size="small"
                 :colors="['#FF9900', '#67c23a', '#409eff']"
                 disabled show-score/>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import {
  Apple,
  Iphone,
  Location,
  OfficeBuilding, Opportunity,
  Tickets,
  User,
} from '@element-plus/icons-vue'

export default {
  name: "Profile",
  computed: {},
  components: {Apple, Opportunity, OfficeBuilding, Tickets, Location, Iphone, User},
  props: {
    userStatus: Number,
    healthyValue: Number,
    abilityValue: Number,
    userLabel: String,
    userLabelType: String
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>