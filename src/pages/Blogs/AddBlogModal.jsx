// import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react"
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { addBlog, getBlog } from "../../Reducer/BlogSlice";

// const AddBlogModal=({
//      openBlogModal,
//               setOpenBlogModal
// })=>{
//       const dispatch = useDispatch();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
// const onSubmit=(data)=>{
//     const formData=new FormData()
//     formData.append("title",data?.title)                       
//     formData.append("content",data?.content)
//     formData.append("image",data?.image?.[0])
//     dispatch(addBlog(formData)).then((res)=>{
//         if(res?.payload?.status_code===201){
//             setOpenBlogModal(false)
//              dispatch(getBlog());
//         }
//     })

// }
//     return(
//         <>
//                  <Modal
//                         show={openBlogModal}
//                         onClose={() => setOpenBlogModal(false)}
//                       >
//                         <Modal.Header>Add New Blog</Modal.Header>
//                         <form
                        
//                          onSubmit={handleSubmit(onSubmit)}
//                         >
//                           <Modal.Body>
//                             <div className="space-y-4">
//                               <div>
//                                 <div className="mb-2 block">
//                                   <Label htmlFor="name" value="Blog Title" />
//                                 </div>
//                                 <TextInput
//                                   id="name"
//                                   type="text"
//                                   placeholder="Enter Title"
//                                   {...register("title")}
//                                 />
//                               </div>
//                               <div>
//                                 <div className="mb-2 block">
//                                   <Label htmlFor="name" value="Content" />
//                                 </div>
//                                 <TextInput
//                                   id="name"
//                                   type="text"
//                                   placeholder="Enter Content"
//                                   {...register("content")}
//                                 />
//                               </div>
//                               <div>
//                                 <div className="mb-2 block">
//                                   <Label htmlFor="name" value="Blog Image" />
//                                 </div>
//                                 <FileInput id="file-upload" {...register("image")} />
//                               </div>
//                             </div>
//                           </Modal.Body>
//                           <Modal.Footer>
//                             <Button
//                               className="cnl_btn"
//                               onClick={() => setOpenBlogModal(false)}
//                             >
//                               Cancel
//                             </Button>
//                             <Button color="success" type="submit">
//                               Add Blog
//                             </Button>
//                           </Modal.Footer>
//                         </form>
//                 </Modal>
//         </>
//     )
// }
// export default AddBlogModal


import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react"
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addBlog, getBlog } from "../../Reducer/BlogSlice";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from "react-toastify";

const AddBlogModal = ({
  openBlogModal,
  setOpenBlogModal
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append("title", data?.title)
    formData.append("content", data?.content)
    formData.append("image", data?.image?.[0])
    
    dispatch(addBlog(formData)).then((res) => {
        console.log("Res",res);
        
      if (res?.payload?.status_code === 201) {
        setOpenBlogModal(false)
       
        dispatch(getBlog());
      }
      else if(res?.payload?.response?.data?.status_code===400){
        toast.error(res?.payload?.response?.data?.message)
      }
    })
  }

  const handleModalClose = () => {
    setOpenBlogModal(false)
    reset() // Reset form when modal is closed
  }

  return (
    <>
      <Modal
        show={openBlogModal}
        onClose={handleModalClose}
        size="2xl" // Make modal larger to accommodate CK Editor
      >
        <Modal.Header>Add New Blog</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Blog Title" />
                </div>
                <TextInput
                  id="title"
                  type="text"
                  placeholder="Enter Title"
                  {...register("title", { 
                    required: "Title is required" 
                  })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="content" value="Content" />
                </div>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: "Content is required" }}
                  render={({ field }) => (
                    <CKEditor
                      editor={ClassicEditor}
                      config={{
                        toolbar: [
                          'heading',
                          '|',
                          'bold',
                          'italic',
                          'link',
                          'bulletedList',
                          'numberedList',
                          '|',
                          'outdent',
                          'indent',
                          '|',
                          'blockQuote',
                          'insertTable',
                          'undo',
                          'redo'
                        ],
                        placeholder: 'Write your blog content here...',
                      }}
                      data={field.value || ''}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        field.onChange(data);
                      }}
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>
              
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="image" value="Blog Image" />
                </div>
                <FileInput 
                  id="image" 
                  accept="image/*"
                  {...register("image", {
                    required: "Image is required"
                  })} 
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cnl_btn"
              type="button"
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Add Blog
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddBlogModal