class Build {
  constructor() {
    this.class = ''
    this.classLink = ''
    this.spec = ''
    this.specLink = ''

    this.classPoints = 0
    this.specPoints = 0

    this.level = 9

    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('level-required')
    this.wrapper.innerHTML = '人物等级: '
    this.levelEl = document.createElement('level')
    this.levelEl.innerHTML = this.level

    this.wrapper.appendChild(this.levelEl)
    document.body.append(this.wrapper)

    // 右侧tips
    this.tips = document.createElement('div')
    this.tips.classList.add('tips')
    this.tips.innerHTML = '提示：左键选择，右键回退'
    document.body.append(this.tips)
  }

  setClass(className) {
    this.class = className

    this.setState()
  }

  setClassLink(classLink) {
    if (!classLink.match(/^[-]*$/))
      this.classLink = classLink
    else this.classLink = ''

    this.setState()
  }

  setSpec(specName) {
    this.spec = specName

    this.setState()
  }

  setSpecLink(specLink) {
    if (!specLink.match(/^[-]*$/))
      this.specLink = specLink
    else this.specLink = ''

    this.setState()
  }

  setPoints(spec, points) {
    if (spec == 'class') this.classPoints = points
    else this.specPoints = points

    this.calcLevel()
  }

  calcLevel() {
    this.level = Math.max(8 + this.classPoints * 2, 9 + this.specPoints * 2)
    if (this.level < 10) {
      this.wrapper.style.bottom = '-38px'
      return
    }
    if (this.class == 'evoker' && this.level < 59) this.level = 59
    this.wrapper.style.bottom = '0'
    this.tips.style.bottom = '0'
    this.levelEl.innerHTML = this.level
  }

  setState() {
    if (!this.class) return
    let link = `/${this.class}/${this.classLink}/`
    if (this.spec) link += `${this.spec}/${this.specLink}`
    history.replaceState('', '', link)
  }

  reset() {
    this.class = ''
    this.classLink = ''
    this.spec = ''
    this.specLink = ''

    this.classPoints = 0
    this.specPoints = 0

    this.level = 9

    this.wrapper.style.bottom = '-38px'
    this.tips.style.bottom = '-38px'
    this.levelEl.innerHTML = this.level
  }
}

export const build = new Build()
