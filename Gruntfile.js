/*global module:false*/
module.exports = function (grunt) {

    var optipng = require('imagemin-optipng');
    var jpegtran = require('imagemin-jpegtran');
    require('time-grunt')(grunt);
    // Project configuration.
    grunt.initConfig({

        //compile coffee
        coffee: {
            compile: {
                options: {
                    bare: true  // we use requirejs optimization tools.
                },
                expand: true,
                cwd: 'coffee',
                src: ['**/*.coffee'],
                dest: 'assets/js/'
            }
        },

        //TODO requirejs optimization

        // compile scss
        compass: {
            compile: {
                options: {
                    config: 'config.rb'
                }
            }
        },

        // autoprefix css
        autoprefixer:{
            prefix:{
                src:'assets/css/**/*.css'
            }
        },

        // image optimization
        imagemin:{
            compress:{
                options:{
                    use:[optipng(),jpegtran()]
                },
                files:[{
                    expand:true,
                    cwd:'images',
                    src:['**/*.{png,jpg}'],
                    dest:'assets/images'
                }]
            }
        },

        // copy resource to build directory
        copy:{
            core:{
                src:['assets/css/**/*.css','assets/js/**/*.cs','assets/images/**/*.{png,jpeg}','index.html'],
                dest:'build/'
            },
            lib:{
                src:['bower_components/**/*'],
                dest:'build/'
            }
        },

        // watch
        watch:{
            options:{
                livereload:true,
                spawn:false
            },
            coffee:{
                files:'coffee/**/*.coffee',
                tasks:['newer:coffee:compile','newer:copy:core']
            },
            compass:{
                files:'scss/**/*.scss',
                tasks:['compass:compile','newer:autoprefixer','newer:copy:core']  // compass can't use newer plugin
            },
            images:{
                files:'images/*',
                tasks:['newer:imagemin','newer:copy:core']
            },
            interface:{
                files:['index.html'],
                tasks:['newer:copy:core']
            }
        },

        // serve
        connect:{
            serve:{
                options:{
                    base:'build',
                    open:'http://localhost:8000/index.html'
                }
            }
        },

        //clean
        clean:['build','assets']
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('dev',['coffee','compass','autoprefixer','imagemin','copy','connect','watch'])
};
