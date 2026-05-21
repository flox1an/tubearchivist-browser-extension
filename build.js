'use strict';

const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');

const options = {
  entryPoints: ['src/content-script/index.js'],
  bundle: true,
  outfile: 'extension/script.js',
  minify: false,
  sourcemap: false,
  target: ['chrome80', 'firefox80'],
};

async function run() {
  if (isWatch) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await esbuild.build(options);
    console.log('Build completed successfully.');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
