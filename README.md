# Hover Box (A JavaScript package)

A simple package to reveal some extra information on hover

### Links

-   [Options](#options)
-   [Change log](./CHANGELOG.md)
-   [License (MIT)](./LICENSE)

## Usage

Add the below to your code to your project and you're away

_Note:_ by default, we're listening upon construction

```TS
const hb = new HoverBox(".HoverBox");
const hbWithOptions = new HoverBox(".HoverBox", options); // if you have options

// Inside some other functions somewhere
hb.startListening();
hb.stopListening();
```

## Options

### setMy?: [`alignment`][alignment]

The part of the popup linked to `at`  
**Default:** `top center`

### at?: [`alignment`][alignment]

The part of the anchor `setMy` will "attach" to  
**Default:** `bottom center`

### keepOpen?: `boolean`

If the mouse moves into the popup, keep the pop-up open  
**Default:** `true`

### allowHtml?: `boolean`

The text provided can be treated as safe HTML  
**Default:** `false`

### transitionDelay?: `number`

The delay before we start the transition (in milliseconds)  
**Default:** `333`

### transitionDuration?: `number`

A link to the transition duration (in milliseconds). This must match the CSS transition property or the element  
**Default:** `333`

### collision?: [`CollisionHandler`](#the-collisionhandler-type)

How to handle the popup colliding with the window edge  
**Default:** `bestfit`  
**Note:** This is just passed straight to the underlying [Position](https://github.com/TopMarksDevelopment/JavaScript.Position) module

### bestFitPreference?: `horizontal` OR `vertical`

The preferred direction to try `bestfit` first  
**Default:** `horizontal`  
**Note:** This is just passed straight to the underlying [Position](https://github.com/TopMarksDevelopment/JavaScript.Position) module

### defaults?: `{ my: `[`alignment`][alignment]`, at: `[`alignment`][alignment]` }`

The fallback values when only one property is supplied, or the property supplied is invalid  
**Default:** Same as `setMy` & `at` respectively  
**Note:** This is just passed straight to the underlying [Position](https://github.com/TopMarksDevelopment/JavaScript.Position) module

## Types

### The `Alignment` type

The `Alignment` will allow any of the below, plus a combination in the form `vertical horizontal` (e.g. `top center`, `bottom right` or `center left`)

-   `top`
-   `bottom`
-   `center`
-   `left`
-   `right`

Using a single value will default the other to `center` so `left` == `center left`

### The `CollisionHandler` type

How to handle any collisions, either:

-   `bestFit`: find the best fit before trying to flip the element
-   `flipFit`: flip the element completely vertically and horizontally
-   `ignore`: ignore any collisions and just carry on

[alignment]: #the-alignment-type
