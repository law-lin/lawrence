// @flow
import { graphql } from 'gatsby';
import React from 'react';
import moment from 'moment';
import styles from './ContentDate.module.scss';

type Props = {|
  +dateFormatted: string,
  +dateModifiedFormatted: ?string,
|};

const formatDate = (date) => moment(date).format('MMMM D, YYYY');

const ContentDate = ({ dateFormatted, dateModifiedFormatted }: Props) => (
  <p className={styles['content-date']}>
    <time>{formatDate(dateFormatted)}</time>
    {/* {dateModifiedFormatted && (
      <span className={styles['date-modified']}>
        &ensp;|&ensp;UPDATED <time>{dateModifiedFormatted}</time>
      </span>
    )} */}
  </p>
);

export const fragment = graphql`
  fragment ContentDateFragment on MarkdownRemarkFields {
    dateFormatted
  }
`;

export default ContentDate;
