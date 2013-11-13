if (ender && ender.export) {
  ender.export('global', global)
  ender.export('require', require)
  ender.export('provde', provide)
  ender.export('Module', Module)
}
