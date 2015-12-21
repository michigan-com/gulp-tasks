# Gulp tasks

Moudlarized gulp tasks which makes for a cleaner root gulpfile

Inspired by [this Medium post](https://medium.com/@_rywar/spreading-gulp-tasks-into-multiple-files-2f63d8c959d5)

# Expected file structure
These gulp tasks expect the following file structure in order to work properly
```
.
  /src
      /client // Client-side JS, will be compiled to ./public/js
      /server // Server-side JS, will be compiled to ./dist
      /css   // CSS files, will be compiled to ./public/css
  /dist // Holds compiled serverside code from ./src/server
  /public // Holds public JS/CSS, compiled from ./src/client and ./src/css
```
# Tasks

## [`./build`](https://github.com/michigan-com/gulp-tasks/tree/master/build)
Contains tasks that build files (JS, stylesheets, etc)
