# Homepage Videos

Set these environment variables to show YouTube videos on the homepage:

- `NEXT_PUBLIC_GROWTH_PLATFORM_VIDEO_URL`
- `NEXT_PUBLIC_AIMEDIA_STUDIO_VIDEO_URL`

If these are not set, add these files to this folder so videos render using local MP4 files:

- `growth-platform.mp4`
- `aimedia-studio.mp4`

These are used by `src/components/home/HomePageContent.tsx` in the Platform Videos section.
