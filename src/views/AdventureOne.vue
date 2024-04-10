<template>
  <el-button type="primary" plain @click="dialogVisible = true" :disabled="userStatus!==1">
    模拟开始！进入研一生活
  </el-button>

  <el-dialog v-model="dialogVisible" title="Graduate Student Simulator, QIDONG!"
             width="70vw" :before-close="handleClose">
    <el-tag type="primary" effect="dark" style="margin-bottom: 10px">研一模拟器，启动！</el-tag>

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

    <el-card v-if="questionID < questions.length" shadow="never">
      <template #header>
        <div class="card-header">
          <span style="font-weight: bold; font-size: large">{{ questions[questionID].content }}</span>
        </div>
      </template>
      <el-radio-group v-model="selectValue">
        <el-radio value="0">{{ questions[questionID].selects[0] }}</el-radio>
        <el-radio value="1">{{ questions[questionID].selects[1] }}</el-radio>
        <el-radio value="2">{{ questions[questionID].selects[2] }}</el-radio>
      </el-radio-group>
      <template #footer>
        <el-button type="primary" plain size="small" @click="submitOneQuestion">提交本次抉择</el-button>
      </template>
    </el-card>
    <el-card v-else shadow="never" style="text-align: center">
      <span style="font-size: x-large; font-weight: bold; font-family: 'Wawati SC'; color: dodgerblue">你的研一生活已经模拟完成，结束进入研二吧，时间可不等人</span>
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
import {Apple, Check, Opportunity} from "@element-plus/icons-vue";
import {h} from "vue";

