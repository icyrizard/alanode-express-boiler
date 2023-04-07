// const fs = require('fs');
// const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, 'utf-8'));

const fs = require('fs')
const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, 'utf-8'))

module.exports = {
	transform: {
		'^.+\\.(t|j)sx?$': ['@swc/jest', { ...config, /* custom configuration in Jest */ }],
	},
}


// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
// 	preset: 'ts-jest',
// 	testEnvironment: 'node',
// 	transformIgnorePatterns: [
// 		'<rootDir>/node_modules/',
// 	],
// 	testMatch: [
// 		'**/tests/**/*.test.ts',
// 		'!**/src/**'
// 	],
// 	transform: {
// 		"^.+\\.(t|j)sx?$": ["@swc/jest", { ...config, /* custom configuration in Jest */ }],
// 	}
// };
