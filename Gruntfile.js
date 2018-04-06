module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/trader.css': 'scss/trader.scss' 
                }
            }
        },
        concat: {
            options: {
                sourceMap: true,
              },
              dist: {
                src: ['js/*.js'],
                dest: 'dist/js/trader.js',
              },
          },
        // 检测改变，自动跑sass任务
        watch: {
            scripts: {
                files: ['scss/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('scss-css', ['sass:dist']);
    grunt.registerTask('js', ['concat:dist']);
    grunt.registerTask('default', ['sass:dist', 'watch:scripts']);
};