import { Button, Datepicker, Label, Modal, Textarea } from "flowbite-react"
import { Controller, useForm } from "react-hook-form";
import { convertToSubmitFormat } from "../../utils/DateSubmitFormatter";
import { useDispatch } from "react-redux";
import { addLeadNote } from "../../Reducer/AddSlice";
import { toast } from "react-toastify";

const AddNoteModal = ({
  leadsId,
  openNoteModal,
  setOpenNoteModal
}) => {

  const dispatch = useDispatch()
  const today = new Date();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Data", data);

    const payload = {
      lead_id: leadsId,
      notes_description: data?.notes_description,
      date: data?.date
        ? convertToSubmitFormat(data?.date)
        : convertToSubmitFormat(today),
    }
    
    dispatch(addLeadNote(payload)).then((res) => {
      console.log("res", res);
      if (res?.payload?.status_code === 201) {
        setOpenNoteModal(false)
        toast.success(res?.payload?.message)
      } else {
        toast.error("Failed to add note. Please try again.")
      }
    }).catch((error) => {
      console.error("Error adding note:", error);
      toast.error("Failed to add note. Please try again.")
    })
  }

  return(
      <>
       <Modal
              show={openNoteModal}
              onClose={() => setOpenNoteModal(false)}
            >
              <Modal.Header>Add Note</Modal.Header>
              <form 
              
             onSubmit={handleSubmit(onSubmit)}
              >
                <Modal.Body>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="notes_description" value="Note Description" />
                      </div>
                      <Textarea
                        id="notes_description"
                        type="text"
                        placeholder="Enter note description..."
                        {...register("notes_description", { required: "Note description is required" })}
                      />
                      {errors.notes_description && (
                        <p className="text-red-500 text-sm mt-1">{errors.notes_description.message}</p>
                      )}
                    </div>
                     <div>
                      <div className="mb-2 block">
                        <Label htmlFor="date" value="Date" />
                      </div>
                    <Controller
                      control={control}
                      name="date"
                      render={({ field }) => (
                        <Datepicker
                        {...field}
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
            />
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="cnl_btn"
                    onClick={() => setOpenNoteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button color="success" type="submit">
                    Add Note
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>
      </>
  )
}
export default AddNoteModal
