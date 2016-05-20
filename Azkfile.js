/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */
// Adds the systems that shape your system
systems({
  'inservice': {
    // Dependent systems
    depends: [],
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
});
