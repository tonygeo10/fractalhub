Optimizing hero video and poster

Use these ffmpeg commands locally to generate an optimized WebM and a poster image from your MP4 source.

1) Create a high-quality, compressed WebM (VP9):

```
ffmpeg -i videos/background.mp4 -c:v libvpx-vp9 -b:v 0 -crf 33 -pix_fmt yuv420p -preset medium -an videos/background.webm
```

- `-crf` controls quality (lower = better). Start with 33 and adjust.
- `-b:v 0` tells libvpx-vp9 to use constant quality mode.
- `-an` removes audio track to reduce file size.

2) Create a smaller fast WebM (VP8) for compatibility/size tradeoffs:

```
ffmpeg -i videos/background.mp4 -c:v libvpx -b:v 1M -qmin 10 -qmax 42 -crf 35 -an videos/background_vp8.webm
```

3) Generate a poster image (WebP) from a single frame:

```
ffmpeg -ss 00:00:01 -i videos/background.mp4 -vframes 1 -vf "scale=1600:-2,format=webp" -quality 80 images/nikos-poster.webp
```

4) Create a very small preview (blurred) image for LCP placeholder:

```
ffmpeg -ss 00:00:01 -i videos/background.mp4 -vframes 1 -vf "scale=600:-2,boxblur=10:1,format=webp" -quality 50 images/nikos-preview.webp
```

After generating files:
- Put `videos/background.webm` and the poster(s) in the repo (we added preload tags for `videos/background.webm` and `images/nikos.webp`).
- Consider using a CDN and setting long cache headers for the video and poster.
- Re-run Lighthouse to verify LCP and bandwidth improvements.

Notes
- If you prefer AV1, use `libaom-av1` or `svt-av1`, but encoding is slower.
- For automated pipelines, add these ffmpeg commands to your build script.
