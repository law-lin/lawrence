import React, { useRef, useEffect } from 'react';
import styles from './Page.module.scss';
import classnames from 'classnames/bind';

type Props = {
  title?: string,
  subtitle?: string,
  children: React.Node,
};

const cx = classnames.bind(styles);

const Page = ({ title, subtitle, children }: Props) => {
  const pageRef = useRef();

  useEffect(() => {
    pageRef.current.scrollIntoView();
  });

  return (
    <div ref={pageRef} className={styles['page']}>
      <div className={styles['page__inner']}>
        {title && (
          <h1
            className={cx({
              page__title: true,
              'with-subtitle': !!subtitle,
            })}
          >
            {title}
          </h1>
        )}
        {subtitle && <h2 className={styles['page__subtitle']}>{subtitle}</h2>}
        <div className={styles['page__body']}>{children}</div>
      </div>
    </div>
  );
};

export default Page;
