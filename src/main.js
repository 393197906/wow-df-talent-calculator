import './style.scss'
import { CalculatorTree } from './scripts/tree'
import { CalculatorTooltip } from './scripts/tooltip'
import { setVersion } from './scripts/version'
import { build } from './scripts/build'
import { setLanguage, lang } from './scripts/language'
import { Menu } from './scripts/menu'
import { request } from './scripts/api'

const menu = new Menu('魔兽世界10.0(巨龙时代)天赋模拟器', getTrees, true, false)
setLanguage()
// setVersion()

const tooltip = new CalculatorTooltip()

const classTree = new CalculatorTree('#class-tree', 31, tooltip, build)
const specTree = new CalculatorTree('#spec-tree', 30, tooltip, build)
let bufferTree

let currentClass = ''
let currentSpec = ''

const trees = document.querySelector('.trees')

let path = window.location.pathname.split('/')
setTimeout(setPath, 100)
function setPath() {
  if (path[1]) menu.setClass(path[1])
  if (path[3]) menu.setSpec(path[3])
}

async function getTrees(cls, spec) {
  if (currentClass == cls && currentSpec == spec) return
  currentClass = cls
  currentSpec = spec

  await getTree(true, 'class')
  await getTree()

  menu.up()

  build.setClass(currentClass)
  build.setSpec(currentSpec)

  trees.style.display = 'flex'
  document.querySelector('.lang-select-wrapper').style.display = 'block'
}

async function getTree(buffer = false, spec = currentSpec) {
  const req = {
    lang: lang,
    class: currentClass,
    spec: spec
  }
  const json = await (await (request('getTree', req))).json()

  if (!json) {
    alert(`Something went wrong. Please try to reload the page.`)
    return
  }

  const tree = json.tree
  const texts = json.texts

  tree.title = texts.title
  tree.talents.forEach(tal => {
    const text = texts.talents.filter(t => t.id == tal.id)[0]
    if (text) {
      tal.title = text.title
      tal.descr = text.descr
      tal.title2 = text.title2
      tal.descr2 = text.descr2
    }
  })
  if (buffer) {
    bufferTree = tree
    return
  }
  classTree.setTree(bufferTree, path[2] || '')
  specTree.setTree(tree, path[4] || '')
  path = []

  if (tree.defaultTalents) classTree.setDefaultTalents(tree.defaultTalents)

  trees.style.backgroundColor = specTree.color || '#212121'
  document.querySelector('.trees').style.backgroundImage = `url(https://projects.yoro.dev/df-talents/img/bg/${currentClass}-${currentSpec}.webp)`
}
