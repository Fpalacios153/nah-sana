import { oneWorkspace } from "../../store/workspace";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import TaskForm from "./TaskForm";
import './TaskStyle/TaskDetail.css'
import './TaskList.css'
import './TaskStyle/TaskTable.css'

const TasksListUserProfile = ({ props }) => {
    const dispatch = useDispatch()
    let workspaceId = props.workspaceId;
    const workspace = useSelector((state) => state.workspace)
    const tasksArr = workspace.tasks
    let filteredTasks;
    if (tasksArr) {
        filteredTasks = tasksArr.filter(task => Number(task.userId) === Number(props.id))
    }

    function modifyDate(str) {
        const dateStr = str.split(', ')
        const modifiedDate = `${dateStr[1].split(' ')[1]} ${dateStr[1].split(' ')[0]}`
        return modifiedDate
    }


    const sortedTasks = filteredTasks?.sort(function (a, b) {
        return new Date(modifyDate(b.dueDate)) - new Date(modifyDate(a.dueDate))
    })

    const [showTaskDetail, setShowTaskDetail] = useState(false)
    const [onClickTaskId, setOnClickTaskId] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [showSideBar, setShowSideBar] = useState(false)


    useEffect(() => {
        dispatch(oneWorkspace(workspaceId)).then(() => setIsLoaded(true))
    }, [dispatch, workspaceId])

    return isLoaded ? (
        <>
            <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', flexGrow: '1' }} >
                    <div style={{ width: '100%' }}>
                        <div className='add-task-button'
                            onClick={() => {
                                setShowTaskDetail(true)
                                setOnClickTaskId(null)
                            }}>
                            <i className="fa-solid fa-plus"></i> Add Task
                        </div>
                        {sortedTasks && (
                            <table className={showTaskDetail ? "table-onclick" : "table"}>
                                <tbody>
                                    <tr className="table-row">
                                        <th className="table-head">Task Name</th>
                                        <th className="table-head">Due Date</th>
                                    </tr>
                                    {sortedTasks.length === 0 && (<div className="horizontal-separator"></div>)}
                                    {sortedTasks.map((task) => (
                                        <tr key={task.id} className="table-row">
                                            <td className="table-cell" id='task-name'
                                                onClick={() => (
                                                    setShowTaskDetail(true),
                                                    setOnClickTaskId(task.id),
                                                    setShowSideBar(!showSideBar)
                                                )}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div>
                                                    <i className="fa fa-check-circle-o" aria-hidden="true" style={{ color: task.complete ? 'green' : 'white', borderRadius: '10px' }}></i>  {task.name}
                                                </div>
                                            </td>
                                            <td className="table-cell">{task?.dueDate.split(' ')[2]} {task?.dueDate.split(' ')[1]}</td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table >
                        )}
                    </div>
                </div>
                <div>
                    {showTaskDetail ? <TaskForm plainForm={true} taskId={onClickTaskId} setShowTaskDetail={setShowTaskDetail} /> : null}
                </div>
            </div >
        </>
    ) : null
}

export default TasksListUserProfile
