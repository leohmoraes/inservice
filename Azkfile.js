/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */
// Adds the systems that shape your system
systems({
  'inservice': {
    // Dependent systems
    depends: ['mysql57'],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/php-fpm:5.6"},
    provision: [
      "composer install"
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    // command: "# command to run app",
    wait: 20,
    mounts: {
      '/azk/#{manifest.dir}': sync("."),
      '/azk/#{manifest.dir}/vendor': persistent("./vendor"),
      '/azk/#{manifest.dir}/composer.phar': persistent("./composer.phar"),
      '/azk/#{manifest.dir}/composer.lock': path("./composer.lock"),
      '/azk/#{manifest.dir}/.env.php': path("./.env.php"),
      '/azk/#{manifest.dir}/.env': path("./.env"),
      '/azk/#{manifest.dir}/bootstrap/compiled.php': path("./bootstrap/compiled.php"),
      '/azk/#{manifest.dir}/node_modules': persistent("./node_modules"),
    },
    scalable: {"default": 1},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      http: "80/tcp",
    },
    envs: {
      // set instances variables
      APP_DIR: "/azk/#{manifest.dir}",
    },
  },
  mysql57: {
    // more info about mysql image: http://images.azk.io/#/mysql?from=docs-full_example
    //docker run --name mysql-server -d -p 3306:3306 azukiapp/mysql:5.7
    image: {"docker": "azukiapp/mysql:5.7"},
    shell: "/bin/bash",
    wait: 25,
    mounts: {
      '/var/lib/mysql': persistent("mysql_data"),
      // to clean mysql data, run:
      // $ azk shell mysql -c "rm -rf /var/lib/mysql/*"
    },
    ports: {
      // exports global variables: "#{net.port.data}"
      data: "3306:3306/tcp",
    },
    envs: {
      // SET INSTANCES VARIABLES
      MYSQL_USER         : "azk",
      MYSQL_PASSWORD     : "azk",
      MYSQL_DATABASE     : "#{system.name}_dev", //inservice_dev
      MYSQL_ROOT_PASSWORD: "azk",
      //    PMA_URI: "#{system.name}.#{azk.default_domain}",

      //my-secret-pw
    },
    export_envs: {
      MYSQL_USER    : "#{envs.MYSQL_USER}",
      MYSQL_PASSWORD: "#{envs.MYSQL_PASSWORD}",
      MYSQL_HOST    : "#{net.host}",
      MYSQL_PORT    : "#{net.port.data}",
      MYSQL_DATABASE: "#{envs.MYSQL_DATABASE}"

      //phpmyadmin DATABASE_URL: "mysql2://#{envs.MYSQL_USER}:#{envs.MYSQL_PASSWORD}@#{net.host}:#{net.port.data}/#{envs.MYSQL_DATABASE}",
    },
  },
});
