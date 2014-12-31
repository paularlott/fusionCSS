#
# Makefile to build fusionCSS
#

all: css/fusion.css css/fusion.min.css js/fusionCSS.js js/fusionCSS.ui.js

css/fusion.css: less/*.less
	mkdir -p css
	lessc less/fusionCSS.less > css/fusion.css

css/fusion.min.css: less/*.less
	mkdir -p css
	cat less/version.less > css/fusion.min.css
	lessc -x less/fusionCSS.less >> css/fusion.min.css

js/fusionCSS.js: js/src/fusionCSS.js
	java -jar /opt/closure/compiler.jar --js=js/src/fusionCSS.js --js_output_file=js/fusionCSS.js

js/fusionCSS.ui.js: js/src/fusionCSS.ui.js
	java -jar /opt/closure/compiler.jar --js=js/src/fusionCSS.ui.js --js_output_file=js/fusionCSS.ui.js

.PHONY: clean

clean:
	rm -f css/fusion.css css/fusion.min.css js/fusionCSS.js js/fusionCSS.ui.js
