import React from 'react';
import ProjectCard from '../ProjectCard';
import styles from './ProjectCardGrid.module.scss';

const ProjectCardGrid = () => {
  return (
    <div className={styles['project-card-grid']}>
      <ProjectCard
        href='https://apps.apple.com/us/app/onecase-social-accountability/id1604737461/'
        thumbnail={'/media/onecase-mobile.png'}
        title='OneCase: Social Accountability'
        description='Hold your friends accountable!'
        tags={['TS', 'React Native', 'Node.js', 'PostgreSQL', 'Supabase']}
      />
      <ProjectCard
        href='https://apps.apple.com/us/app/spark-redefined-friendmaking/id1579999380'
        thumbnail='/media/spark.PNG'
        title='Spark'
        description='Redefined Friendmaking'
        tags={['TS', 'React Native', 'Node.js', 'Firebase']}
      />
      <ProjectCard
        href='https://github.com/law-lin/onecase-v2'
        thumbnail='/media/onecase.png'
        title='OneCase'
        description='Productive journaling with friends'
        tags={['TS', 'React', 'Node.js', 'PostgreSQL', 'GraphQL', 'AWS']}
      />
      <ProjectCard
        href='https://usecamo.app'
        thumbnail={'/media/camo.PNG'}
        title='Camo'
        description='Connect with like-minded students anonymously'
        tags={['JS', 'React Native', 'Node.js', 'Firebase']}
      />
      <ProjectCard
        href='http://theshowcase.app/lawlin'
        thumbnail={'/media/showcase.png'}
        title='Showcase'
        description='Showcase your interests, passions, and projects'
        tags={['JS', 'React', 'Node.js', 'Firebase']}
      />
      <ProjectCard
        href='https://www.youtube.com/watch?v=Aht3wotrrBk&list=PLyCRt3MN8s8OJp-M5UdCQv-NDllAqJOb5&index=4'
        thumbnail={'/media/steam-game-popularity.png'}
        title='Steam Game Popularity Dashboard'
        description='Visualize and analyze the popularity of Steam games over time'
        tags={['JS', 'React.js', 'd3.js', 'Python Flask']}
      />
      <ProjectCard
        href='https://speaclear.online'
        thumbnail={'/media/speaclear.PNG'}
        title='Speaclear'
        description='Improve public speaking by identifying filler word usage'
        tags={['JavaScript', 'React']}
      />
      <ProjectCard
        href='http://minutemoji.online/'
        thumbnail={'/media/emoji-of-the-minute.png'}
        title='Emoji of the Minute'
        description='Vote for the emoji of the minute!'
        tags={['JS', 'React', 'Node.js', 'Firebase']}
      />
    </div>
  );
};

export default ProjectCardGrid;
