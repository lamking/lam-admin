#! /usr/bin/env node
const path = require('path');
const fs = require('fs');

const program = require('commander');
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');

program
  .version('0.1.0')
  .option('-i, init [name]', '初始化x-build项目')

program
  .parse(process.argv);

if (program.init) {
  const spinner = ora('正在从github下载lam-build').start();
  download('lamking/lam-admin-build#lamk-admin-build1.0', program.init, function (err) {
    if(!err){
      spinner.clear()
      console.info('');
      console.info(chalk.green('-----------------------------------------------------'));
      console.info('');
      spinner.succeed(['项目创建成功,请继续进行以下操作:'])
      console.info('');
      console.info(chalk.blueBright(` -  cd ${program.init}`));
      console.info(chalk.blueBright(` -  npm install`));
      console.info(chalk.blueBright(` -  npm run dev`));
      console.info('');
      console.info(chalk.gray('参考文档: https://github.com/codexu/x-build'));
      console.info('');
      console.info(chalk.green('-----------------------------------------------------'));
      console.info('');
      console.log();

      fs.readFile(`${process.cwd()}/${program.init}/package.json`, (err, data) => {
        if (err) throw err;
        let _data = JSON.parse(data.toString())
        _data.name = program.init
        _data.version = '1.0.0'
        let str = JSON.stringify(_data, null, 4);
        fs.writeFile(`${process.cwd()}/${program.init}/package.json`, str, function (err) {
          if (err) throw err;
        })
      });
    }else{
      spinner.warn(['发生错误，请在https://github.com/codexu，Issues留言'])
    }
  })
}
