// import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react"
// import { useForm, Controller } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { addBlog, getBlog } from "../../Reducer/BlogSlice";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { toast } from "react-toastify";
// import { useEffect } from "react";

// const UpdateBlogModal = ({
//    openUpdateBlogModal,
//               setOpenUpdateBlogModal,
//               blogId,
//               singleBlog
// }) => {
//   const dispatch = useDispatch();
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     control,
//     formState: { errors },
//     reset
//   } = useForm();

//   useEffect(()=>{
// setValue("title",singleBlog?.data?.title)
// setValue("content",singleBlog?.data?.content)

//   },[singleBlog])

//   const onSubmit = (data) => {
//     const formData = new FormData()
//     formData.append("title", data?.title)
//     formData.append("content", data?.content)
//     formData.append("image", data?.image?.[0])
    
//     dispatch(addBlog(formData)).then((res) => {
//         console.log("Res",res);
        
//       if (res?.payload?.status_code === 201) {
//         setOpenBlogModal(false)
       
//         dispatch(getBlog());
//       }
//       else if(res?.payload?.response?.data?.status_code===400){
//         toast.error(res?.payload?.response?.data?.message)
//       }
//     })
//   }

//   const handleModalClose = () => {
//     setOpenUpdateBlogModal(false)
//     reset() // Reset form when modal is closed
//   }

//   return (
//     <>
//       <Modal
//         show={openUpdateBlogModal}
//         onClose={handleModalClose}
//         size="2xl" // Make modal larger to accommodate CK Editor
//       >
//         <Modal.Header>Update Blog</Modal.Header>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Modal.Body>
//             <div className="space-y-4">
//               <div>
//                 <div className="mb-2 block">
//                   <Label htmlFor="title" value="Blog Title" />
//                 </div>
//                 <TextInput
//                   id="title"
//                   type="text"
//                   placeholder="Enter Title"
//                   {...register("title", { 
//                     required: "Title is required" 
//                   })}
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
//                 )}
//               </div>
              
//               <div>
//                 <div className="mb-2 block">
//                   <Label htmlFor="content" value="Content" />
//                 </div>
//                 <Controller
//                   name="content"
//                   control={control}
//                   rules={{ required: "Content is required" }}
//                   render={({ field }) => (
//                     <CKEditor
//                       editor={ClassicEditor}
//                       config={{
//                         toolbar: [
//                           'heading',
//                           '|',
//                           'bold',
//                           'italic',
//                           'link',
//                           'bulletedList',
//                           'numberedList',
//                           '|',
//                           'outdent',
//                           'indent',
//                           '|',
//                           'blockQuote',
//                           'insertTable',
//                           'undo',
//                           'redo'
//                         ],
//                         placeholder: 'Write your blog content here...',
//                       }}
//                       data={field.value || ''}
//                       onChange={(event, editor) => {
//                         const data = editor.getData();
//                         field.onChange(data);
//                       }}
//                     />
//                   )}
//                 />
//                 {errors.content && (
//                   <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
//                 )}
//               </div>
              
//               <div>
//                 <div className="mb-2 block">
//                   <Label htmlFor="image" value="Blog Image" />
//                 </div>
//                 <FileInput 
//                   id="image" 
//                   accept="image/*"
//                   {...register("image", {
//                     required: "Image is required"
//                   })} 
//                 />
//                 {errors.image && (
//                   <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
//                 )}
//               </div>
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button
//               className="cnl_btn"
//               type="button"
//               onClick={handleModalClose}
//             >
//               Cancel
//             </Button>
//             <Button color="success" type="submit">
//               Update Blog
//             </Button>
//           </Modal.Footer>
//         </form>
//       </Modal>
//     </>
//   )
// }

// export default UpdateBlogModal