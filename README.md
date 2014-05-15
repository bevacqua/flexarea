# flexarea

> Pretty flexible `<textarea>`s

# Install

Using Bower

```shell
bower install -S flexarea
```

Using `npm`

```shell
npm install -S flexarea
```

# Usage

Just call `flexarea` on your `<textarea>` objects.

```js
var textarea = document.querySelector('textarea');
flexarea(textarea);
```

You'll get a nice little resizer. Remember to include the CSS in your styles!

![flexarea.png][1]

If you want to set a maximum height for your `<textarea>`, you should use the `max-height` CSS property. It'll work just fine!

# License

MIT

  [1]: http://i.imgur.com/ZWpAHu1.png
