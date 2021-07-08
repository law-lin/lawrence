// @flow strict
import React from 'react';
import { withPrefix, Link } from 'gatsby';
import styles from './Author.module.scss';
import DarkModeToggle from '../../DarkModeToggle';

type Props = {
  author: {
    name: string,
    bio: string,
    photo: string,
  },
  isIndex: ?boolean,
};

const Author = ({ author, isIndex }: Props) => (
  <div className={styles['author']}>
    <Link to='/'>
      <img
        src={withPrefix(author.photo)}
        className={styles['author__photo']}
        width='75'
        height='75'
        alt={author.name}
      />
    </Link>

    {isIndex === true ? (
      <h1 className={styles['author__title']}>
        <Link className={styles['author__title-link']} to='/'>
          {author.name}
        </Link>
        <DarkModeToggle />
      </h1>
    ) : (
      <h2 className={styles['author__title']}>
        <Link className={styles['author__title-link']} to='/'>
          {author.name}
        </Link>
        <DarkModeToggle />
      </h2>
    )}
    <p className={styles['author__subtitle']}>{author.bio}</p>
  </div>
);

export default Author;
