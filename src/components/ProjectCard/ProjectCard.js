import React from 'react';

import styles from './ProjectCard.module.scss';

const ProjectCard = ({
  className,
  href,
  thumbnail,
  title,
  description,
  tags,
  ...other
}) => {
  return (
    <div style={{ height: '100%' }}>
      <a
        className={styles['card-link']}
        href={href}
        target='_blank'
        rel='noreferrer'
      >
        <div className={styles['project-card']}>
          <div className={styles['card-overlay']}>
            <div
              className={styles['overlay']}
              style={{
                backgroundImage: `url(${thumbnail})`,
              }}
            />
          </div>
          <div className={styles['card-content']}>
            <div className={styles['thumbnail']}>
              <img
                src={thumbnail}
                alt={title}
                // style={{ width: 50, height: 50 }}
              />
            </div>

            <div className={styles['text']}>
              <div className={styles['title']}>{title}</div>
              <div className={styles['description']}>{description}</div>
              <div className={styles['tags']}>
                {tags &&
                  tags.map((tag, i) => {
                    return (
                      <span className={styles['tag']}>
                        {typeof tag === 'function' ? tag() : tag}
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProjectCard;
