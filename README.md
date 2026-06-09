# Markdown Docs Reader

This project is a lightweight markdown documentation viewer built for **large, code-heavy doc sets**. It uses Docsify as the rendering base, but the goal is not just to display markdown files in a browser. It is meant to make long-form technical documentation easier to navigate, easier to share at the exact right spot, and easier to copy from when the docs are full of code.

Many markdown viewers are optimized for reading a single document. This one is optimized for reading a **documentation tree**: lots of files, deep navigation, heavy use of relative links, and pages that are revisited as reference material instead of read once from top to bottom.

## Why this exists

Standard markdown viewers usually do the basics well:

- render markdown
- show a sidebar or table of contents
- apply a theme

What they usually do *not* do well is support the workflow of someone moving through engineering docs all day. This reader adds behavior for that workflow:

- keeping navigation in sync with where the reader actually is inside a page
- making deep links useful beyond just the file level
- treating code blocks as reusable working material, not just formatted text
- preserving repository-style document structure instead of forcing docs into a separate publishing model

## Advanced features

| Feature | Why it matters |
| --- | --- |
| Scroll-synced deep links | The URL updates as the reader moves through headings, so a shared link can point to the actual section being read, not just the page. |
| Sidebar state driven by reading position | The active navigation item follows the current section, which makes long pages and nested doc trees easier to stay oriented in. |
| Compact nested navigation | Deeper sidebar levels stay collapsed until they are relevant, reducing noise in dense documentation sets. |
| Segment-level code copy | Code blocks are broken into logical segments so readers can copy just the useful part of an example instead of manually selecting text. |
| Full-snippet copy alongside partial copy | Readers can grab the whole block or a single segment depending on whether they want the complete example or just the command/code they need. |
| Code-first visual treatment | Comments, spacing, and snippet boundaries are surfaced in a way that makes walkthrough-style documentation easier to scan. |
| Repo-friendly relative path handling | The viewer works well with documentation that already lives in a repository and links relatively across folders. |
| Static hosting simplicity | It stays easy to host and preview because it can be served from a basic static web server. |

## Good fit

This viewer is especially useful for:

- internal engineering handbooks
- SDK or platform docs
- architecture and integration guides
- code walkthroughs
- versioned documentation sets

## Development

The [`studio-base`](./studio-base/README.md) folder is an example documentation set for developing and tuning the viewer.

## Run

```bash
python -m http.server 4480
```
