// src/pages/Home.jsx
import React from 'react';
import KanbanBoard from '../components/KanbanBoard';

const Home = () => (
    
  <div className="overflow-x-auto ">
      {/* <Card 
        id={20} 
        title="fmxsdgmgf" 
        assigned={false}
      />
      
      <Card 
        id={11} 
        title="hjukm" 
        assigned={false}
      />
      
      <Card 
        id={15} 
        title="Update API endpoints" 
        assigned={true}
        assignedTo="John Doe"
      /> */}
      <KanbanBoard></KanbanBoard>
    </div>
);

export default Home;
