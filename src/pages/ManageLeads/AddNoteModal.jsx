import { Button, Datepicker, Label, Modal, Textarea } from "flowbite-react"
import { Controller, useForm } from "react-hook-form";
import { convertToSubmitFormat } from "../../utils/DateSubmitFormatter";
import { useDispatch } from "react-redux";
import { addLeadNote, addLeadNoteNew } from "../../Reducer/AddSlice";
import { toast } from "react-toastify";

const AddNoteModal = ({
  leadsId,
  repId,
  openNoteModal,
  setOpenNoteModal,
  onNoteAdded
}) => {

  const dispatch = useDispatch()
  const today = new Date();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // const onSubmit = (data) => {
  //   console.log("Data", data);

  //   const payload = {
  //     lead_id: leadsId,
  //     notes_description: data?.notes_description,
  //     date: data?.date
  //       ? convertToSubmitFormat(data?.date)
  //       : convertToSubmitFormat(today),
  //   }

  //   dispatch(addLeadNote(payload)).then((res) => {
  //     console.log("res", res);
  //     if (res?.payload?.status_code === 201) {
  //       setOpenNoteModal(false)
  //       toast.success(res?.payload?.message)
  //     } else {
  //       toast.error("Failed to add note. Please try again.")
  //     }
  //   }).catch((error) => {
  //     console.error("Error adding note:", error);
  //     toast.error("Failed to add note. Please try again.")
  //   })
  // }

  const onSubmit = (data) => {
    console.log("Data", data);

    const payload = {
      leadId: leadsId,
      repId: repId,
      noteDescriptions: data?.notes_description,
      date: data?.date
        ? new Date(data.date).toISOString()
        : today.toISOString(),
    };

    console.log("payload", payload);

    dispatch(addLeadNoteNew(payload))
      .unwrap()
      .then((res) => {
        console.log("res", res);
        toast.success("Note added successfully");
        reset();
        setOpenNoteModal(false);
        if (onNoteAdded) {
          onNoteAdded();
        }
      })
      .catch((error) => {
        console.error("Error adding note:", error);
        toast.error("Failed to add note. Please try again.");
      });
  };

  return (
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
