download:
	bash -C get.sh

build:
	node index.js
	node instances/process.js

	node calculate.js > /dev/null

deploy:
	vercel --prod