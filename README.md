<a href="http://fusioncss.com/"><img src="http://fusioncss.com/assets/public_files/images/logo.png" alt="fusionCSS" /></a>

fusionCSS V2.0.0
====

[http://fusioncss.com](http://fusioncss.com)

[fusionCSS](http://fusioncss.com) is a simple responsive HTML5 and CSS toolkit supporting nested grids created by [@paularlott](http://twitter.com/paularlott).

You can use fusionCSS to rapidly prototype and build responsive web pages and apps that work across a wide range of devices. The key features of fusionCSS are:

* Nestable fluid grid system
* Works on virtually anything
* Built with [LESS](http://lesscss.org/)
* Minimal, fusionCSS doesn't try to do design for you
* Native support for fusionCSS in [fusionLib](http://fusionlib.com) and [clearFusionCMS](http://clearfusioncms.com)

Getting Started with fusionCSS
====

Default Build
----

The easiest way to start using fusionCSS within your projects is to copy the pre-compiled CSS and JavaScript files into your project and reference them:

* css/fusion.min.css
* js/fusionCSS.js

Within the head section of your HTML document you should have:

<link href="js/fusion.min.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="js/fusionCSS.js"></script>
<!--[if lt IE 9]><script type="text/javascript" src="//cdn.jsdelivr.net/g/respond,html5shiv"></script><![endif]-->

Custom Build
----

fusionCSS has been built on an Ubuntu workstation with LESS and Google closure compiler installed, the makefile within the repository assumes:

* Google closure compiler has been installed as /opt/closure/compiler.jar and that java -jar /opt/closure/compiler.jar will invoke it
* LESS has been installed e.g. sudo apt-get install node-less and that lessc runs

To build a new version of fusionCSS, edit the .less files within the less folder and then invoke make, the compiled output will be placed into the css folder.