# Hover Box (A JavaScript package)

A simple package to reveal some extra information on hover

### Links
- [Change log](./CHANGELOG.md)
- [License (MIT)](./LICENSE)

## Usage

Add the below to your code to your project and you're away

```TS
const hb = new HoverBox(".HoverBox");
const hbWithOptions = new HoverBox(".HoverBox", options); // if you have options

// Inside some other functions somewhere
hb.startListening();
hb.stopListening();
```

## Options

Option | Type | Default | Description
---|---|---|---
setMy? | [Type: pA][PositionAlignment] | `top center` | The part of the popup linked the anchor
at? | [Type: pA][PositionAlignment] | `bottom center` | The part of the anchor that the target should link to
keepOpen? | boolean | `true` | If the mouse moves into the popup, keep it open
allowHtml? | boolean | `false` | The text provided can be treated as safe HTML
transitionDelay? | number | `333` | The delay before we start the transition
transitionDuration? | number | `333` | Must match the CSS transition property
**HoverPosition specific**
collision? | [PositionCollision](#type-positioncollision) | `bestfit` | How to handle the popup colliding with the window edge
bestFitPreference? | `horizontal` OR `vertical` | `horizontal` | The preferred direction to try `bestfit` first
defaults? | { my: [pA][PositionAlignment]; at: [pA][PositionAlignment]; } | Same as `setMy` & `at` respectively | Defaults to use if parsing of `setMy` or `at` fails

### Type: `PositionAlignment`

Where to position an element. Use either: `top`, `bottom`, `center`, `left` or `right`. You can also specify a vertical and horizontal alignment like `top right`, `bottom right` or `center left`.


Using a single value will default the other to `center` so `left` == `center left`

### Type: `PositionCollision`

How to handle any collisions, either:

- `bestFit`: find the best fit before trying to flip the element
- `flipFit`: flip the element completely vertically and horizontally
- `ignore`: ignore any collisions and just carry on


[PositionAlignment]: #type-positionalignment