export default {
  name: "AdventureOne",
  components: {Apple, Opportunity},
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
          content: '1. 今天是你到北航IT学院到第一天，你选择',
          selects: ['当然是刷爆自己的校园卡！', '直接去大运村睡觉', '到自己的工位上狠狠学习'],
          abilityScores: [0.0, -0.2, 0.2],
          healthyScores: [0.1, 0.4, -0.1],
          achievementID: [0, -1, -1], // -1无彩蛋，其他对应不同彩蛋
          jumpID: -1 // -1无跳跃
        },
        {
          id: 1,
          content: '2. 晚上你在寝室遇见了你的室友，你会',
          selects: ['打声招呼然后各忙各的', '喊上室友一起打游戏', '喊上室友一起讨论算法'],
          abilityScores: [0.0, -0.2, 0.2],
          healthyScores: [0.0, 0.1, -0.1],
          achievementID: [-1, 1, -1],
          jumpID: -1
        },
        {
          id: 2,
          content: '3. 当老师在讲解一段复杂的算法时，你被点名了！但你突然意识到自己什么都没听懂，这时你选择',
          selects: ['假装自己在深度思考，实际上是在计划午餐吃什么', '突然提出一个貌似很深奥的问题，实则为了转移话题', '悄悄地查看同学的笔记，希望能通过他们的记录解密讲解内容'],
          abilityScores: [0.0, 0.1, 0.2],
          healthyScores: [-0.1, 0.0, 0.0],
          achievementID: [2, -1, 3],
          jumpID: -1
        },
        {
          id: 3,
          content: '4. 面对即将到期的编程作业，你的心态如何',
          selects: ['“是时候展现真正的技术了”，开启咖啡模式，连夜赶工', '找到那位“作业救星”同学，希望能蹭到一些灵感', '决定先休息一下，给大脑充电，结果不小心“充电”过头，睡到自然醒'],
          abilityScores: [0.3, 0.1, -0.2],
          healthyScores: [-0.2, 0.0, 0.2],
          achievementID: [4, -1, -1],
          jumpID: -1
        },
        {
          id: 4,
          content: '5. 调试了几小时的代码终于没有错误了，这时你发现',
          selects: ['代码竟然是在运行一个无限循环，屏幕上滚动的数字如同矩阵般迷人', '忘记保存，回到了几个小时前的版本，经历了一次时光倒流', '实际上是看错了窗口，你的代码依旧错误百出，而旁边的示例程序却运行得很好'],
          abilityScores: [-0.1, -0.3, 0.0],
          healthyScores: [0.0, 0.1, -0.2],
          achievementID: [5, -1, 6],
          jumpID: -1
        },
        {
          id: 5,
          content: '6. 在一个团队项目中，你负责的部分突然出现了问题，你',
          selects: ['深呼吸，决定从头检查每一行代码', '偷偷希望团队里的大佬能出手相救', '群里发个“呵呵”，然后装作什么都没发生'],
          abilityScores: [0.2, 0.0, -0.2],
          healthyScores: [0.0, 0.1, -0.1],
          achievementID: [-1, 7, -1],
          jumpID: -1
        },
        {
          id: 6,
          content: '7. 「突发情况」有你不太熟悉的同学跟你表白，你会？',
          selects: ['情为何物？我已看淡', '慎重考虑，TA是不是要来蹭我的校园网流量？', '开心接受，这泼天的爱情还是轮到我了！'],
          abilityScores: [0.3, -0.2, 0.2],
          healthyScores: [0.0, 0.0, 0.4],
          achievementID: [-1, 8, 9],
          jumpID: -1
        },
        {
          id: 7,
          content: '8. 为了变强，你办了一张健身卡，你',
          selects: ['办了卡就会瘦的啊你不知道吗（经常性不去）', '多去一次就少亏一点（有规律地去）', '不理老板，质疑老板，成为老板（每天去两次）'],
          abilityScores: [-0.1, 0.1, 0.3],
          healthyScores: [-0.1, 0.2, 0.5],
          achievementID: [-1, -1, 10],
          jumpID: -1
        },
        {
          id: 8,
          content: '9. 「突发情况」宿舍出现了北方大老鼠！！！你',
          selects: ['咩啊？（掏出拖鞋）', '啊啊啊啊啊啊，逃出去找宿管', '直接昏过去'],
          abilityScores: [0.2, 0.0, -0.1],
          healthyScores: [-0.2, 0.2, -0.1],
          achievementID: [11, -1, -1],
          jumpID: -1
        },
        {
          id: 9,
          content: '10. 晚上23点回村，碰到了路口卖烤红薯的大妈，你会',
          selects: ['奖励自己两个蜜薯', '告诉大妈自己喜欢生啃', '减肥不吃'],
          abilityScores: [0.1, 0.2, 0.0],
          healthyScores: [-0.2, 0.1, 0.2],
          achievementID: [12, -1, -1],
          jumpID: -1
        },
        {
          id: 10,
          content: '11. 导员看中了你的能力，希望你能加入研会，你',
          selects: ['呜呜呜我是I人放过我吧', '我是学院领头羊，冲！', '"喂，导员吗？我信号不好听不见，先挂啦"'],
          abilityScores: [-0.1, 0.3, 0.0],
          healthyScores: [0.2, 0.2, 0.0],
          achievementID: [13, -1, 14],
          jumpID: -1
        },
        {
          id: 11,
          content: "12. 你正在为论文熬夜写代码，突然电脑蓝屏了，你选择",
          selects: ["慌张地重启电脑", "冷静地喝口茶，然后重启", "直接瘫在键盘上"],
          abilityScores: [-0.1, 0.2, -0.2],
          healthyScores: [-0.1, 0.0, -0.3],
          achievementID: [-1, -1, 14],
          jumpID: -1
        },
        {
          id: 12,
          content: "13. 电脑重启后，你发现代码没保存，你选择",
          selects: ["疯狂地重写代码", "拉个屎吧", "打开游戏，放松一下"],
          abilityScores: [0.2, 0.0, -0.1],
          healthyScores: [-0.1, 0.2, 0.1],
          achievementID: [-1, 15, -1],
          jumpID: -1
        },
        {
          id: 13,
          content: "14. 你刚开始写代码，突然收到班级群的通知，明天有个突发考试，你选择",
          selects: ["立即开始复习", "先去睡一觉，明天早起复习", "继续写代码，明天再说"],
          abilityScores: [0.2, 0.1, 0.3],
          healthyScores: [-0.1, 0.2, -0.1],
          achievementID: [-1, -1, 16],
          jumpID: -1
        },
        {
          id: 14,
          content: "15. 你正在复习，室友邀请你去打游戏，你选择",
          selects: ["立即答应，去放松一下", "婉拒，继续复习", "带着书去，边玩边看"],
          abilityScores: [-0.1, 0.2, 0.0],
          healthyScores: [0.1, -0.1, 0.0],
          achievementID: [-1, -1, -1],
          jumpID: -1
        },
        {
          id: 15,
          content: "16. 你正在玩游戏，突然收到导师的邮件，需要你马上回去修改论文，你选择",
          selects: ["立即回寝室修改", "先玩一局再说", "回复导师，明天再修改"],
          abilityScores: [0.2, -0.1, 0.0],
          healthyScores: [-0.1, 0.0, 0.1],
          achievementID: [-1, 17, -1],
          jumpID: -1
        }
      ],
      achievements: [
        '校园卡爆破手', '水晶摧毁者', '午餐策划大师',
        '读书人的事，怎么能算...', 'Wings股东出马！', '内存爆破手',
        '芝士 ฿Ʉℊ而已啦', '我爱傍大腿~', '不是兄弟你',
        '等了好久终于等到今天', '琦玉附体', '广东战神',
        '蜜薯滞销，帮帮我们', '逃避...有用', '喂？喂！', '软体动物', '厕所达人', '游戏狂人'
      ],
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
      let userChoice = "0-" + String(this.questionID) + "-" + String(this.selectValue)
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

      let noticeContent = "Ability: " + abilityAdd + " Healthy: " + healthyAdd

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
        this.$emit('changeUserStatus', 2)
      }

      if (this.questions[id].jumpID === -1) this.questionID += 1
      else this.questionID = this.questions[id].jumpID
    },
    closeThisAdventure() {
      this.dialogVisible = false
      this.$emit('addUserChoices', this.userChoices)
      this.$emit('addAchievements', this.userAchievements)
    }
  }
}
</script>

<style scoped>

</style>