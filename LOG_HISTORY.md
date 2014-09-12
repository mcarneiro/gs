#GS - Log History

### 0.5.1
* Fixed class generation for fluid grids;
* Updated `!global` directives;
* Updated compatibility list. **IMPORTANT - This version is not compatible with 3.2 anymore**.

### 0.5.0
* Fixed fracionated numbers
* Applied unit-test for functions
* First defined grid will clear automatically the default grid-list
* `gs-classes()` has option (by default) to box-modelling using float
* `gs-classes()` now generates `row`, `push-prev` and `push-next` classes
* minor fixes regarding registering grids with automatic values

### 0.4.0
* Applied prefix `gs-` on all methods;
* "auto" param on gs-row mixin didn't output css;

### 0.3.2
* `media-query()` mixin by default considers type as `max-width`;

### 0.3.1
* Minor fixes on the documentation;
* `gs-to-number()` now works with `rem`;

### 0.3
* `column()` will write 1 column value by default and now has a "all" wildcard for writing a full-size value;
* changed `$media` to `$grid`;
* `media-query()` mixin now accept "min-width";

### 0.2
* Changes regarding the registration of grids;
* Now it's possible to place a "auto" value for gutter and "site-width" and "column-num";

### 0.1
* First commit;