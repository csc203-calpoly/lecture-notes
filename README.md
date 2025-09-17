# CSC 203 Lecture notes — Instructions for editing

Hiya! If you're reading this I assume you're teaching CSC 203 and want to update the lecture notes. Here are some instructions for doing so.

## Lightweight edits

If you're just looking to fix typos or clarify small amounts of prose, it's easiest to do this within GitHub itself.

In your fork of the repository, find the chapter you want to edit using GitHub's web interface.
Click the pencil icon in the top-right corner of the file view to edit the file.
Make your changes, then scroll to the bottom of the page and provide a brief description of your changes in the "Commit changes" box.
Choose the option to create a new branch for your changes, then click "Propose changes".
Finally, create a pull request to merge your changes into the main repository.

Done!

## Larger edits

If you want to make bigger edits, or if you want to preview what your changes will look like, you'll need to build the book locally.

First, clone the repository (or your fork of the repository).

Next, download some dependencies.

This book is built using [mdBook](https://rust-lang.github.io/mdBook/).

See the [mdBook installation instructions](https://rust-lang.github.io/mdBook/guide/installation.html) for more details.

You can either download a pre-compiled binary file, or download and build it using the `cargo` package manager.

Downloading the pre-compiled binary _should be_ easier, but on macOS I ran into issues with the OS blocking its execution because it couldn't verify that it was from a trusted developer. YMMV.

So I found it easiest to build from source using `cargo`.

So,

1. **Install Rust and `cargo`. [Instructions from the Rust website](https://doc.rust-lang.org/cargo/getting-started/installation.html):**

```bash
curl https://sh.rustup.rs -sSf | sh
```

2. **Use `cargo` to install `mdbook` and `mdbook-mermaid`:**

`mdbook-mermaid` is a preprocessor used so the book can contain [Mermaid](https://mermaid.js.org/) diagrams (flowcharts, UML diagrams, etc). See the [chapter on Interfaces](src/07_interfaces/index.md) for an example of a Mermaid diagram.

```bash
cargo install mdbook
cargo install mdbook-mermaid
```

3. **Build the book.**

The following commands assume you're in the root directory of the repository.

To serve the book and open it at `http://localhost:3000` in your web browser:

```bash
mdbook serve --open
```

This will also create a `book/` folder, which is ignored by Git.

To build the book and save it to the `docs/` folder (which is _not_ ignored by Git):

```bash
mdbook build -d docs
```

> [!NOTE]
> **Only build to the `docs/` folder if you want your changes when they pushed to the main repository.**
> This `docs/` folder is where GitHub Pages looks for the book to serve it at [https://csc203-calpoly.github.io/lecture-notes/](https://csc203-calpoly.github.io/lecture-notes/).
