<template>
  <el-button type="success" plain @click="dialogVisible = true" :disabled="userStatus!==2">
    模拟开始！进入研二生活
  </el-button>

  <el-dialog v-model="dialogVisible" title="Graduate Student Simulator, QIDONG!"
             width="70vw" :before-close="handleClose">
    <el-tag type="success" effect="dark" style="margin-bottom: 10px">研二模拟器，启动！</el-tag>

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
      <span style="font-size: x-large; font-weight: bold; font-family: 'Wawati SC'; color: green;">你的研二生活已经模拟完成，结束进入研三吧，时间可不等人</span>
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
  name: "AdventureTwo",
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
          content: '1. 到图书馆自习，你遇到了论文写作的困难,你决定',
          selects: ['向老师请教', '查阅相关资料', '在网上求助'],
          abilityScores: [0.1, 0.2, -0.1],
          healthyScores: [0.0, 0.1, -0.2],
          achievementID: [0, 1, -1],
          jumpID: -1
        },
        {
          id: 1,
          content: '2. 你的代码遇到了一个棘手的Bug,你会',
          selects: ['立即求助同学', '查阅相关文档', '调试一整夜'],
          abilityScores: [-0.1, 0.2, 0.3],
          healthyScores: [0.1, 0.0, -0.3],
          achievementID: [-1, 1, 2],
          jumpID: -1
        },
        {
          id: 2,
          content: '3. 你的导师布置了一项艰巨的课题研究,你打算',
          selects: ['分解任务逐步完成', '立即着手查阅大量资料', '先休息一下'],
          abilityScores: [0.2, 0.1, -0.2],
          healthyScores: [0.1, -0.1, 0.2],
          achievementID: [2, 1, -1],
          jumpID: -1
        },
        {
          id: 3,
          content: '4. 你参加了一场算法竞赛,但遇到了困难题目,你会',
          selects: ['立即求助网友', '冥思苦想一阵子', '放弃这道题目'],
          abilityScores: [-0.1, 0.3, -0.2],
          healthyScores: [0.0, -0.2, 0.1],
          achievementID: [-1, 3, -1],
          jumpID: -1
        },
        {
          id: 4,
          content: '5. 你的论文被国际顶级期刊录用了,你会',
          selects: ['立即庆祝一番', '继续努力钻研', '邀请师友共庆'],
          abilityScores: [-0.1, 0.2, 0.1],
          healthyScores: [0.2, -0.1, 0.3],
          achievementID: [4, 1, 5],
          jumpID: -1
        },
        {
          id: 5,
          content: "6. 跑实验的时候服务器突然死机，你会：",
          selects: ["重启服务器，希望问题自己解决", "跑到工位前两排找实验室电脑师傅，请求场外援助", "呼唤计算机之神，进行祈祷"],
          abilityScores: [0.1, 0.2, -0.1],
          healthyScores: [0.0, -0.1, 0.1],
          achievementID: [-1, -1, 6],
          jumpID: -1
        },
        {
          id: 6,
          content: "7. 某天下午导师突然找你talk转博的事情，你会：",
          selects: ["无所畏惧，欣然接受，简直说到你心坎上", "非常不解，我这种学术垃圾怎么让老师看上的？", "必不可能，当面拒绝"],
          abilityScores: [-0.1, 0.2, -0.1],
          healthyScores: [0.0, -0.1, 0.1],
          achievementID: [-1, -1, -1],
          jumpID: -1
        },
        {
          id: 7,
          content: "8. 导师提出一个新的研究方向，你会：",
          selects: ["作为善战的狼，显然是直接拿下", "作为远见的鹰，我需要谨慎考虑，权衡利弊", "作为划水的鱼，还是观望一波吧"],
          abilityScores: [0.3, 0.2, -0.1],
          healthyScores: [0.0, 0.1, 0.2],
          achievementID: [-1, -1, -1],
          jumpID: -1
        },
        {
          id: 8,
          content: "9. 实验室新增了一台服务器，你想：",
          selects: ["抢先体验，舍我其谁，马上起程序跑任务", "先让别人试试水咯，环境配好了我再用", "不太感兴趣，雨我无瓜"],
          abilityScores: [0.3, 0.1, -0.1],
          healthyScores: [0.0, 0.1, 0.2],
          achievementID: [-1, -1, -1],
          jumpID: -1
        },
        {
          id: 9,
          content: "10. A会论文即将截稿，你：",
          selects: ["通他三个宵，考虑这是不是此生仅有的机会", "稳如老狗，一切按计划进行", "压力山大，求助师兄师姐师弟师妹"],
          abilityScores: [0.3, 0.2, 0.1],
          healthyScores: [-0.2, 0.0, -0.1],
          achievementID: [-1, -1, 7],
          jumpID: -1
        },
        {
          id: 10,
          content: '11. 你的导师建议你开始准备一篇综述论文，选择下一步行动：',
          selects: ['立即开始撰写', '先进行文献调研', '向导师请教如何开始'],
          abilityScores: [0.2, 0.3, 0.1],
          healthyScores: [0.1, 0.2, 0.1],
          achievementID: [7, 1, -1],
          jumpID: -1
        },
        {
          id: 11,
          content: '12. 你的同学邀请你加入一个学术研讨小组，选择是否加入：',
          selects: ['欣然接受', '考虑一下再决定', '婉言谢绝'],
          abilityScores: [0.1, 0.1, -0.1],
          healthyScores: [0.1, 0.1, -0.1],
          achievementID: [-1, -1, -1],
          jumpID: -1
        },
        {
          id: 12,
          content: '13. 你的研究成果被一个学术期刊拒稿，你选择：',
          selects: ['重新修改并再次投稿', '寻找其他期刊投稿', '放弃这个研究方向'],
          abilityScores: [0.2, 0.1, -0.2],
          healthyScores: [0.1, 0.2, -0.1],
          achievementID: [9, 7, 6],
          jumpID: -1
        },
        {
          id: 13,
          content: '14. 你的同学邀请你一起参加一个学术竞赛，奖金丰厚，但需要投入大量时间。你选择：',
          selects: ['欣然接受并努力参与其中', '考虑一下再决定', '婉言谢绝'],
          abilityScores: [0.3, 0.1, -0.1],
          healthyScores: [0.1, 0.1, -0.1],
          achievementID: [-1, -1, -1],
          jumpID: -1
        },
        {
          id: 14,
          content: '15. 你的导师建议你参加一个学术研讨会，但与此同时你有一个重要的考试。你选择：',
          selects: ['放弃考试参加研讨会', '参加考试放弃研讨会', '尝试同时安排两者'],
          abilityScores: [-0.2, 0.2, -0.1],
          healthyScores: [-0.1, 0.1, -0.2],
          achievementID: [-1, 10, -1],
          jumpID: -1
        },
      ],
      achievements: ['学者初体验', '资料探索家', '肝', '算法大师', '校园红人', '人生赢家', ' 避难专家', '论文压力症', '期刊之星', '坚韧不拔', '考试之王'],
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
      let userChoice = "1-" + String(this.questionID) + "-" + String(this.selectValue)
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
        this.$emit('changeUserStatus', 3)
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