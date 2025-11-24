import React, { useState } from 'react';

const KanbanBoard = () => {
  const [stories, setStories] = useState([
    { 
      id: 1, 
      name: 'add traduction to web model',
      tag: 'N/E',
      status: 'NEW',
      subtasks: [
        { id: 3, name: 'qcqscsqc', status: 'NEW', assigned: false },
        { id: 2, name: 'dddddd', status: 'NEW', assigned: false },
        { id: 4, name: 'zxzxzxz', status: 'NEW', assigned: false }
      ], 
      expanded: true 
    },
    { 
      id: 9, 
      name: 'test2',
      tag: 'N/E',
      status: 'NEW',
      subtasks: [
        { id: 5, name: 'zxéxzé', status: 'NEW', assigned: false },
        { id: 6, name: 'kader', status: 'NEW', assigned: false }
      ], 
      expanded: true 
    }
  ]);

  const [tasks, setTasks] = useState([
    { id: 7, name: 'ecezcezce', status: 'NEW', assigned: false },
    { id: 7, name: 'ecezcezce', status: 'NEW', assigned: false }
  ]);

  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { name: 'NEW', key: 'NEW' },
    { name: 'IN PROGRESS', key: 'IN PROGRESS' },
    { name: 'READY FOR TEST', key: 'READY FOR TEST' },
    { name: 'CLOSED', key: 'CLOSED' },
    { name: 'NEEDS INFO', key: 'NEEDS INFO' }
  ];

  const getTasksForStoryInColumn = (storyId, columnKey) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return [];
    return story.subtasks.filter(task => task.status === columnKey);
  };

  const getStorylessTasksInColumn = (columnKey) => {
    return tasks.filter(task => task.status === columnKey);
  };

  const handleDragStart = (e, task, storyId) => {
    setDraggedTask({ ...task, storyId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus, targetStoryId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedTask) return;

    const sourceStoryId = draggedTask.storyId;

    // If moving to the same story, just update status
    if (sourceStoryId === targetStoryId) {
      if (sourceStoryId !== null) {
        setStories(prev => prev.map(story => {
          if (story.id === sourceStoryId) {
            return {
              ...story,
              subtasks: story.subtasks.map(task => 
                task.id === draggedTask.id 
                  ? { ...task, status: newStatus }
                  : task
              )
            };
          }
          return story;
        }));
      } else {
        setTasks(prev => prev.map(task =>
          task.id === draggedTask.id
            ? { ...task, status: newStatus }
            : task
        ));
      }
    } else {
      // Moving between stories or to/from storyless
      const taskToMove = { ...draggedTask, status: newStatus };
      delete taskToMove.storyId;

      // Remove from source
      if (sourceStoryId !== null) {
        setStories(prev => prev.map(story => {
          if (story.id === sourceStoryId) {
            return {
              ...story,
              subtasks: story.subtasks.filter(task => task.id !== draggedTask.id)
            };
          }
          return story;
        }));
      } else {
        setTasks(prev => prev.filter(task => task.id !== draggedTask.id));
      }

      // Add to target
      if (targetStoryId !== null) {
        setStories(prev => prev.map(story => {
          if (story.id === targetStoryId) {
            return {
              ...story,
              subtasks: [...story.subtasks, taskToMove]
            };
          }
          return story;
        }));
      } else {
        setTasks(prev => [...prev, taskToMove]);
      }
    }

    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const toggleStory = (storyId) => {
    setStories(prev => prev.map(story =>
      story.id === storyId ? { ...story, expanded: !story.expanded } : story
    ));
  };

  const renderTaskCard = (task, storyId) => (
    <div 
      key={task.id}
      className={`task-card ${draggedTask?.id === task.id ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task, storyId)}
      onDragEnd={handleDragEnd}
    >
      <div className="task-header">
        <h3 className="task-title">
          <span className="task-id">#{task.id}</span> {task.name}
        </h3>
        <button className="task-menu">⋮</button>
      </div>
      <div className="task-assignment">
        <div className="avatar">
          <div className="avatar-placeholder"></div>
        </div>
        <span className="assignment-text">Not assigned</span>
      </div>
    </div>
    
  );

  return (
    <div className="kanban-container">
      {/* Column Headers */}
      <div className="table-header">
        <div className="sidebar-header-cell">
          <span className="header-title">USER STORY</span>
        </div>
        {columns.map(col => (
          <div key={col.key} className="column-header-cell">
            <span className="column-title">{col.name}</span>
            <button className="nav-arrow">‹</button>
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="table-body">
        {/* Story Rows */}
        {stories.map(story => (
          <div key={story.id} className="table-row">
            <div className="story-cell">
              <div className="story-header">
                <button 
                  className="expand-btn"
                  onClick={() => toggleStory(story.id)}
                >
                  {story.expanded ? '∨' : '›'}
                </button>
                <span className="story-id">#{story.id}</span>
                <span className="story-name">{story.name}</span>
                <button className="action-btn">+</button>
                <button className="action-btn">≡</button>
              </div>
              {story.tag && (story.expanded && (
                <div className="story-tag-wrapper">
                  <span className="story-tag">
                    <span className="tag-dot"></span>
                    {story.tag}
                  </span>
                  <span className="tag-status">{story.status}</span>
                </div>
              ))}
            </div>
            {columns.map(col => (
              <div 
                key={col.key} 
                className="column-cell"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.key, story.id)}
              >
                {getTasksForStoryInColumn(story.id, col.key).map(task => 
                  renderTaskCard(task, story.id)
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Storyless Tasks Row */}
        <div className="table-row">
          <div className="story-cell">
            <div className="story-header">
              <button className="expand-btn">›</button>
              <span className="story-name storyless">Storyless tasks</span>
              <button className="action-btn">+</button>
              <button className="action-btn">≡</button>
            </div>
          </div>
          {columns.map(col => (
            <div 
              key={col.key} 
              className="column-cell"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.key, null)}
            >
              {getStorylessTasksInColumn(col.key).map(task => 
                renderTaskCard(task, null)
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .kanban-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow: hidden;
        }

        .table-header {
          display: flex;
          background: white;
          border-bottom: 3px solid #e0e0e0;
          flex-shrink: 0;
        }

        .sidebar-header-cell {
          width: 280px;
          min-width: 280px;
          padding: 12px 16px;
          border-right: 1px solid #e0e0e0;
          background: white;
        }

        .header-title {
          font-size: 11px;
          font-weight: 600;
          color: #666;
          letter-spacing: 0.5px;
        }

        .column-header-cell {
          flex: 1;
          min-width: 250px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-right: 1px solid #e0e0e0;
          background: #fafafa;
        }

        .column-title {
          font-size: 11px;
          font-weight: 600;
          color: #666;
          letter-spacing: 0.5px;
        }

        .nav-arrow {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 18px;
          padding: 0 4px;
        }

        .nav-arrow:hover {
          color: #666;
        }

        .table-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: auto;
        }

        .table-row {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          min-height: 100px;
        }

        .story-cell {
          width: 280px;
          min-width: 280px;
          padding: 12px 16px;
          border-right: 1px solid #e0e0e0;
          background: white;
        }

        .story-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .expand-btn {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 0;
          width: 16px;
          font-size: 14px;
        }

        .expand-btn:hover {
          color: #666;
        }

        .story-id {
          font-size: 13px;
          color: #06b6d4;
          font-weight: 500;
        }

        .story-name {
          font-size: 13px;
          color: #333;
          flex: 1;
        }

        .story-name.storyless {
          color: #666;
        }

        .action-btn {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 0 4px;
          font-size: 16px;
        }

        .action-btn:hover {
          color: #666;
        }

        .story-tag-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 22px;
          margin-top: 8px;
        }

        .story-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: #e0f2fe;
          color: #0369a1;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .tag-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #7c3aed;
        }

        .tag-status {
          font-size: 11px;
          color: #999;
        }

        .column-cell {
          flex: 1;
          min-width: 250px;
          padding: 16px;
          border-right: 1px solid #e0e0e0;
          background: #fafafa;
          transition: background-color 0.2s;
        }

        .column-cell:hover {
          background: #f0f0f0;
        }

        .task-card {
          background-color: white;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
          padding: 12px;
          margin-bottom: 12px;
          cursor: grab;
          transition: opacity 0.2s, transform 0.2s;
        }

        .task-card:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .task-card:active {
          cursor: grabbing;
        }

        .task-card.dragging {
          opacity: 0.5;
          cursor: grabbing;
        }

        .task-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .task-title {
          font-size: 13px;
          font-weight: 500;
          color: #333;
          margin: 0;
          line-height: 1.4;
        }

        .task-id {
          color: #06b6d4;
        }

        .task-menu {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 0;
          font-size: 16px;
          font-weight: bold;
          line-height: 1;
        }

        .task-menu:hover {
          color: #666;
        }

        .task-assignment {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .avatar-placeholder {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid #d1d5db;
        }

        .assignment-text {
          font-size: 12px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default KanbanBoard;