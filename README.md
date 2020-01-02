## Geometric Animations by @liquidx.

I try to regularly work on a few geometric related animations.

## How it's built

It's using p5.js, but also some convoluted code-reuse patterns such as basing everything off some common grid
layout and then using closures to draw a single cell, allowing transforming and customization. It's a bit of a mess at the moment
and as I figure out the best way for me to iterate, I'll continue to mess around.

## ffmpeg

I export to webm using Chrome and then convert to mp4 using ffmpeg. The command is 

```
fmpeg -i animation.webm -crf 10 grids-20190102.mp4
```

## Prior History

This used to be called [liqudx-genart](https://liquidx-genart.glitch.me/), 
but I wanted a new start to get into a better pace.

You can still check out to the old work on [Glitch](https://glitch.com/edit/#!/liquidx-genart).

