

slides.pdf: slides.md Makefile
	npm exec slidev -- export --dark --with-clicks --format png --output slides.png/
	convert slides.png/*.png slides.pdf
	rm -rf slides.png/

html: slides.md Makefile
	npm exec slidev -- build --out html --base /members/Enrico.Tassi/lambda-world-2026/html/

upload: slides.pdf html
	scp -Cr slides.pdf html/ roquableu.inria.fr:/net/servers/www-sop/members/Enrico.Tassi/lambda-world-2026/
	@echo
	@echo 'https://www-sop.inria.fr/members/Enrico.Tassi/lambda-world-2026'
