// src/pages/Home.jsx
import React from 'react';
import Card from '../components/Card';
import KanbanBoard from '../components/KanbanBoard';

const Home = () => (
    <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-sm space-y-4">
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
  </div>
);

export default Home;
