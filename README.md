#GS - Semantic Grid System v0.4
Flexible and easy-to-use gridsystem for SASS.

## About this project
GS is a simple and flexible css grid-system that runs over SASS. It only does calculations around grid-systems and leave the box-modeling techniques to the developer.

## How to use

The idea of this gridsystem is to give the necessary flexibility to the developer. There's basically 2 steps using GS:

### Registering grids

Each grid has a label a total width, column numbers, gutter, break point (for responsive implementations) and column width. Not all parameters are required:

    @include gs-register-grid($label, $width, $column-num, $gutter, $break-point:auto, $column:null);

By default, `$column` is calculated automatically based on `$width`, `$column-num` and `$gutter`. So, by doing this:

    @include gs-register-grid(
        $label: "site-normal",
        $width: 930px,
        $column-num: 10,
        $gutter: 10px);

It'll generate a grid with 10 columns of 84px each and 10px of gutter.

If your implementation is based on column width, the following implementation is accepted as well:

    @include gs-register-grid(
        $label: "site-wide",
        $width: 1306px,
        $column-num: auto,
        $gutter: auto,
        $column: 178px);

It'll generate a grid with 7 columns of 178px and 10px of gutter.

Or even place column and gutter only and have the width calculated:

    @include gs-register-grid(
        $label: "site-wide",
        $width: auto,
        $column-num: 7,
        $gutter: 10px,
        $column: 178px);

You can add many grids as you find necessary (specially when lay-outs doesn't match the main grid).

### Using grids

There are some functions and mixins available for applying the grids:

#### column function

    @function gs-column($n:1, $grid:FIRST_REGISTERED_GRID, $extra:0)

This function receives the number of columns, grid and an extra value, if necessary. The box-model technique stays with the developer: If you prefer a `float` for some situation, `inline-block`, `table-cell`, etc:

    .my-class {
        width: gs-column(all); // will write full-size value for the first registered grid
    }
    .nav-holver {
        float: left;
        width: gs-column(); // will write the value of 1 column for the first registered grid
        margin-right: gs-gutter(); // check the next topic about gs-gutter()
    }
    .content-holder {
        overflow: hidden;
    }

#### gutter function

    @function gs-gutter($n:1, $grid:FIRST_REGISTERED_GRID)

This function receives the number of "gutters" (gutter * n) and the grid value:

    .nav-holver {
        float: left;
        width: gs-column();
    }
    .content-holder {
        overflow: hidden;
        padding-left: gs-gutter(); // you can use gutter whetever is better for you
    }

#### row mixin

    @mixin gs-row($width:auto, $grid:FIRST_REGISTERED_GRID)

This mixin is usually used on lists. It can receive a `width` and `grid` label:

    .some-list {
        @include gs-row(); // will apply a negative margin-left with gutter value;
        li {
            width: gs-column();
            margin-left: gs-gutter();
            display: inline-block;
            vertical-align: middle;
        }
    }

#### Defining the current grid

All functions has a `$grid` parameter that is related to the label defined when registering a grid. Based on the last example, there's how to use another grid units for the implementation:

    @include gs-register-grid(
        $label: "site-normal",
        $width: 930px,
        $column-num: 10,
        $gutter: 10px);

    .some-list {
        @include gs-row($grid: site-normal);
        li {
            width: gs-column(1, $grid: site-normal);
            margin-left: gs-gutter($grid: site-normal);
            display: inline-block;
            vertical-align: middle;
        }
    }

**Important!** If you ommit the `$grid` parameter, the first registered gridsystem will be used.

#### media-query mixin

    @mixin gs-media-query($label:FIRST_REGISTERED_GRID, $grid:screen, $type:max-width)

This mixin can be used if you use sass media-query (inside the same css). It's just a simple wrapper just to place the media-query based on the registered data:

    .some-list {
        @include gs-row();
        li {
            width: gs-column();
            margin-left: gs-gutter();
            display: inline-block;
            vertical-align: middle;
        }
        @include gs-media-query($grid: site-normal) {
            @include gs-row($grid: site-normal);
            li {
                width: gs-column($grid: site-normal);
                margin-left: gs-gutter($grid: site-normal);
            }
        }
    }

Note that the $grid parameter must be used on all calls. That's a SASS limitation regarding scopes. Also, remember that @extend can't be used inside media-queries calls.

#### media-query mixin

## Roadmap

* Create Example page;
* Create better verification regarding the "auto" value when registering;
* Organize folders and files;
* Create installer;
* Create test proccess;

## Log history

[Check LOG_HISTORY.md file](LOG_HISTORY.md).