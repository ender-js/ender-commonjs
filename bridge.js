if (ender && ender.expose) {
  ender.expose('global', global)
  ender.expose('require', require)
  ender.expose('provide', provide)
  ender.expose('Module', Module)
}
