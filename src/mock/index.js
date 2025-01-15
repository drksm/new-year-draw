import Mock from 'mockjs'

// 设置响应延时
Mock.setup({
  timeout: '500-1000'
})

// 模拟签文数据
const mockLots = [
  {
    id: 1,
    number: "上上签",
    content: "宝马雕车香满路，凤箫声动玉壶春。",
    interpretation: "此签大吉，诸事顺遂，可大胆向前。",
    detail: {
      overview: "此签为上上签，大吉大利。心想事成，前途光明。",
      fortune: "事业：蒸蒸日上，有贵人相助。\n财运：财源广进，可多加投资。\n姻缘：良缘在即，可把握机会。\n健康：身体康泰，无病无灾。",
      advice: "可以大胆向前，把握机遇，事业财运都将有新的突破。切记在顺境中保持谦逊，方能基业长青。"
    }
  },
  {
    id: 2,
    number: "上签",
    content: "云开见月春光好，花发闻莺喜气新。",
    interpretation: "前途光明，万事如意。",
    detail: {
      overview: "此签为上签，喜气盈门，诸事皆顺。",
      fortune: "事业：稳步上升，贵人扶持。\n财运：正财稳健，偏财可期。\n姻缘：有情人终成眷属。\n健康：平安喜乐，无灾无患。",
      advice: "顺势而为，保持谦和，贵人自会相助。宜把握当前机遇，稳扎稳打，循序渐进。"
    }
  },
  {
    id: 3,
    number: "中签",
    content: "山色湖光铺锦绣，眼前风景正相宜。",
    interpretation: "平稳安康，守成为上。",
    detail: {
      overview: "此签为中签，平稳安宁，守成有余。",
      fortune: "事业：稳中求进，切勿冒进。\n财运：收支平衡，宜守勿进。\n姻缘：缘分已到，珍惜为要。\n健康：保持规律，适度运动。",
      advice: "宜守不宜进，稳妥行事。当前局势平稳，不必强求改变，顺其自然即可。"
    }
  },
  {
    id: 4,
    number: "上上签",
    content: "金榜题名在此时，春风得意马蹄疾。",
    interpretation: "学业事业双丰收，名利双收。",
    detail: {
      overview: "此签大吉，学业事业皆有重大突破，名利双收可期。",
      fortune: "事业：即将突破，成就非凡。\n财运：横财大发，正财亨通。\n姻缘：佳偶天成，百年好合。\n健康：精力充沛，神采奕奕。",
      advice: "机不可失，时不再来。当前是人生的关键转折点，应当全力以赴，把握机会。同时也要注意劳逸结合。"
    }
  },
  {
    id: 5,
    number: "上签",
    content: "东风送暖入屠苏，千门万户曈曈日。",
    interpretation: "新的机遇即将到来，万象更新。",
    detail: {
      overview: "此签为上签，预示新的机遇即将到来，万象更新。",
      fortune: "事业：新的发展，扶摇直上。\n财运：财源广进，喜从天降。\n姻缘：桃花盛开，有情人成眷属。\n健康：春回大地，生机勃勃。",
      advice: "新的机遇就在眼前，应当以积极开放的心态迎接变化。投资理财宜稳健，感情可大胆追求。"
    }
  },
  {
    id: 6,
    number: "中上签",
    content: "碧水荡漾映晴空，渔歌唱晚送轻风。",
    interpretation: "平安顺遂，渐入佳境。",
    detail: {
      overview: "此签为中上签，预示平稳中有所收获，渐入佳境。",
      fortune: "事业：循序渐进，稳中有升。\n财运：积少成多，日进斗金。\n姻缘：缘分渐近，耐心等待。\n健康：保养得当，渐入佳境。",
      advice: "当前形势大好，但不可急于求成。应当脚踏实地，一步一个脚印，终会达到理想的彼岸。"
    }
  },
  {
    id: 7,
    number: "上上签",
    content: "一枝梅花傲雪开，不负韶华不负春。",
    interpretation: "坚持不懈，终见花开。",
    detail: {
      overview: "此签为上上签，表示经过努力终将迎来丰硕成果。",
      fortune: "事业：守得云开见月明。\n财运：积累已久，即将收获。\n姻缘：真爱已至，珍惜把握。\n健康：冬去春来，身强体健。",
      advice: "过往的努力即将开花结果，继续保持坚韧不拔的精神，喜悦与收获就在眼前。"
    }
  },
  {
    id: 8,
    number: "上签",
    content: "明月几时有，把酒问青天。",
    interpretation: "心想事成，皆如所愿。",
    detail: {
      overview: "此签为上签，表示心中所想皆有望实现。",
      fortune: "事业：志存高远，终有所成。\n财运：财运亨通，收益可期。\n姻缘：情深意长，天赐良缘。\n健康：心情舒畅，身体康泰。",
      advice: "心中所想皆有可能实现，但需保持谦逊之心，不可过于急躁。顺其自然，水到渠成。"
    }
  }
]

// 拦截抽签请求
Mock.mock('/api/lot/draw', 'post', () => {
  return {
    code: 200,
    data: mockLots[Math.floor(Math.random() * mockLots.length)],
    message: 'success'
  }
})

// 解签接口
Mock.mock(/\/api\/lot\/interpret\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const lot = mockLots.find(l => l.id === id)
  
  return {
    code: 200,
    data: lot?.detail || {
      overview: "解签失败，请重试。",
      fortune: "",
      advice: ""
    },
    message: 'success'
  }
}) 