#
# Makefile to build fusionCSS
#

all: css/fusion.css css/fusion.min.css js/fusionCSS.js

css/fusion.css: less/*.less
	mkdir -p css
	lessc less/fusionCSS.less > css/fusion.css

css/fusion.min.css: less/*.less
	mkdir -p css
	lessc -x less/fusionCSS.less > css/fusion.min.css

js/fusionCSS.js: js/src/fusionCSS.js
	java -jar /opt/closure/compiler.jar --js=js/src/fusionCSS.js --js_output_file=js/fusionCSS.js

.PHONY: clean

clean:
	rm -f css/fusion.css css/fusion.min.css js/fusionCSS.js
