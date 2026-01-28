import { Button, Datepicker, Label, Modal, Select, Textarea, TextInput } from "flowbite-react";
import { Controller, useForm } from "react-hook-form";
import { convertToSubmitFormat } from "../../utils/DateSubmitFormatter";
import { useDispatch } from "react-redux";
import { addAction } from "../../Reducer/AddSlice"; 
import { toast } from "react-toastify";

const LeadsTaskModal = ({ leadsId, opentaskModal, setOpenTaskModal }) => {
  const dispatch = useDispatch();
  const today = new Date();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      action_type: "FOLLOW_UP",
      priority: "LOW",
      title: "",
      action_description: "",
      due_date: today,
    },
  });

  const onSubmit = (data) => {
    const payload = {
      lead_id: leadsId,
      action_description: data?.action_description,
      due_date: data?.due_date
        ? convertToSubmitFormat(data?.due_date)
        : convertToSubmitFormat(today),
      action_type: data?.action_type, // ✅ FOLLOW_UP, CALL, TEXT, EMAIL, MEETING, NOTE
      priority: data?.priority, // ✅ LOW, MEDIUM, HIGH
      ...(data?.title?.trim() ? { title: data.title.trim() } : {}), // ✅ optional
    };

    dispatch(addAction(payload)).then((res) => {
      if (res?.payload?.status_code === 201) {
        setOpenTaskModal(false);
        toast.success(res?.payload?.message || "Action added");
      } else {
        toast.error(res?.payload?.message || "Failed to add action");
      }
    });
  };

  return (
    <>
      <Modal show={opentaskModal} onClose={() => setOpenTaskModal(false)}>
        <Modal.Header>Add Task</Modal.Header>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              {/* Title (Optional) */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Title (optional)" />
                </div>
                <TextInput
                  id="title"
                  type="text"
                  placeholder="Call for approval"
                  {...register("title")}
                />
              </div>

              {/* Action Description */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="action_description" value="Action Description" />
                </div>
                <Textarea
                  id="action_description"
                  placeholder="Follow up with customer for design approval"
                  {...register("action_description", { required: "Action description is required" })}
                />
                {errors?.action_description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.action_description.message}
                  </p>
                )}
              </div>

              {/* Due Date */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="due_date" value="Due date" />
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

              {/* Action Type */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="action_type" value="Action Type" />
                </div>
                <Select id="action_type" {...register("action_type", { required: true })}>
                  <option value="FOLLOW_UP">FOLLOW_UP</option>
                  <option value="CALL">CALL</option>
                  <option value="TEXT">TEXT</option>
                  <option value="EMAIL">EMAIL</option>
                  <option value="MEETING">MEETING</option>
                  <option value="NOTE">NOTE</option>
                </Select>
              </div>

              {/* Priority */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="priority" value="Priority" />
                </div>
                <Select id="priority" {...register("priority", { required: true })}>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </Select>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button className="cnl_btn" onClick={() => setOpenTaskModal(false)} type="button">
              Cancel
            </Button>
            <Button color="success" type="submit">
              Add Task
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default LeadsTaskModal;
