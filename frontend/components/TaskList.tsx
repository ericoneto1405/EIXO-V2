
import React from 'react';
import { Tarefa } from '../types';
import ChartCard from './ChartCard';

const TaskList: React.FC = () => {
    const tasks: Tarefa[] = [];

    return (
        <ChartCard title="Tarefas Pendentes">
            {tasks.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma tarefa cadastrada ainda.</p>
            ) : (
                <div className="space-y-3">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50">
                            <input
                                type="checkbox"
                                checked={task.concluida}
                                readOnly
                                className={`h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary ${task.concluida ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            />
                            <div className={`flex-1 ml-4 ${task.concluida ? 'line-through text-gray-400' : ''}`}>
                                <p className="font-medium text-gray-800 dark:text-gray-100">{task.titulo}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {task.responsavel} - Vence: {task.prazo}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ChartCard>
    );
};

export default TaskList;
