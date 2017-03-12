# Weight Watchers

**DO NOT FORK THIS REPOSITORY OR SUBMIT ANY ISSUES/PULL REQUESTS AS IT WILL BE IGNORED**
The project has ended due to the scope of the project being achieved.

## Contribute

To contribute to the project, you will first need to install [node](https://nodejs.org) globally on your system. Once installation has completed, change the working directory to the application's location and run the following command:

```shell
    npm install
```

After installation of the local modules, you're ready to start contributing to the project. Before you submit your PR, please don't forget to call `gulp`, which will run against [ESlint](http://eslint.org) for any errors, but will also minify the plugin.

##### Watch
Call the following command to start 'watching' for any changes to the main JavaScript file(s). This will automatically invoke ESLint and Uglify.
```shell
    gulp watch
```

##### CSSMin
Call the following command to invoke CSSmin, which will minify the main CSS file(s) and output to a styles.min.css file respectively.
```shell
    gulp cssmin
```

##### ESLint
Call the following command to invoke ESLint and check that the changes meet the requirements set in .eslintrc.
```shell
    gulp eslint
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
