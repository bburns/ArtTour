// See http://brunch.io for documentation.
module.exports = {
    paths: {
        watched: [
            'src',
            // see https://github.com/brunch/brunch-guide/blob/master/content/en/chapter05-using-third-party-registries.md
            'node_modules/react-select/dist/react-select.css',
            // 'node_modules/bootstrap/dist/css/bootstrap.css',
            //. we need this, but adding it to vendor.js breaks it, and the tab control doesn't work properly
            // so added requirements to index.html for now
            // 'node_modules/bootstrap/dist/js/bootstrap.js',
            // slow, bombs out - isNpmJSON is not a function
            // 'node_modules'
        ]
    },
    files: {
        javascripts: {
            joinTo: {
                'js/vendor.js': /^node_modules/,
                'js/app.js': /^(src)/
            }
        },
        stylesheets: {
            joinTo: {
                'css/vendor.css': /^node_modules/,
                'css/app.css': /^src/
            }
        }
    },
    plugins: {
        babel: {presets: ['es2015', 'react']}
    }
};
