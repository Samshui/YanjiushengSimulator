<template>
  <el-menu
      :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
      background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
    <el-menu-item index="1">IT农民工前传：研究生模拟器</el-menu-item>
    <el-sub-menu index="2">
      <template #title>IT农民工正传</template>
      <el-menu-item index="2-1">开发中...</el-menu-item>
      <el-menu-item index="2-2">开发中...</el-menu-item>
      <el-menu-item index="2-3">开发中...</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>中年危机：穿越35岁</template>
        <el-menu-item index="2-4-1">开发中...</el-menu-item>
        <el-menu-item index="2-4-2">开发中...</el-menu-item>
        <el-menu-item index="2-4-3">开发中...</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>广告位出租</el-menu-item>
    <el-menu-item index="4" @click="achievementDraw = true">成就达成</el-menu-item>
    <el-menu-item index="5" @click="aboutUSDialog = true">开发团队信息</el-menu-item>
  </el-menu>
  <Profile :user-status="userStatus" :ability-value="abilityValue" :username="username"
           :healthy-value="healthyValue" :user-label="userLabel" :user-label-type="userLabelType" @changeName="changeName"></Profile>
  <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="gameFlowValue"
      striped
      striped-flow
      :duration="40"
      style="margin: 20px"
  >
    <span>当前流程进度：{{ gameFlowValue }}%</span>
  </el-progress>
  <el-divider>
    <el-icon>
      <ChatLineSquare/>
    </el-icon>
  </el-divider>
  <el-container style="width: 96vw; margin-left: 1vw; margin-right: 3vw">
    <el-aside width="15vw" style="margin-right: 20px">
      <el-scrollbar height="350px">
        <el-timeline style="max-width: 600px;">
          <el-timeline-item
              v-for="(activity, index) in timelines"
              :key="index"
              :timestamp="activity.timestamp"
              :type="activity.type"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </el-aside>
    <el-main class="round-border">
      <div>
        <div style="margin: 20px;">
          <AdventureOne :healthy-value="healthyValue" :ability-value="abilityValue" :user-status="userStatus"
                        @changeValues="changeValues" @changeUserStatus="changeUserStatus"
                        @addAchievements="addAchievements" @addUserChoices="addUserChoices"></AdventureOne>
        </div>
        <div style="margin: 20px;">
          <AdventureTwo :healthy-value="healthyValue" :ability-value="abilityValue" :user-status="userStatus"
                        @changeValues="changeValues" @changeUserStatus="changeUserStatus"
                        @addAchievements="addAchievements" @addUserChoices="addUserChoices"></AdventureTwo>
        </div>
        <div style="margin: 20px;">
          <AdventureThree :healthy-value="healthyValue" :ability-value="abilityValue" :user-status="userStatus"
                          @changeValues="changeValues" @changeUserStatus="changeUserStatus"
                          @addAchievements="addAchievements" @addUserChoices="addUserChoices"></AdventureThree>
        </div>
      </div>
      <div class="demo-image">
        <!--        <div v-for="fit in fits" :key="fit" class="block">-->
        <!--          <el-image style="width: 150px; height: 150px; margin-left: 20px" :src="url" :fit="fit"/>-->
        <!--        </div>-->
        <el-image style="width: 150px; height: 150px; margin-left: 20px; border-radius: 20px" src="src/assets/1.png"
                  fit="cover"/>
        <el-image style="width: 150px; height: 150px; margin-left: 20px; border-radius: 20px" src="src/assets/2.png"
                  fit="cover"/>
        <el-image style="width: 150px; height: 150px; margin-left: 20px; border-radius: 20px" src="src/assets/3.png"
                  fit="cover"/>
        <el-image style="width: 150px; height: 150px; margin-left: 20px; border-radius: 20px" src="src/assets/4.png"
                  fit="cover"/>
        <el-image style="width: 150px; height: 150px; margin-left: 20px; border-radius: 20px" src="src/assets/5.png"
                  fit="cover"/>
      </div>
    </el-main>
  </el-container>
  <div style="text-align: center; margin-top: 40px">
    <el-button type="primary" round
               :disabled="userStatus !== 4"
               v-loading.fullscreen.lock="finalLoading"
               @click="openFullScreenLoading">生成你的研究生模拟报告
    </el-button>
  </div>
  <el-drawer v-model="achievementDraw" direction="ttb" :with-header="false">
    <template #default>
      <div style="font-weight: bold; text-align: center">Your Achievements! 你的成就们</div>
      <el-divider>
        <el-icon>
          <Star/>
        </el-icon>
      </el-divider>
      <div style="text-align: center" v-if="achievements.length > 0">
        <el-tag :type="achievementTagsType[index%5]" v-for="(a, index) in achievements" style="margin: 5px">{{ a }}</el-tag>
      </div>
      <div v-else style="text-align: center">
        <span style="font-weight: bolder; font-family: 'Wawati SC'; font-size: larger; color: darkorange">你还没有成就哦～如果答完了题还没有成就的话，怎么不算一种"成就呢"？</span>
      </div>
    </template>
  </el-drawer>
  <el-dialog
      v-model="finalSummaryDialog"
      title="Final Summary"
      width="800"
      top="5vh"
  >
    <span style="font-size: small; color: #6b6b6b; letter-spacing: 1px">您的研究生模拟结果是什么呢？</span>
    <el-divider border-style="dashed"/>
    <div style="font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 10px;font-family: 'Wawati SC'">
      {{ userResults[userResultID].title }}
    </div>
    <div
        style="background-color: #e5e5e5; margin: 10px; border-radius: 20px; padding: 20px; word-break: break-all; text-align: center">
      {{ userResults[userResultID].content }}
    </div>
    <el-divider border-style="dashed"/>
    <FinalProfile :user-status="userStatus" :ability-value="abilityValue" :username="username"
                  :healthy-value="healthyValue" :user-label="userLabel" :user-label-type="userLabelType"></FinalProfile>
    <div style="text-align: center; margin-top: 10px">
      <el-tag :type="achievementTagsType[index%5]" v-for="(a, index) in achievements" style="margin-top:10px; margin-right: 10px">{{ a }}</el-tag>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" @click="finalSummaryDialog = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="aboutUSDialog" title="ABOUT US" width="800" top="5vh">
    <div style="text-align: center; font-weight: bold; font-size: x-large; font-family: 'Wawati SC'; color: dodgerblue">
      关于我们 ➮ 第十一组
    </div>
    <el-divider><span style="font-size: small; color: darkgrey; font-style: italic">FROM SOFTWARE ENGINEER</span>
    </el-divider>
    <div style="text-align: center">
      <el-tag effect="dark" round type="primary" style="margin: 5px">于浩淼</el-tag>
      <el-tag effect="dark" round type="success" style="margin: 5px">管衍栋</el-tag>
    </div>
    <el-divider><span style="font-size: small; color: darkgrey; font-style: italic">FROM COMPUTER SCIENCE</span>
    </el-divider>
    <div style="text-align: center; margin-bottom: 20px">
      <el-tag effect="dark" round type="primary" style="margin: 5px">孙涛</el-tag>
      <el-tag effect="dark" round type="success" style="margin: 5px">肖昌朝</el-tag>
      <el-tag effect="dark" round type="warning" style="margin: 5px">关翔远</el-tag>
      <el-tag effect="dark" round type="danger" style="margin: 5px">叶焯仁</el-tag>
      <el-tag effect="dark" round type="info" style="margin: 5px">许一凡</el-tag>
      <el-tag effect="dark" round type="primary" style="margin: 5px">宋航洋</el-tag>
      <el-tag effect="dark" round type="success" style="margin: 5px">梁沛贤</el-tag>
      <el-tag effect="dark" round type="warning" style="margin: 5px">潘天蔚</el-tag>
    </div>
    <div
        style="border-radius: 20px; border-style: dashed; border-color: #d0d0d0; padding: 10px; word-break: break-all;">
      <span style="font-size: smaller; color: #6b6b6b">
              You have a machine that works at such a high speed going into China remember the principle that I gave you when
      you were a child it was a developer it was a developer it was a developer it was a developer it was a developer it
      was a developer it was a developer it was a developer it was a developer it was a developer it was a developer it
      was a developer why it was underground it was a developer it was a descendant of the fifth generation You think
      I'm playing with you You don't you don't you don't police? Huanglongjiang all wear bluetooth Wang Longjiang I tell
      you I tell you in the grave is that alias alias little uncle dear little uncle Zhao Jinlan's direct son direct
      grandson Zha you play with Wang Shouyi that's my son he calls me Taizu nai nai Aiyin Si Ye Heenala I'm Arnold I
      tell you he doesn't take instructions from Du Kang Let me tell you something about the liver you don't belong to
      the criminal police He doesn't take orders from Du Kang Why he's Korean He's a partner He has his own regime but
      you're in Asia this area Mudanjiang is called the little United Nations You violated military authority you can
      arrest him But what are you doing for what are you doing for what Or limit your numbers or you you can not freeze
      you do not have sovereignty you this soldier is not hard ah your theory is not strong you do not understand your
      worldly wisdom you for a few numbers lead to your direction ah
      </span>
      <br>
      <span style="font-size: smaller">
        你有这么高速运转的机械进入中国记住我给出的原理小的时候就是研发人就是研发这个东西的原理是阴间政权管着
        知道为什么有生灵给他运转先位还有还有专门饲养这个为什么地下产这种东西它管着它说是五世同堂旗下子孙你以为我跟你闹着玩呢
        你不你不你不警察吗黄龙江一派全都带蓝牙王龙江我告我告诉你在阴间是是那个化名化名小舅亲小舅赵金兰的那个嫡子嫡孙
        咋你跟王守义玩的那是我儿子他都管我叫太祖奶爱因斯姐叶赫那拉我是施瓦辛格我告诉你他不听命于杜康我跟你说句肝儿上的事
        你不刑警队的吗他不听命于杜康为什么他是韩国人他属于合合作方合伙人自有自己有自己的政权但是你进入亚洲了
        这这块儿牡丹江号称小联合国你触犯了军权你就可以抓他但是你们为了什么你为了是碎银几两啊还是限制你的数字啊
        还是你你定格不了你没有主权你这兵不硬啊你理论不强你说不明白你人情世故你为了几个数字导致你的方向啊
      </span>
    </div>
    <div style="margin-top: 10px; text-align: right; font-weight: bolder">
      @copyright 2024
    </div>
  </el-dialog>
