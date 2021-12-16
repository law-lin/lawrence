// @flow strict
import React, { useState } from 'react';
import { graphql } from 'gatsby';
import NavHeader from '../components/NavHeader';
import Layout from '../components/Layout';
import Post from '../components/Post';
import { useSiteMetadata } from '../hooks';
import type { Mdx } from '../types';
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';

import { ReactCusdis } from 'react-cusdis';
import { addThemeListener, getTheme } from '../utils/dark-mode';

type Props = {
  data: {
    mdx: Mdx,
  },
};

const PostTemplate = ({ data }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = useSiteMetadata();
  const { frontmatter, id } = data.mdx;
  const {
    title: postTitle,
    description: postDescription = '',
    socialImage,
  } = frontmatter;
  const metaDescription = postDescription || siteSubtitle;
  const socialImageUrl = socialImage?.publicURL;

  const [theme, setTheme] = useState(getTheme());
  // useEffect(() => {
  //   window.addEventListener('storage', (e) => {
  //     console.log(e);
  //     if (e.key === 'preferred-theme') {
  //       console.log(e);
  //     }
  //   });
  //   return () => {
  //     window.removeEventListener('storage');
  //   };
  // }, []);

  deckDeckGoHighlightElement();

  const handleToggle = (theme) => {
    setTheme(theme);
  };

  const cusdisAttr = {
    host: 'https://cusdis.com',
    appId: '800f9f2e-9ff5-46ee-85a7-82f331627e1a',
    pageId: id,
    pageTitle: postTitle,
    pageUrl: `https://lawrencelin.me${data.mdx.fields.slug}`,
    theme,
  };

  return (
    <>
      <NavHeader onToggle={handleToggle} />
      <Layout
        title={`${postTitle} - ${siteTitle}`}
        description={metaDescription}
        socialImage={socialImageUrl}
      >
        <Post post={data.mdx} />
        <h2>Comments</h2>
        <p>Leave a comment below!</p>
        {/* very hacky way of forcing a rerender on cusdis */}
        {theme === 'light' ? (
          <>
            <ReactCusdis attrs={cusdisAttr} />
          </>
        ) : (
          <ReactCusdis attrs={cusdisAttr} />
        )}
      </Layout>
    </>
  );
};

export const query = graphql`
  query PostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      body
      fields {
        slug
        tagSlugs
      }
      frontmatter {
        date
        description
        tags
        title
        socialImage {
          publicURL
        }
      }
    }
  }
`;

export default PostTemplate;
