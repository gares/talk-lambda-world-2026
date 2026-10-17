

slides.pdf: slides.md Makefile
	npm exec slidev -- export --dark --with-clicks --format png --output slides.png/
	convert slides.png/*.png slides.pdf
	rm -rf slides.png/

html: slides.md Makefile
	npm exec slidev -- build --out html --base /members/Enrico.Tassi/lambda-world-2026/html/

# opened from the disk (file://), no web server: it needs `routerMode: hash`
# (see slides.md) and a Chrome started with the flag below; the separate
# profile makes sure a new Chrome starts, a running one would ignore the flag
html.local: slides.md Makefile
	npm exec slidev -- build --out html.local --base $$PWD/html.local/
	google-chrome --user-data-dir=$${TMPDIR:-/tmp}/slidev-chrome --allow-file-access-from-files file://$$PWD/html.local/index.html
	
upload: slides.pdf html
	scp -Cr slides.pdf html/ roquableu.inria.fr:/net/servers/www-sop/members/Enrico.Tassi/lambda-world-2026/
	@echo
	@echo 'https://www-sop.inria.fr/members/Enrico.Tassi/lambda-world-2026'
