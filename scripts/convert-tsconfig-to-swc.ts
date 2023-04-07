import { convert } from 'tsconfig-to-swcconfig'

const config = convert('tsconfig.json', process.cwd(), {
  // more swc config to override...
  minify: true,
});

console.dir(JSON.stringify(config), { depth: null });