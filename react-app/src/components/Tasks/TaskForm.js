import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOneTask, updateOneTask, deleteOneTask } from '../../store/tasks';
import { getTaskById } from '../../store/tasks';
import { oneWorkspace } from '../../store/workspace'

import './TaskStyle/TaskForm.css'

const TaskForm = ({ taskId, setShowModal, userId: passedUserId, projectId: passedProjectId, setShowTaskDetail, plainForm }) => {
    const dispatch = useDispatch();
    const { workspace, users, projects } = useSelector((state) => state.workspace)
    const workspaceId = workspace.id
    const [task, setTask] = useState(null)

    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [description, setDescription] = useState('');
    const [complete, setComplete] = useState(false);
    const [userId, setUserId] = useState(passedUserId || 0);
    const [projectId, setProjectId] = useState(passedProjectId || 0);
    const [errors, setErrors] = useState([])
    const [hasSubmitted, setHasSubmitted] = useState(false)

    useEffect(async () => {

        if (taskId) {
            const foundTask = await dispatch(getTaskById(taskId))
            let inputDate;
            foundTask.dueDate ?
                inputDate = new Date(foundTask.dueDate).toJSON().split("T")[0] : inputDate = ''
            setTask(foundTask)
            setName(foundTask.name)
            setDueDate(inputDate)
            setDescription(foundTask.description)
            setComplete(foundTask.complete)
            setUserId(foundTask.userId)
            setProjectId(foundTask.projectId)
        } else {
            setName('');
            setDueDate('');
            setDescription('');
            setComplete(false);
            setUserId(passedUserId || 0);
            setProjectId(passedProjectId || 0);
            setErrors([])
            setHasSubmitted(false)
        }
    }, [dispatch, taskId])

    useEffect(async () => {
        let errors = []
        if (!name) errors.push('error: Task Name is required')
        if (!projectId) errors.push('error: Please choose a project')
        if (!dueDate) errors.push('error: Please choose a due date')
        if (!userId) errors.push('error: Please choose a user')
        setErrors(errors)
    }, [name, projectId, userId, dueDate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true)
        let formData = {
            name,
            dueDate,
            description,
            userId,
            projectId,
            complete
        }
        // let data
        if (!errors.length && !task) {
            let data = await dispatch(createOneTask(formData))
            if (Array.isArray(data)) {
                setErrors(data)
            } else {
                await dispatch(oneWorkspace(workspaceId))
                if (!plainForm) setShowModal(false)
                if (plainForm) setShowTaskDetail(false)
            }
        }

        if (!errors.length && task) {
            formData.id = taskId;
            let data = await dispatch(updateOneTask(formData))
            if (Array.isArray(data)) {
                setErrors(data)
            } else {
                await dispatch(oneWorkspace(workspaceId))
                if (!plainForm) setShowModal(false)
                if (plainForm) setShowTaskDetail(false)
            }
        }
    }


    return (
        <>
            {(
                <div className='task-form-container' style={{ borderLeft: plainForm ? 'solid 1px gray' : 'none' }}>
                    {/* <div className='task-form-top-container' style={{}}> */}
                    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div href="javascript:void(0)" className="closebtn"
                            style={{ display: plainForm ? 'block' : 'none', marginRight: '35px', cursor: 'pointer' }}
                            onClick={() => { setShowTaskDetail(false) }}>&times;</div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingLeft: '60px' }}>
                            <div className='task-complete'
                                style={{
                                    padding: '4px',
                                    backgroundColor: complete.toString() === 'false' ? 'gray' : 'green', cursor: 'pointer'
                                }}
                                onClick={async () => {
                                    if (taskId) {
                                        await dispatch(updateOneTask({
                                            id: taskId,
                                            name: task.name,
                                            dueDate: new Date(task.dueDate).toJSON().split("T")[0],
                                            description: task.description,
                                            userId: task.userId,
                                            projectId: task.projectId,
                                            complete: !complete
                                        }))
                                        await dispatch(oneWorkspace(workspaceId))
                                    }
                                    setComplete(!complete);
                                }}>
                                <i className="fa fa-check-circle-o" aria-hidden="true"></i>
                                {complete.toString() === 'false' ? "Mark Complete" : "Completed"}
                            </div>
                            <h2 style={{ marginLeft: '10px' }}>My Task</h2>
                        </div>

                        {hasSubmitted && errors.length > 0 && (<div className='errorContainer project-errors '>
                            {errors.map((error, ind) => (
                                <div key={ind} className='errorText'>{error.split(":")[1]}</div>
                            ))}
                        </div>)}


                        <div className='task-input-container'>
                            <label htmlFor='name' className='task-form-label'>Name</label>
                            <input className='task-form-input' type='text' name='name' onChange={e => setName(e.target.value)} value={name} required placeholder='Your task name' />
                        </div>
                        <div className='task-input-container'>
                            <label htmlFor='dueDate' className='task-form-label'>Due Date</label>
                            <input className='task-form-input' type='date' name='dueDate' onChange={e => setDueDate(e.target.value)} value={dueDate} />
                        </div>
                        <div className='task-input-container'>
                            <label htmlFor='userId' className='task-form-label'>Assignee</label>
                            <select className='task-select-class' name='userId' required onChange={e => setUserId(e.target.value)} value={userId}
                                style={{ background: 'none', color: 'whitesmoke' }}>
                                <option className='task-option' disabled value={0}>Choose a user</option>
                                {
                                    Object.values(users).map(user => (
                                        <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='task-input-container'>
                            <label htmlFor='projectId' className='task-form-label'>Project</label>
                            <select name='projectId' className='task-select-class' required onChange={e => setProjectId(e.target.value)} value={projectId} style={{ background: 'none', color: 'whitesmoke' }}>
                                <option className='task-option' disabled value={0}>Choose a project</option>
                                {
                                    projects.map(project => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='task-input-container'>
                            <label htmlFor='description' className='task-form-label' >Description</label>
                            <textarea className='task-form-textarea' type='text' name='description'
                                style={{ height: '80px' }}
                                onChange={e => setDescription(e.target.value)} value={description}
                                placeholder="Add a description for your task here (Optional)" />
                        </div>
                        <div className='task-button-container, task-input-container' style={{ alignItems: 'center' }}>
                            <button type='submit'
                                className={'task-form-button'}
                                style={{ marginTop: '3px' }}
                            >Submit</button>
                            {taskId && (
                                <button
                                    className={'task-form-button'}
                                    style={{ background: '#d11a2a' }}
                                    onClick={async () => {
                                        await dispatch(deleteOneTask(taskId))
                                        await dispatch(oneWorkspace(workspaceId))
                                        if (!plainForm) setShowModal(false)
                                        if (plainForm) setShowTaskDetail(false)
                                    }}>Delete</button>
                            )}
                        </div>
                    </form >

                </div >
            )
            }
        </>
    )
}

export default TaskForm
