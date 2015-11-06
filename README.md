# Weight Watchers

**DO NOT FORK THIS REPOSITORY OR SUBMIT ANY ISSUES/PULL REQUESTS AS IT WILL BE BE IGNORED**

## Contribute

To contribute to the project, you will first need to install [gulp](http://gulpjs.com) globally on your system. Once installation has completed, change the working directory to the application's location and run the following command:

```shell
    npm install
```

After installation of the local modules, you're ready to start contributing to the project. Before you submit your PR, please don't forget to call `gulp build`, which will run against [JSHint](http://jshint.com) for any errors, but will also minify the application's CSS and JavaScript file(s).

##### Watch
Call the following command to start 'watching' for any changes to the main CSS and JavaScript file(s). This will automatically invoke CSSMin, JSHint and Uglify.
```shell
    gulp watch
```

##### CSSMin
Call the following command to invoke CSSmin, which will minify the main CSS file(s) and output to a styles.min.css file respectively.
```shell
    gulp cssmin
```

##### JSHint
Call the following command to invoke JSHint and check that the changes meet the requirements set in .jshintrc.
```shell
    gulp jshint
```

##### JSPrettify
Call the following command to invoke JSPrettify and tidy the main JavaScript file(s) based on the options set in .jsbeautifyrc.
```shell
    gulp prettify-js
```

##### Uglify
Call the following command to invoke Uglify, which will minify the main JavaScript file(s) and output to a scripts.min.js file respectively.
```shell
    gulp uglify
```

##### Build
Call the following command to invoke all tasks except for `gulp vendor`.
```shell
    gulp build
```

#### Bower

3rd party vendor packages are managed via the use of [Bower](http://bower.io), a JavaScript dependency package manager. Therefore, once you've followed the the instructions online of how to install [Bower](http://bower.io), then simply afterwards run the following command:

```shell
    bower install
```
