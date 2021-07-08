// @flow strict
import React from 'react';
import styles from './Content.module.scss';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import ContentDate from '../ContentDate';

type Props = {
  body: string,
  title: string,
  date: Date,
};

const Content = ({ body, title, date }: Props) => (
  <div className={styles['content']}>
    <h1 className={styles['content__title']}>{title}</h1>
    <div className={styles['content__date']}>
      <ContentDate dateFormatted={date} dateModifiedFormatted={date} />
    </div>
    <div className={styles['content__body']}>
      <MDXRenderer>{body}</MDXRenderer>
    </div>
  </div>
);

export default Content;
