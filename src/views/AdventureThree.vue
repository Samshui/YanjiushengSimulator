<template>
  <el-button type="warning" plain @click="dialogVisible = true" :disabled="userStatus!==3">
    模拟开始！进入研三生活
  </el-button>

  <el-dialog v-model="dialogVisible" title="Graduate Student Simulator, QIDONG!"
             width="70vw" :before-close="handleClose">
    <el-tag type="warning" effect="dark" style="margin-bottom: 10px">研三模拟器，启动！</el-tag>

    <el-descriptions class="margin-top" :column="2" size="small" border
                     style="margin-top: 10px; margin-bottom: 10px">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <Opportunity/>
            </el-icon>
            Ability｜能力值
          </div>
        </template>
        <el-rate v-model="this.abilityValue"
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
        <el-rate v-model="this.healthyValue"
                 :colors="['#FF9900', '#67c23a', '#409eff']"
                 disabled show-score/>
      </el-descriptions-item>
    </el-descriptions>

    <el-card v-if="questionID < questions.length">
      <template #header>
        <div class="card-header">
          <span style="font-weight: bold; font-size: large">{{ questions[questionID].content }}</span>
        </div>
      </template>
      <el-radio-group v-model="selectValue" class="ml-4" style="display: flex; flex-direction: row">
        <el-radio value="0">{{ questions[questionID].selects[0] }}</el-radio>
        <el-radio value="1">{{ questions[questionID].selects[1] }}</el-radio>
        <el-radio value="2">{{ questions[questionID].selects[2] }}</el-radio>
      </el-radio-group>
      <template #footer>
        <el-button type="primary" plain size="small" @click="submitOneQuestion">提交本次抉择</el-button>
      </template>
    </el-card>
    <el-card v-else shadow="never" style="text-align: center">
      <span
          style="font-size: x-large; font-weight: bold; font-family: 'Wawati SC'; color: darkorange;">模拟结束了，来看看你的结果吧</span>
    </el-card>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="closeThisAdventure" :disabled="questionID < questions.length">
          结束
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {ElMessageBox, ElNotification, ElMessage} from "element-plus";
import {Check} from "@element-plus/icons-vue";
import {h} from "vue";

