var path = require('path');

var isPlainObject = function(obj){
    if(!obj.hasOwnProperty('constructor') && typeof obj == 'object' && obj.constructor == Object){
        return true;
    }

    return false;
};
var mix = function(base, child, deep){
    var o = new Object();
    for(var key in base){
        o[key] = base[key];
    }
    for(var key in child){
        if(deep && isPlainObject(o[key])){
            o[key] = mix(o[key], child[key]);
        }else{
            o[key] = child[key];
        }
    }
    return o;
};

module.exports = function(grunt) {

    var config = {
        webroot: 'src',
        dist: 'dist',
        testroot: 'test',
        tstamp: '<%= grunt.template.today("ddmmyyyyhhMMss") %>',
        requirejsExclude: ['rs-config', 'jquery', 
            'comp/datetimepicker/jquery.datetimepicker', 'text', 'moment',
            'comp/datetimepicker/pickerMonth', 'lib/jquery.qrcode.min', 'app/static-config'
        ],
        staticHost: '//yjb-static.youku.com/mall/webstatic/',
        javaFile: 'D:\\work\\PCDN\\src\\mall\\trunk\\mall-web\\src\\main\\resources'
    };

    grunt.initConfig({
        config: config,
        less: {
            development: {
                options: {
                    paths: ["less"]
                },
                files: [
                    {
                        expand: true,     //Enable dynamic expansion.
                        cwd: '<%= config.webroot %>/less/',      //Src matches are relative to this path.
                        src: ['**/*.less'], //Actual pattern(s) to match.
                        dest: 'src/css/',   //Destination path prefix.
                        ext: '.css',   //Dest filepaths will have this extension.
                        extDot: 'first'   //Extensions in filenames begin after the first dot
                    },
                ],
            },
            dist: {
                options: {
                    paths: ["less"],
                    compress: true
                },
                files: [
                    {
                        expand: true,     //Enable dynamic expansion.
                        cwd: '<%= config.webroot %>/less/',      //Src matches are relative to this path.
                        src: ['**/*.less'], //Actual pattern(s) to match.
                        dest: 'src/css/',   //Destination path prefix.
                        ext: '.css',   //Dest filepaths will have this extension.
                        extDot: 'first'   //Extensions in filenames begin after the first dot
                    },
                ],
            }
        },

        clean: {
            tests: ['dist'],
            tmpl: ['src/js/app/**/*.tmpl.js', 'src/js/comp/**/*.tmpl.js']
        },
        inline_text: {
            def: {
                files: [{
                    expand: true,
                    cwd: '<%= config.webroot %>',
                    src: ['js/app/**/*.tmpl', 'js/comp/**/*.tmpl'],
                    dest: '<%= config.webroot %>'
                }]
            }

        },

        requirejs: {
            compile: {
                options: {
                    appDir: '<%= config.webroot %>',
                    baseUrl: "js",
                    dir: '<%= config.dist %>',
                    mainConfigFile: '<%= config.webroot %>/js/rs-config.js',
                    optimize: 'uglify',
                    skipDirOptimize: false,
                    fileExclusionRegExp: /^\.|\.less$/,
                    optimizeAllPluginResources: true,
                    modules: [
                        {
                            name: 'app/page-index',
                            exclude: config.requirejsExclude
                        },
                    ]
                }
            },

            test: {
                options: {
                    appDir: '<%= config.webroot %>',
                    baseUrl: "js",
                    dir: '<%= config.dist %>',
                    mainConfigFile: '<%= config.webroot %>/js/rs-config.js',
                    optimize: 'none',
                    skipDirOptimize: true,
                    fileExclusionRegExp: /^\.|\.less$/,
                    optimizeAllPluginResources: true,
                    modules: [
                    ]
                }
            }
        },

        watch: {
            options: {
                // Reload assets live in the browser.
                // Default livereload listening port is 35729.
                livereload: 1337
            },
            less: {
                files: ['<%= config.webroot %>/less/**/*.less'],
                tasks: [
                    'less:development'
                ],
                options: {
                    nospawn: true
                }
            },
            html: {
                files: ['<%= config.webroot %>/page/**/*.html','<%= config.webroot %>/**/*.js', '<%= config.webroot %>/view/**/*.tp'],
                options: {
                    nospawn: true
                }
            }
        },
        cacheBust: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 16,
                deleteOriginals: true,
                jsonOutput: true,
                ignorePatterns: ['test', 'require.js', 'bootstrap', 'jquery', 'moment'],
                baseDir: '<%= config.dist %>',
                filters: {
                    'script': [
                        function() {
                            return this.attribs['data-main'];
                        },
                        function() {
                            return this.attribs.src;
                        }
                    ]
                }
            },
            assets: {
                files: [
                    {   
                        expand: true,
                        cwd: '<%= config.dist %>',
                        src: ['css/**/*.css', 'page/**/*.html']
                    }
                  ]
            }
        },

        bust_requirejs_cache: {
            default:{
                options:{
                    dist: '<%= config.dist%>',
                    appDir: '<%= config.dist%>',
                    ignorePatterns: ['jquery', 'rs-config', 'moment']
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: ['page/**/*.html'],
                    dest: '<%= config.dist%>'
                }]
            }
        },

        replace: {
            distlocal: {
                options: {
                    patterns: [
                    {
                        match: /([\("'])((\.+\/)+)(.*?[\("'])/ig,
                        replacement: function(){
                           return arguments[1] + config.staticHost + arguments[4];
                        }
                    }
                    ]
                },
                files: [
                {
                    expand: true, 
                    cwd: '<%= config.dist %>',
                    src: ['page/**/*.html', 'css/**/*.css', 'js/rs-config.*js', 'js/app/static-config.js'], 
                    dest: '<%= config.dist %>'
                }
                ]
            },

            distonline: {
                options: {
                    patterns: [
                    {
                        match: /([\("'])((\.+\/)+)(.*?[\("'])/ig,
                        replacement: function(){
                           return arguments[1] + '/static/' + arguments[4];
                        }
                    }
                    ]
                },
                files: [
                {
                    expand: true, 
                    cwd: '<%= config.dist %>',
                    src: ['page/**/*.html', 'css/**/*.css', 'js/rs-config.*js', 'js/app/static-config.js'], 
                    dest: '<%= config.dist %>'
                }
                ]
            }
        },

        source_map: {
            bust:{
                options:{
                    dist: '<%= config.dist%>',
                    java: '<%= config.javaFile%>',
                    mergeFiles: ['D:\\work\\PCDN\\frontend\yjb-mall\\dist\\source-map.json'],
                    filename: 'source-map-web.json'
                },
                files: [{
                    expand: true, 
                    cwd: '<%= config.dist %>',
                    src: ['grunt-cache-bust.json', 'resource-map.json'], 
                    dest: '<%= config.dist %>'
                }]
            },

            debug: {
                options: {
                    nomap: true,
                    java: '<%= config.javaFile%>',
                    filename: 'source-map-web.json'
                }
            }
        },
        express: {
            options:{
                port: 9010
            },
            dev: {
                options: {
                    script: 'server/index.js'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-replace');
    //grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-inline-text');
    //grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask('dist', [
        'less:development',
        'requirejs',
        'bust_requirejs_cache',
    ]);

    grunt.registerTask('dev', ['express:dev', 'watch']);

    grunt.registerTask('debug', [
        'clean',
        'less:dist',
        'inline_text',
        'requirejs:test',
        'clean:tmpl',
        'replace:distlocal',
        'source_map:debug',
    ]);
    grunt.registerTask('release', [
        'clean',
        'less:dist',
        'requirejs:compile',
        'cacheBust',
        'bust_requirejs_cache',
        'replace:distlocal',
        'source_map:bust'
    ]);

};
