'use strict'
/* eslint-disable @typescript-eslint/no-var-requires */
const { series, src, dest } = require('gulp')
const sass = require('gulp-dart-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')
const through = require('through2')
const fs = require('fs')
const replace = require('gulp-replace')
const noElPrefixFile = /(index|base|display|default)/

const themes = ['dark','light']

function compileTheme(){
  const compiler = []
  themes.forEach(theme =>{
    function compile() {
      return src(['./src/common/var.scss','./src/default.scss'])
        .pipe(through.obj(function(file, encode, cb) {
          const filename = file.relative
          if (filename === 'var.scss'){
            fs.writeFileSync('./src/common/var.scss',`@import "var-${theme}";`)
          }else {
            this.push(file)
          }
          cb()
        }))
        .pipe(sass.sync())
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cssmin())
        .pipe(rename(function (path) {
          if(!noElPrefixFile.test(path.basename)) {
            path.basename = `el-${path.basename}`
          }
        }))
        .pipe(dest(`../../node_modules/theme-out/${theme}`))
    }

    function copyfont() {
      return src('./src/fonts/**')
        .pipe(cssmin())
        .pipe(dest(`../../public/theme/${theme}/fonts`))
    }

    // 修正相对路径
    // 删除 `~@/../public/` 这部分路径
    function fixRelativePath(){
      return src(`../../node_modules/theme-out/${theme}/default.css`)
        .pipe(replace('~@/../public/','../../'))
        .pipe(dest(`../../public/theme/${theme}`));
    }

    compiler.push(compile,fixRelativePath,copyfont)
  })
  return compiler
}


exports.build = series(...compileTheme())
