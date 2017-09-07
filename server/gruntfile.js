module.exports = function (grunt) {
    'use strict';

    let outDir = 'dist';
    let buildTasks = ['newer:tslint', 'clean', 'concurrent:build'];

    grunt.initConfig({
        watch: {
            ts: {
                files: 'src/**/*.ts',
                tasks: buildTasks
            },
            packageJSON: {
                files: 'package.json',
                tasks: ['shell:installNPMPackages', 'build']
            }
        },
        shell: {
            installNPMPackages: {
                command: "npm install"
            }
        },
        ts: {
            default: {
                tsconfig: true
            }
        },
        tslint: {
            options: {
                configuration: 'tslint.json',
                typeCheck: true
            },
            files: {
                src: ['src/**/*.ts', '!src/sdk/**']
            }
        },
        clean: ['./' + outDir],
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            run: ['nodemon:dev'],
            // run: ['nodemon', 'watch'],
            build: ['ts']
        },
        nodemon: {
            dev: {
                script: outDir + '/app.js',
                watch: [outDir],
                delay: 2000,
                ext: 'js',
                legacyWatch: true,
                options: {
                    env: {
                        PORT: 8080,
                        HOST: "0.0.0.0",
                        NODE_ENV: 'development'
                    }
                }
            },
            production: {
                script: outDir + '/app.js',
                watch: [outDir],
                delay: 2000,
                ext: 'js',
                legacyWatch: true,
                options: {
                    env: {
                        PORT: 8080,
                        HOST: "0.0.0.0",
                        NODE_ENV: 'production'
                    }
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', buildTasks);
    grunt.registerTask('default', ['build', 'concurrent:run']);
};