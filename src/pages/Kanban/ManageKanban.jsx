import React from 'react'
import { ToastContainer } from 'react-toastify'
import { KanbanBoard } from '../../components/Kanban/kanban-board'
import { Button } from 'flowbite-react'

const ManageKanban = () => {
  return (
    <>
    <ToastContainer />
        <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
          <div className="h-full lg:h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Kanban</h2>
              {/* <Button
                onClick={() => setOpenMoodMasterModal(true)}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add Mood Master
              </Button> */}
            </div>
            <div className='overflow-x-auto w-[1090px]'>
            <KanbanBoard />
            </div>
          </div>
        </div>
     
    </>
  )
}

export default ManageKanban