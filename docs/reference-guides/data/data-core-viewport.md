# The Viewport Data

Namespace: `core/viewport`.

## Selectors

<!-- START TOKEN(Autogenerated selectors|../../../../packages/viewport/src/store/selectors.js) -->

<a name="isViewportMatch" href="#isViewportMatch">#</a> **isViewportMatch**

Returns true if the viewport matches the given query, or false otherwise.

_Usage_

```js
isViewportMatch( state, '< huge' );
isViewPortMatch( state, 'medium' );
```

_Parameters_

-   _state_ `Object`: Viewport state object.
-   _query_ `string`: Query string. Includes operator and breakpoint name, space separated. Operator defaults to >=.

_Returns_

-   `boolean`: Whether viewport matches query.

<!-- END TOKEN(Autogenerated selectors|../../../../packages/viewport/src/store/selectors.js) -->

## Actions

<!-- START TOKEN(Autogenerated actions|../../../../packages/viewport/src/store/actions.js) -->

<a name="setIsMatching" href="#setIsMatching">#</a> **setIsMatching**

Returns an action object used in signalling that viewport queries have been
updated. Values are specified as an object of breakpoint query keys where
value represents whether query matches.

_Parameters_

-   _values_ `Object`: Breakpoint query matches.

_Returns_

-   `Object`: Action object.

<!-- END TOKEN(Autogenerated actions|../../../../packages/viewport/src/store/actions.js) -->
