---
template: post
title: Using MDX With a Brand New Gatsby Lumen Project
slug: mdx-gatsby-lumen
socialImage: /media/image-0.jpg
draft: false
date: 2021-07-08T14:20:25.036Z
description: A guide on how to use MDX with the `gatsby-starter-lumen` project.
category: Web Development
tags:
  - Web Development
---

The `gatsby-starter-lumen` project starter doesn't come with MDX installed and configured. In this guide, I'll take you through on how to set it up.

## 1. Installing the required dependencies

```shell
yarn add gatsby-plugin-mdx @mdx-js/mdx @mdx-js/react
```

## 2. Replace `gatsby-transformer-remark` with `gatsby-plugin-mdx`

Remark and MDX are two different Markdown compilers, so we'll only want to use one of them here. We can still use all of the `gatsby-remark` plugins, so don't worry.

We'll also need to change `plugins` to `gatsbyRemarkPlugins`.

```diff
{
- resolve: `gatsby-transformer-remark`
+ resolve: `gatsby-plugin-mdx`
  options: {
-   plugins: [
+   gatsbyRemarkPlugins: [
```

## 3. Replace Markdown Remark Queries and Values

This is one of the more annoying parts but if you leverage your text editor's Find and Replace capabilities, it shouldn't be too bad.

If you're using VS Code, you can do `Ctrl+Shift+F` to enable Search across all files. Enter in `allMarkdownRemark` and click on the arrow to the left of the text box to Replace the searched text. In case of case sensitive characters, click on the two options (Match Case and Match Whole Word) in the search input. Replace `allMarkdownRemark` with `allMdx`.

```diff
const result = await graphql(
  `
    {
-     allMarkdownRemark(
+     allMdx(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {

...

-const posts = result.data.allMarkdownRemark.nodes
+const posts = result.data.allMdx.nodes
```

In `gatsby/on-create-node.js`, you'll also want to change the node type from `MarkdownRemark` to `Mdx`.

```diff
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
-  if (node.internal.type === `MarkdownRemark`) {
+  if (node.internal.type === `Mdx`) {
```
