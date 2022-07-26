download:
	bash -C get.sh

build:
	node index.js
	node instances/process.js
	node calculate.js > /dev/null
	sed -E -i 's|(<span id="gen-date">)([0-9\-]{0,})(</span>)|\1'`date +%Y-%m-%d`'\3|g' public/index.html

deploy:
	vercel --prod
