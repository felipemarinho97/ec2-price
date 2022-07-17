build:
	bash -C get.sh
	node index.js
	node instances/process.js

	node calculate.js > api/best.json

deploy:
	vercel --prod