export default {
  name: "AdventureThree",
  computed: {
    Check() {
      return Check
    }
  },
  props: ['healthyValue', 'abilityValue', 'userStatus'],
  emits: ['changeValues', 'changeUserStatus', 'addAchievements', 'addUserChoices'],
  data() {
    return {
      dialogVisible: false,
      selectValue: '0',
      questionID: 0,
      questions: [
        {
          id: 0,
          content: '1. 步入研三，即将毕业的你决定',
          selects: ['博士三年，启动！', '我是一个无情的发简历机器', '考虑创业或自由职业（捡垃圾也是有门路的！）'],
          abilityScores: [0.2, 0.1, -0.1],
          healthyScores: [-0.1, 0.1, 0.1],
          achievementID: [0, -1, 1],
          jumpID: -1
        },
        {
          id: 1,
          content: '2. 面对即将毕业，你开始',
          selects: ['担心找不到理想的工作', '我不会毕不了业吧', '我对自己的未来有着极大的信心！'],
          abilityScores: [-0.1, -0.1, -0.3],
          healthyScores: [-0.1, -0.2, 0.1],
          achievementID: [-1, -1, 2], // -1表示无特殊成就
          jumpID: -1
        },
        {
          id: 2,
          content: '3. 为了提升就业竞争力，你决定',
          selects: ['参加技术培训课程', '拓展自己的社交网络', '提升英语或其他外语能力'],
          abilityScores: [0.3, 0.2, 0.1],
          healthyScores: [0.0, -0.1, 0.1],
          achievementID: [-1, 3, -1], // 16表示成功参加技术培训课程，17表示成功拓展社交网络，18表示成功提升英语或其他外语能力，-1表示无特殊成就
          jumpID: -1
        },
        {
          id: 3,
          content: '4. 在室友的怂恿下尝试了一下IT大厂的面试，你',
          selects: ['直接化身八股文勇士', '老老实实刷Leetcode吧', '准备？什么是准备，我超勇的！'],
          abilityScores: [0.1, 0.2, -0.2],
          healthyScores: [-0.1, 0.0, 0.1],
          achievementID: [-1, -1, 4], // -1表示无特殊成就
          jumpID: -1
        },
        {
          id: 4,
          content: '5. 爸妈劝你毕业之后考虑一下考公，你',
          selects: ['马上就买考公资料！', '很犹豫，开始逃避这个问题', '我是坚定的IT技术发明家！'],
          abilityScores: [0.3, -0.2, 0.1],
          healthyScores: [0.0, 0.0, -0.1],
          achievementID: [5, -1, -1], // -1表示无特殊成就
          jumpID: -1
        },
        {
          id: 5,
          content: "6. 要开始盲审了，你决定",
          selects: ["找导师反反复复复查论文内容", "同门互查才是YYDS！", "我的论文，有人敢质疑？（自己核查）"],
          abilityScores: [0.3, 0.1, -0.2],
          healthyScores: [-0.1, 0.1, 0.1],
          achievementID: [-1, -1, 6],
          jumpID: -1
        },
        {
          id: 6,
          content: "7. 也许是最后一个大学的五一假期，你决定",
          selects: ["狠狠奖励自己，把北京逛一遍！", "乖乖留在学校准备接受导师的洗礼", "改论文好累，一睡不起"],
          abilityScores: [-0.2, 0.2, -0.1],
          healthyScores: [0.3, -0.2, 0.2],
          achievementID: [7, -1, -1],
          jumpID: -1
        },
        {
          id: 7,
          content: "8. 之前面试的HR来联系你尽快实习，你",
          selects: ["我要读博（冷漠脸）", "我要创业（冷漠脸）", "好的马上到！"],
          abilityScores: [0.3, 0.2, -0.1],
          healthyScores: [-0.1, -0.1, 0.4],
          achievementID: [-1, -1, 8],
          jumpID: -1
        },
        {
          id: 8,
          content: "9. 到毕业答辩这一天了，你",
          selects: ["早晨起床吃碗面，希望答辩丝滑顺畅", "早餐起床做个操，活络筋骨，准备迎接一场鏖战", "在心里模拟答辩现场，自己与自己博弈"],
          abilityScores: [0.0, 0.0, 0.2],
          healthyScores: [0.1, 0.2, -0.2],
          achievementID: [-1, -1, -1],
          jumpID: -1
        },
        {
          id: 9,
          content: "10. 到毕业典礼这一天了，你",
          selects: ["找一个没人的地方偷偷地Gucci", "跟朋友们一起畅快地喝一顿！", "化身E人，逮人就合照"],
          abilityScores: [0.0, 0.0, 0.2],
          healthyScores: [-0.2, 0.2, 0.2],
          achievementID: [9, 10, 11],
          jumpID: -1
        },
      ],
      achievements: ['学位续杯！', '风险投资家', '永远自信！', 'E人养成计划', '杰哥不要啊',
        '铁饭碗候选人', '大意失荆州', 'CityWalk', '变色龙', 'Gucci Gucci', '美梦调酒师', '永恒的照片'],
      achievementIDs: [],
      userAchievements: [],
      userChoices: []
    }
  },
  methods: {
    handleClose(done) {
      ElMessageBox.confirm('现在退出吗？')
          .then(() => {
            done();
          })
    },
    submitOneQuestion() {
      // console.log(this.abilityValue, this.healthyValue)
      let userChoice = "2-" + String(this.questionID) + "-" + String(this.selectValue)
      this.userChoices.push(userChoice)

      let id = this.questionID
      let selectResult = parseInt(this.selectValue)
      let abilityAdd = this.questions[id].abilityScores[selectResult]
      let healthyAdd = this.questions[id].healthyScores[selectResult]
      let ability = (this.abilityValue * 10 + abilityAdd * 10) <= 50 ? (this.abilityValue * 10 + abilityAdd * 10) : 50
      let healthy = (this.healthyValue * 10 + healthyAdd * 10) <= 50 ? (this.healthyValue * 10 + healthyAdd * 10) : 50

      // console.log(abilityAdd, healthyAdd)

      let opt = {
        ability: ability / 10,
        healthy: healthy / 10
      }

      this.$emit('changeValues', opt)

      let noticeContent = "ability adds: " + abilityAdd + " healthy adds: " + healthyAdd

      ElNotification({
        title: '本次抉择结果反馈',
        type: 'info',
        position: 'top-left',
        duration: 1000,
        message: h('p', {style: 'color: green'}, noticeContent),
      })

      let achievementID = this.questions[id].achievementID[selectResult]

      if (achievementID !== -1 && !this.achievementIDs.includes(achievementID)) {
        let achievementContent = this.achievements[achievementID]
        this.achievementIDs.push(achievementID)
        this.userAchievements.push(achievementContent)

        ElMessage({
          message: h('p', {style: 'line-height: 1; font-size: 14px'}, [
            h('span', null, '恭喜获得成就 '),
            h('i', {style: 'color: #b91c1c'}, achievementContent),
          ]),
        })
      }

      if (this.questionID === this.questions.length - 1) {
        this.$emit('changeUserStatus', 4)
      }

      if (this.questions[id].jumpID === -1) this.questionID += 1
      else this.questionID = this.questions[id].jumpID
    },
    closeThisAdventure() {
      this.dialogVisible = false
      this.$emit('addAchievements', this.userAchievements)
      this.$emit('addUserChoices', this.userChoices)
    }
  }
}
</script>

<style scoped>

</style>