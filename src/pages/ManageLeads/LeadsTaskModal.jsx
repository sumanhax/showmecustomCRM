
import { Button, Datepicker, Label, Modal, Select, Textarea, TextInput } from "flowbite-react"
import { Controller, useForm } from "react-hook-form";
import { convertToSubmitFormat } from "../../utils/DateSubmitFormatter";
import { useDispatch } from "react-redux";
import { addTaskLeads } from "../../Reducer/TaskSlice";

const LeadsTaskModal=({
     leadsId,
    opentaskModal,
    setOpenTaskModal
})=>{
const dispatch=useDispatch()
      const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit=(data)=>{
    console.log("Data",data);
    
    const payload={
        
        lead_id:leadsId,
        action_description:data?.action_description,
        due_date:convertToSubmitFormat(data?.due_date),
        action_type:data?.action_type,
        status:"Pending"
    }
dispatch(addTaskLeads(payload)).then((res)=>{
    console.log("res",res);
    if(res?.payload?.status_code===201){
        setOpenTaskModal(false)
    }
    
})
  }
    return(
        <>
         <Modal
                show={opentaskModal}
                onClose={() => setOpenTaskModal(false)}
              >
                <Modal.Header>Add Task </Modal.Header>
                <form 
                
               onSubmit={handleSubmit(onSubmit)}
                >
                  <Modal.Body>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="name" value="Action Description" />
                        </div>
                        <Textarea
                          id="name"
                          type="text"
                          placeholder="Action Description"
                          {...register("action_description")}
                        />
                      </div>
                       <div>
                        <div className="mb-2 block">
                          <Label htmlFor="name" value="Due date" />
                        </div>
                      <Controller
                        control={control}
                        name="due_date"
                        render={({ field }) => (
                          <Datepicker
                          {...field}
                          onChange={(date) => field.onChange(date)}
                        />
                      )}
              />
                      </div>
                       <div>
                        <div className="mb-2 block">
                          <Label htmlFor="name" value="Action Type" />
                        </div>
                     <Select {...register("action_type")}>
                        <option>Select</option>
                        <option value="Follow Up">Follow Up</option>
                        <option value="Call">Call</option>
                        <option value="Text">Text</option>
                        <option value="Email">Email</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Note">Note</option>
                     </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      className="cnl_btn"
                      onClick={() => setOpenTaskModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button color="success" type="submit">
                      Add Task
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
        </>
    )
}
export default LeadsTaskModal