import React, { useState } from 'react';
import Modal from './Modal';

const KanbanBoard = () => {
  const [stories, setStories] = useState([
    { 
      id: 1, 
      name: 'Add traduction to web model',
      tag: 'N/E',
      status: 'NEW',
      subtasks: [
        { id: 3, name: 'qcqscsqc', status: 'NEW', assigned: false, assignedTo: "John Doe" },
        { id: 2, name: 'dddddd', status: 'NEW', assigned: false, assignedTo: "rafik" },
        { id: 4, name: 'zxzxzxz', status: 'NEW', assigned: false, assignedTo: "rafik" }
      ], 
      expanded: true 
    },
    { 
      id: 9, 
      name: 'Test2',
      tag: 'N/E',
      status: 'NEW',
      subtasks: [
        { id: 5, name: 'zxéxzé', status: 'NEW', assigned: false },
        { id: 6, name: 'zèxzèxéxèzxèxé', status: 'NEW', assigned: false }
      ], 
      expanded: true 
    }
    
  ]);

  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Rafik' },
    { id: 3, name: 'Alice' },
    { id: 4, name: 'Bob' },
  ];

  const [tasks, setTasks] = useState([
    { id: 7, name: 'ecezcezce', status: 'NEW', assigned: false },
    { id: 8, name: 'ecezcezce 2', status: 'NEW', assigned: false }
  ]);

  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { name: 'NEW', key: 'NEW' },
    { name: 'IN PROGRESS', key: 'IN_PROGRESS' },
    { name: 'READY FOR TEST', key: 'READY_FOR_TEST' },
    { name: 'CLOSED', key: 'CLOSED' },
    { name: 'NEEDS INFO 1', key: 'NEEDS_INFO_1' },
    { name: 'NEEDS INFO 2', key: 'NEEDS_INFO_2' },
    { name: 'NEEDS INFO 3', key: 'NEEDS_INFO_3' },
    { name: 'NEEDS INFO 3', key: 'NEEDS_INFO_3' },
    { name: 'NEEDS INFO 3', key: 'NEEDS_INFO_3' },

    
  ];

  const [showModal, setShowModal] = useState(false);
  const [modalStoryId, setModalStoryId] = useState(null);
  const [newTaskData, setNewTaskData] = useState({
    name: '',
    status: 'NEW',
    assigned: false,
    assignedTo: ''
  });

  const generateId = () => {
    const allIds = [
      ...stories.flatMap(story => story.subtasks.map(t => t.id)),
      ...tasks.map(t => t.id)
    ];
    return Math.max(...allIds, 0) + 1;
  };

  const getTasksForStoryInColumn = (storyId, columnKey) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return [];
    return story.subtasks.filter(task => task.status === columnKey);
  };

  const getStorylessTasksInColumn = (columnKey) =>
    tasks.filter(task => task.status === columnKey);

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

    if (sourceStoryId === targetStoryId) {
      if (sourceStoryId !== null) {
        setStories(prev => prev.map(story => ({
          ...story,
          subtasks: story.subtasks.map(task =>
            task.id === draggedTask.id ? { ...task, status: newStatus } : task
          )
        })));
      } else {
        setTasks(prev => prev.map(task =>
          task.id === draggedTask.id ? { ...task, status: newStatus } : task
        ));
      }
    } else {
      const taskToMove = { ...draggedTask, status: newStatus };
      delete taskToMove.storyId;

      if (sourceStoryId !== null) {
        setStories(prev => prev.map(story => ({
          ...story,
          subtasks: story.subtasks.filter(task => task.id !== draggedTask.id)
        })));
      } else {
        setTasks(prev => prev.filter(task => task.id !== draggedTask.id));
      }

      if (targetStoryId !== null) {
        setStories(prev => prev.map(story =>
          story.id === targetStoryId
            ? { ...story, subtasks: [...story.subtasks, taskToMove] }
            : story
        ));
      } else {
        setTasks(prev => [...prev, taskToMove]);
      }
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => setDraggedTask(null);

  const toggleStory = (storyId) => {
    setStories(prev => prev.map(story =>
      story.id === storyId ? { ...story, expanded: !story.expanded } : story
    ));
  };

  const openAddTaskModal = (storyId = null) => {
    setModalStoryId(storyId);
    setNewTaskData({ name: '', status: 'NEW', assigned: false, assignedTo: '' });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTaskData(prev => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'assigned' && checked && !prev.assignedTo) {
        updated.assignedTo = users[0].name;
      }
      return updated;
    });
  };

  const saveNewTask = () => {
    const newTask = { id: generateId(), ...newTaskData };
    if (modalStoryId) {
      setStories(prev => prev.map(story =>
        story.id === modalStoryId
          ? { ...story, subtasks: [...story.subtasks, newTask] }
          : story
      ));
    } else {
      setTasks(prev => [...prev, newTask]);
    }
    setShowModal(false);
  };

  const renderTaskCard = (task, storyId, expanded) => {
    const { assigned, assignedTo } = task;
    return expanded ? (
      <div
        key={task.id}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-2 cursor-move hover:shadow-md transition-shadow ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, task, storyId)}
        onDragEnd={handleDragEnd}
      >
        <div className="mb-2">
          <h3 className="text-sm font-medium">
            <span className="text-gray-500 text-xs">#{task.id}</span> {task.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
            {assignedTo ? assignedTo.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="text-xs text-gray-600">{assigned ? assignedTo : 'Not assigned'}</span>
        </div>
      </div>
    ) : (
      <div
        key={task.id}
        className={`bg-white rounded border border-gray-200 p-2 mb-2 cursor-move hover:shadow-md transition-shadow flex items-center justify-center ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, task, storyId)}
        onDragEnd={handleDragEnd}
      >
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
          {assignedTo ? assignedTo.charAt(0).toUpperCase() : '?'}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="overflow-x-auto w-full">
        <div style={{ minWidth: '1400px' }}>
          
          {/* Header Row */}
          <div className="flex bg-gray-100 border-b border-gray-300">
            <div className="p-4 border-r border-gray-300" style={{ minWidth: '250px', width: '250px' }}>
              <span className="font-semibold text-sm text-gray-700">USER STORY</span>
            </div>
            {columns.map(col => (
              <div key={col.key} className="p-4 border-r border-gray-300 last:border-r-0" style={{ minWidth: '180px', flex: '1' }}>
                <span className="font-semibold text-xs text-gray-700">{col.name}</span>
              </div>
            ))}
          </div>

          {/* Stories */}
          {stories.map(story => (
            <div key={story.id} className="flex border-b border-gray-200">
              <div className="p-4 bg-gray-50 border-r border-gray-300" style={{ minWidth: '250px', width: '250px' }}>
                <div className="flex items-center gap-2">
                  <button 
                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded"
                    onClick={() => toggleStory(story.id)}
                  >
                    {story.expanded ? '∨' : '›'}
                  </button>
                  <span className="text-xs text-gray-500">#{story.id}</span>
                  <span className="text-sm font-medium flex-1">{story.name}</span>
                  <button 
                    className="w-6 h-6 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded font-bold"
                    onClick={() => openAddTaskModal(story.id)}
                  >
                    +
                  </button>
                </div>
              </div>

              {columns.map(col => (
                <div
                  key={col.key}
                  className="p-2 bg-white border-r border-gray-300"
                  style={{ minWidth: '180px', flex: '1', minHeight: '120px' }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.key, story.id)}
                >
                  {getTasksForStoryInColumn(story.id, col.key).map(task =>
                    renderTaskCard(task, story.id, story.expanded)
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Storyless Tasks */}
          <div className="flex border-b border-gray-200">
            <div className="p-4 bg-gray-50 border-r border-gray-300" style={{ minWidth: '250px', width: '250px' }}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium italic text-gray-600 flex-1">Storyless tasks</span>
                <button 
                  className="w-6 h-6 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded font-bold"
                  onClick={() => openAddTaskModal(null)}
                >
                  +
                </button>
              </div>
            </div>

            {columns.map(col => (
              <div
                key={col.key}
                className="p-2 bg-white border-r border-gray-300"
                style={{ minWidth: '180px', flex: '1', minHeight: '120px' }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.key, null)}
              >
                {getStorylessTasksInColumn(col.key).map(task =>
                  renderTaskCard(task, null, true)
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <Modal title="Add New Task" onClose={() => setShowModal(false)} onSave={saveNewTask}>
          
          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">Name:</span>
            <input 
              type="text" 
              name="name" 
              value={newTaskData.name} 
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select 
              name="status" 
              value={newTaskData.status} 
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              {columns.map(col => <option key={col.key} value={col.key}>{col.name}</option>)}
            </select>
          </label>

          <label className="flex items-center gap-2 mb-2">
            <input 
              type="checkbox" 
              name="assigned" 
              checked={newTaskData.assigned} 
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Assigned</span>
          </label>

          {newTaskData.assigned && (
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Assigned To:</span>
              <select
                name="assignedTo"
                value={newTaskData.assignedTo}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.name}>{user.name}</option>
                ))}
              </select>
            </label>
          )}

        </Modal>
      )}
    </div>
  );
};

export default KanbanBoard;