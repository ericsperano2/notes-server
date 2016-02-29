console.error("SyntaxError: {\n  \"name\": \"notes-server\",\n  \"version\": \"0.0.1\",\n  \"description\": \"\",\n  \"private\": true,\n  \"author\": \"eric.sperano@gmail.com\",\n  \"license\": \"BSD\",\n  \"main\": \"server.js\",\n  \"scripts\": {\n    \"browserify\": \"node_modules/.bin/browserify ./ui/main.js -o ./public/js/bundle.js\",\n    \"build\": \"npm run browserify\",\n    \"doc\": \"rm -rf doc && node_modules/.bin/jsdoc -c ./.jsdoc.conf.json\",\n    \"open-cov\": \"open coverage/lcov-report/index.html\",\n    \"open-doc\": \"open doc/index.html\",\n    \"pretest\": \"node_modules/.bin/eslint *.js config controllers models __tests__ __mocks__\",\n    \"start\": \"node server.js\",\n    \"test\": \"node_modules/.bin/jest --verbose\",\n    \"watch\": \"node_modules/.bin/watchify ./ui/main.js -d -o public/js/bundle.js -v\"\n  },\n  \"repository\": {\n    \"type\": \"git\",\n    \"url\": \"git@bitbucket.org:spe76/notes-server.git\"\n  },\n  \"jest\": {\n    \"scriptPreprocessor\": \"<rootDir>/preprocessor.js\",\n    \"unmockedModulePathPatterns\": [\n      \"/node_modules/async\",\n      \"/node_modules/lodash\",\n      \"/node_modules/express\",\n      \"/node_modules/react\"\n    ],\n    \"collectCoverage\": true\n  },\n  \"browserify\": {\n    \"transform\": [\n      \"reactify\"\n    ]\n  },\n  \"dependencies\": {\n    \"aws-sdk\": \"^2.2.37\",\n    \"body-parser\": \"^1.13.3\",\n    \"cli-color\": \"^1.0.0\",\n    \"cookie-parser\": \"^1.3.5\",\n    \"express\": \"^4.13.3\",\n    \"express-handlebars\": \"^2.0.1\",\n//    \"gitkitclient\": \"0.0.5\",\n    \"jquery\": \"^2.1.4\",\n    \"morgan\": \"^1.6.1\",\n    \"passport\": \"^0.3.2\",\n    \"passport-google-oauth20\": \"^1.0.0\",\n    \"react\": \"^0.13.3\",\n    \"react-bootstrap\": \"^0.25.1\",\n    \"socket.io\": \"^1.4.5\"\n  },\n  \"devDependencies\": {\n    \"browserify\": \"^11.0.1\",\n    \"eslint\": \"^1.3.1\",\n    \"jest-cli\": \"^0.5.0\",\n    \"jsdoc\": \"^3.3.2\",\n    \"react-tools\": \"^0.13.3\",\n    \"reactify\": \"^1.1.1\",\n    \"watchify\": \"^3.4.0\"\n  }\n}\n : Unexpected token /");