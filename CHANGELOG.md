# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-06

### Added

- Initial public release of `brat-codex`.
- `brat()` image generation API with Apple style default rendering.
- `bratSticker()` API producing WhatsApp compatible WEBP stickers with EXIF metadata (packname, author, emoji tags).
- `bratVideo()` API producing MP4, GIF, or animated WEBP output via bundled ffmpeg binary.
- `bratVideoSticker()` API producing WhatsApp compatible animated WEBP stickers.
- Full theme system with 14 built in themes plus custom theme support.
- Font engine supporting bundled open license fonts and custom TTF/OTF file paths.
- Emoji engine with pluggable provider naming and automatic fallback.
- Auto font scaling text engine with wrapping, alignment, line spacing, and RTL detection.
- CommonJS, ESM, and TypeScript declaration entry points.
- Postinstall asset fetcher for fonts and emoji sprites from open license sources.
