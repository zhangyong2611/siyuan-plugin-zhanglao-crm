const fs = require('fs-extra');
const archiver = require('archiver');

// 插件配置
const pluginInfo = require('./plugin.json');
const outputFile = `package.zip`;
const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', { zlib: { level: 9 } });

// 清空旧包
if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile);
}

// 打包逻辑
output.on('close', () => {
  console.log(`✅ 打包完成！插件包大小：${(archive.pointer() / 1024).toFixed(2)} KB`);
  console.log(`📦 插件包路径：${process.cwd()}/${outputFile}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// 打包插件核心文件（排除node_modules、package.zip等无关文件）
archive.glob('**/*', {
  ignore: [
    'node_modules/**/*',
    'package.zip',
    'package-lock.json',
    'pnpm-lock.yaml',
    '.git/**/*',
    '.gitignore',
    'README.md'
  ]
});

archive.finalize();