</template>

<script>
import Profile from "@/views/Profile.vue";
import AdventureOne from "@/views/AdventureOne.vue";
import AdventureTwo from "@/views/AdventureTwo.vue";
import AdventureThree from "@/views/AdventureThree.vue";
import WholeViewBar from "@/views/WholeViewBar.vue";
import FinalProfile from "@/views/FinalProfile.vue";
import {ChatLineSquare, ArrowRight, CaretBottom, CaretTop, Warning, Star, MoreFilled,} from "@element-plus/icons-vue";

export default {
  name: "Homepage",
  components: {
    AdventureTwo,
    AdventureThree,
    Warning, ArrowRight, CaretTop, CaretBottom, Star, ChatLineSquare, Profile, AdventureOne, WholeViewBar, FinalProfile
  },
  data() {
    return {
      activeIndex: '1',
      userStatus: 1, // 1是研一学生，2是研二学生，3是研三学生，4是毕业
      healthyValue: 3.0,
      abilityValue: 3.0,
      userLabel: '普通研究生 Lv.1',
      userLabelType: 'primary',

      username: '张三（修改你的名字）',

      gameFlowValue: 0,
      achievementDraw: false,

      finalSummaryDialog: false,
      finalLoading: false,

      aboutUSDialog: false,

      timelines: [
        {
          content: '入学典礼',
          timestamp: '2024-09-01',
          type: 'danger',
        },
      ],
      achievements: [],
      achievementTagsType: ['primary', 'success', 'info', 'warning', 'danger'],
      fits: ['cover', 'cover', 'cover', 'cover', 'cover'],
      finalTitle: '疯狂的MAX',
      finalContent: 'MBTI 最初是由两名美国人——凯瑟琳·库克·布里格斯和她的女儿伊莎贝尔·布里格斯·迈尔斯所建构，于1944年发表。这项指标的理论基础来自瑞士精神科医师兼精神分析师卡尔·荣格的著作《心理类型》。迈尔斯认为荣格的著作对大众而言过于复杂难懂，于是尝试将荣格认知功能整理得更加易于理解。布里格斯自1917年开始进行有关人格的研究。在遇见她未来的女婿时，她观察到他的个性与其他家庭成员有明显的差异。其后她开始从事人物传记的研读，并开发了一种类型学，其中她提出了四种气质：“沉思型”（英语：meditative）、“自发型”（英语：spontaneous）、“决策型”（英语：executive）和“社交型”（英语：social）。',
      userChoices: [],
      userResultID: 1,
      userResults: [
        {
          // 0
          title: '结局1：平凡的三年',
          content: '平凡的生活，平凡的学习，平凡才是人生的常态。不如试试把平凡看作是一种幸运呢？'
        },
        {
          // 1
          title: '结局2：顺利毕业，初入社会',
          content: '你经过了三年的刻苦奋斗，丝滑地完成了自己的学习任务，卷了一篇论文出来，还算顺利地毕业了。毕业之后要面临什么呢，似乎你也无从知晓。你找了一个跟IT相关的工作，其实压力还是蛮大的，早10晚10连轴转。不过好在自己还是挺喜欢这份工作的，虽然你也不知道自己的这份喜爱会持续多久。无所谓吧，相信自己还是有大好前程的～'
        },
        {
          // 2
          title: '结局3：学术界的新星陨落了',
          content: '你的研究生生活的主旋律是"开摆"，摆了三年的你最终还是败在了毕业论文的手上。著名五星上将麦克阿瑟对此评价到："可惜啊，一颗科研界的新星，刚刚亮了一下，就灭了"。'
        },
        {
          // 3
          title: '结局4：漫漫求学路',
          content: '你听从了导师的建议，继续留在实验室（当牛做马）苦读，希望有一天自己能够成为需要担心"飞升急走"的大学青椒吧～祝你好运，再见你是在几年之后呢？'
        },
        {
          // 4
          title: '隐藏结局：我在北航当食神',
          content: '最后也算是成功毕业了，但好像自己有所长进的只有味蕾的能力？'
        },
        {
          // 5
          title: '隐藏结局：人脉收集器',
          content: '这就是E人的含金量！研究生三年，先不谈学术成果，单凭咱结交的朋友之多，都够开一次全国计算机技术大会的了'
        },
        {
          // 6
          title: '隐藏结局：幸运创业家',
          content: '你最终还是选择了前去创业，很幸运地，捡垃圾确实是下一个时代的风口，你一战成名，被人们尊称为"LESE的KING"！'
        },
      ]
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    changeValues(data) {
      this.abilityValue = data.ability
      this.healthyValue = data.healthy
    },
    changeUserStatus(newStatus) {
      this.userStatus = newStatus
    },
    checkUserResult() {
      if (this.userChoices.includes("2-0-2")) {
        this.userResultID = 6
      } else if (this.userChoices.includes("0-0-0") && this.userChoices.includes("0-2-0") && this.userChoices.includes("0-9-0")) {
        this.userResultID = 4
      } else if (this.userChoices.includes("0-0-1") && this.userChoices.includes("0-3-2") &&
          this.userChoices.includes("0-12-2") && this.userChoices.includes("1-5-2") && this.userChoices.includes("1-7-2")) {
        this.userResultID = 2
      } else if (this.userChoices.includes("0-0-2") && this.userChoices.includes("0-3-0") && this.userChoices.includes("1-2-1")
          && this.userChoices.includes("1-6-0") && this.userChoices.includes("1-7-0") && this.userChoices.includes("1-14-0")
          && this.userChoices.includes("2-0-0")) {
        this.userResultID = 3
      } else if (this.userChoices.includes("0-1-1") && this.userChoices.includes("0-10-1") && this.userChoices.includes("1-11-0")
          && this.userChoices.includes("2-2-1")) {
        this.userResultID = 5
      } else {
        this.userResultID = 1
      }
    },
    openFullScreenLoading() {
      this.finalSummaryDialog = true
      this.finalLoading = true
      this.checkUserResult()
      setTimeout(() => {
        this.finalLoading = false
      }, 500)
    },
    addAchievements(achievements) {
      this.achievements = this.achievements.concat(achievements)
    },
    addUserChoices(choices) {
      this.userChoices = this.userChoices.concat(choices)
    },
    changeName(name) {
      this.username = name
    }
  },
  watch: {
    userStatus(val) {
      if (val === 1) {
        this.gameFlowValue = 0
      } else if (val === 2) {
        this.gameFlowValue = 30
        let event1 = {content: '超级国庆节！', timestamp: '2024-10-01', type: 'success',}
        let event2 = {content: '又要过年了，My Bro', timestamp: '2025-02-01', type: 'warning',}
        let event3 = {content: '疯狂五一！', timestamp: '2025-05-01', type: 'success',}
        this.timelines.push(event1, event2, event3)
      } else if (val === 3) {
        this.gameFlowValue = 60
        let event1 = {content: '我的妈，开题写啥啊', timestamp: '2025-09-20', type: 'primary',}
        let event2 = {content: '是谁除夕还在写本子', timestamp: '2026-02-17', type: 'primary',}
        let event3 = {content: '该想想下学期要不要毕业了', timestamp: '2026-05-01', type: 'info',}
        this.timelines.push(event1, event2, event3)
      } else if (val === 4) {
        this.gameFlowValue = 100
        let event1 = {content: '流泪猫猫头', timestamp: '2026-09-20', type: 'warning',}
        let event2 = {content: '我的论文是垃圾', timestamp: '2027-01-01', type: 'primary',}
        let event3 = {content: '还是毕业了', timestamp: '2027-06-01', type: 'success',}
        this.timelines.push(event1, event2, event3)
      }
    },
    healthyValue(val) {
      if (this.abilityValue < 2) {
        if (val < 2) {
          this.userLabel = '锟斤拷烫烫烫'
          this.userLabelType = 'danger'
        } else if (val < 4) {
          this.userLabel = '开心小笨蛋'
          this.userLabelType = 'warning'
        } else {
          this.userLabel = '阳光开朗小笨蛋'
          this.userLabelType = 'success'
        }
      } else if (this.abilityValue < 4) {
        if (val < 2) {
          this.userLabel = '拼命三郎（科研版）'
          this.userLabelType = 'warning'
        } else if (val < 4) {
          this.userLabel = '均衡星神.jpg'
          this.userLabelType = 'success'
        } else {
          this.userLabel = '真的真的很不错'
          this.userLabelType = 'primary'
        }
      } else {
        if (val < 2) {
          this.userLabel = 'WATCH OUT!BRO!'
          this.userLabelType = 'danger'
        } else if (val < 4) {
          this.userLabel = '需要一些肥宅快乐水'
          this.userLabelType = 'success'
        } else {
          this.userLabel = 'YYDS!'
          this.userLabelType = 'info'
        }
      }
    },
    abilityValue(val) {
      if (val < 2) {
        if (this.healthyValue < 2) {
          this.userLabel = '锟斤拷烫烫烫'
          this.userLabelType = 'danger'
        } else if (this.healthyValue < 4) {
          this.userLabel = '开心小笨蛋'
          this.userLabelType = 'warning'
        } else {
          this.userLabel = '阳光开朗小笨蛋'
          this.userLabelType = 'success'
        }
      } else if (val < 4) {
        if (this.healthyValue < 2) {
          this.userLabel = '拼命三郎（科研版）'
          this.userLabelType = 'warning'
        } else if (this.healthyValue < 4) {
          this.userLabel = '均衡星神.jpg'
          this.userLabelType = 'success'
        } else {
          this.userLabel = '真的真的很不错'
          this.userLabelType = 'primary'
        }
      } else {
        if (this.healthyValue < 2) {
          this.userLabel = 'WATCH OUT!BRO!'
          this.userLabelType = 'danger'
        } else if (this.healthyValue < 4) {
          this.userLabel = '需要一些肥宅快乐水'
          this.userLabelType = 'success'
        } else {
          this.userLabel = 'YYDS!'
          this.userLabelType = 'info'
        }
      }
    },
  }
}
</script>

<style scoped>
.round-border {
  padding: 10px;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: row;
  /*align-items: center;*/
}

.demo-image .block {
  padding: 30px 0;
  text-align: center;
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  vertical-align: top;
}

.demo-image .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

</style>
