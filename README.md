#GS - Semantic Grid System v0.5
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
        $width: 974px,
        $column-num: 12,
        $gutter: 10px);

It'll generate a grid with 12 columns of 72px each and 10px of gutter.

If your implementation is based on column width, the following implementation is accepted as well:

    @include gs-register-grid(
        $label: "site-wide",
        $width: auto,
        $column-num: 12,
        $gutter: 10px,
        $column: 90px);

It'll generate a grid of 1190px with 12 columns and 10px of gutter.

You can add many grids as you find necessary (specially when lay-outs doesn't match the main grid).

### Using grids

There are some functions and mixins available for applying the grids:

#### gs-column function

    @function gs-column($n:1, $grid:FIRST_REGISTERED_GRID, $extra:0)

This function receives the number of columns, grid and an extra value, if necessary. The box-model technique stays with the developer: If you prefer a `float` for some situation, `inline-block`, `table-cell`, etc:

    .my-class {
        width: gs-column(all); // will write full-size value for the first registered grid
    }
    .nav-holver {
        float: left;
        width: gs-column(); // will write the value of 1 column for the first registered grid
    }
    .content-holder {
        overflow: hidden;
    }

Extra values can be applied to the column as the 3rd parameter:

    width: gs-column(1, site-normal, 20px); // will write 1 column + 20px

Extra values just work for fixed-sized columns, fluid columns ignore this parameter.

A fractionated value can be passed to `gs-column`. Something like:

    width: gs-column(1 + 1/3, site-normal); // will get 1 column + gutter + 1/3

Obviously, the example above should be used when the columns of defined on the grid are divisible by 3.

#### gs-gutter function

    @function gs-gutter($n:1, $grid:FIRST_REGISTERED_GRID)

This function receives the number of "gutters" (gutter * n) and the grid value:

    .nav-holver {
        float: left;
        width: gs-column();
        margin-right: gs-gutter(); // you can use gutter whetever is better for you, as margin, padding, etc.
    }
    .content-holder {
        overflow: hidden;
    }

#### gs-row mixin

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
        @include gs-row($grid: "site-normal");
        li {
            width: gs-column(1, "site-normal");
            margin-left: gs-gutter(1, "site-normal");
            display: inline-block;
            vertical-align: middle;
        }
    }

**Important!** If you ommit the `$grid` parameter, the first registered gridsystem will be used.

#### gs-media-query mixin

    @mixin gs-media-query($label:FIRST_REGISTERED_GRID, $grid:screen, $type:"max-width")

This mixin can be used if you use sass media-query (inside the same css). It's just a simple wrapper just to place the media-query based on the registered data:

    .some-list {
        @include gs-row();
        li {
            width: gs-column();
            margin-left: gs-gutter();
            display: inline-block;
            vertical-align: middle;
        }
        @include gs-media-query("site-normal") {
            @include gs-row($grid: "site-normal");
            li {
                width: gs-column(1, "site-normal");
                margin-left: gs-gutter(1, "site-normal");
            }
        }
    }

Note that the `$grid` parameter must be used on all calls. That's a SASS limitation regarding scopes. Also, remember that `@extend` can't be used inside media-queries calls.

#### gs-classes mixin for non-semantic implementation

    @mixin gs-classes($grid, $prefix, $push:true, $float:true)

This mixin will generate classes based on `$grid` and will apply the `$prefix` as prefix of the classname:

    @include gs-classes(site-normal, sn-);
    
    // will generate .sn-col-1, .sn-col-2 ... .sn-col-12;
    // will generate .sn-push-next-1, .sn-push-next-2 ... .sn-push-next-12;
    // will generate .sn-push-prev-1, .sn-push-prev-2 ... .sn-push-prev-12;
    // will generate .sn-row;

This can be useful for server-dise dynamic class definition or forms, for example. By default they will consider a float-based box modelling. It's possible to ignore it by setting `$float:false`. The same with `push-next` or `push-prev` variations. If it's not needed for the implementation, just set `$push:false`.

#### gs-clear-grid-list mixin

    @mixin gs-clear-grid-list();

Used to remove all registered grids.

## Roadmap

* Create installer;
* Better row mixin;

## Log history

[Check LOG_HISTORY.md file](LOG_HISTORY.md).