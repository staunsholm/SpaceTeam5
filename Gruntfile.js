/**
 * tasks:
 * ------
 * grunt server
 * grunt publish-server
 * grunt publish-client
 *
**/

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {

            // start the multiplayer server
            server: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'nodemon Server/Server.js'
            }
        },
        sftp: {

            // publish server to amazon
            'publish-server': {
                files: {
                    './': ['Server/**', 'package.json']
                },
                options: {
                    path: '/usr/local/projects/SpaceTeam5/',
                    username: 'root',
                    //password: '',
                    privateKey: grunt.file.read("./MikkelStaunsholm.pem"),
                    //passphrase: '',
                    host: 'ec2-54-229-69-55.eu-west-1.compute.amazonaws.com',
                    createDirectories: true,
                    directoryPermissions: parseInt(755, 8)
                }
            }
        },

        // minification
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        ftpscript: {

            // publish client files
            'publish-client': {
                options: {
                    host: 'wsw6.surftown.dk',
                    port: 21,
                    passive: true
                    // , type: 'ascii'
                    // , mkdirs: false
                    // , dryrun: true
                    // , ftpCommand: 'ftp'
                    // , encoding: 'utf-8'
                    // , ftpEncoding: 'utf-8'
                },
                files: [
                    {
                        expand: true,
                        cwd: '.',
                        src: ['Client/**', 'node_modules/smokesignals/smokesignals.min.js'],
                        dest: '/staunsholm/test.staunsholm.dk/SpaceTeam5'
                    }
                ]
            }
        }
    });

    // plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-ftpscript');

    // tasks
    grunt.registerTask('default', []);
    grunt.registerTask('server', ['shell']);
    grunt.registerTask('publish-server', ['sftp']);
    grunt.registerTask('publish-client', ['ftpscript']);
};